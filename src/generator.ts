import { type Chat, type GeneratorController, type InferParsedConfig } from "@lmstudio/sdk";
import OpenAI from "openai";
import {
    type ChatCompletionMessageParam,
    type ChatCompletionMessageToolCall,
    type ChatCompletionTool,
    type ChatCompletionToolMessageParam,
} from "openai/resources/index";
import { configSchematics, globalConfigSchematics, SYSTEM_PROMPT_VARIABLES } from "./config";
import * as fs from "node:fs";
import * as https from "node:https";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type ToolCallState = {
    id: string;
    name: string | null;
    index: number;
    arguments: string;
};

type ReasoningDisplay = "native" | "inline-tags" | "hidden";

type ParsedModelConfig = InferParsedConfig<typeof configSchematics>;

/**
 * The exact body this plugin sends to the llama.cpp server's /v1/chat/completions.
 * Exported for the unit tests (see scratches in the plugin workspace).
 */
export type LlamaChatBody = Record<string, any>;

/** Fragment options forwarded to the LM Studio UI (subset of the SDK's). */
type FragmentOpts = { tokenCount?: number; reasoningType?: "none" | "reasoning" };

/* -------------------------------------------------------------------------- */
/*                           Client & request building                        */
/* -------------------------------------------------------------------------- */

/** Build a pre-configured OpenAI client pointed at the llama.cpp server. */
function createClient(
    globalConfig: InferParsedConfig<typeof globalConfigSchematics>,
): OpenAI {
    const baseURL = globalConfig.get("baseUrl");
    const apiKey = globalConfig.get("apiKey");
    const timeoutMs = globalConfig.get("timeoutMs");
    const maxRetries = globalConfig.get("maxRetries");
    const caCertPath = globalConfig.get("caCertPath");

    let httpsAgent: https.Agent | undefined;
    if (baseURL.startsWith("https://") && caCertPath) {
        try {
            const ca = fs.readFileSync(caCertPath, "utf8");
            httpsAgent = new https.Agent({ ca, keepAlive: true });
            console.info(`[llama-compat] Using custom CA certificate: ${caCertPath}`);
        } catch (err) {
            console.warn(`[llama-compat] Failed to read CA cert at ${caCertPath}:`, (err as Error).message);
        }
    }

    return new OpenAI({
        apiKey: apiKey || "no-key", // llama.cpp ignores the key unless --api-key is set.
        baseURL,
        timeout: timeoutMs,
        maxRetries,
        ...(httpsAgent ? { httpsAgent } : {}),
        defaultHeaders: { "Content-Type": "application/json" },
    });
}

/** Process system prompt with dynamic variable substitution (as-is, before validation). */
export function processSystemPrompt(systemPrompt: string, model: string): string {
    if (!systemPrompt) {
        return "";
    }

    const now = new Date();
    const variables: Record<string, string> = {
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        datetime: now.toLocaleString(),
        model: model,
        timestamp: now.toISOString(),
        year: now.getFullYear().toString(),
        month: (now.getMonth() + 1).toString().padStart(2, "0"),
        day: now.getDate().toString().padStart(2, "0"),
    };

    let processed = systemPrompt;
    for (const [key, value] of Object.entries(variables)) {
        processed = processed.replace(new RegExp(`\\{${key}\\}`, "gi"), value);
    }
    return processed;
}

/** Convert LM Studio chat history to OpenAI message format. */
function toOpenAIMessages(
    history: Chat,
    systemPrompt?: string,
): ChatCompletionMessageParam[] {
    const messages: ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
    }

    for (const message of history) {
        switch (message.getRole()) {
            case "system":
                // Custom system prompt wins; only fall back to history's own system text.
                if (!systemPrompt) {
                    messages.push({ role: "system", content: message.getText() });
                }
                break;

            case "user":
                messages.push({ role: "user", content: message.getText() });
                break;

            case "assistant": {
                const toolCalls: ChatCompletionMessageToolCall[] = message
                    .getToolCallRequests()
                    .map(toolCall => ({
                        id: toolCall.id ?? "",
                        type: "function",
                        function: {
                            name: toolCall.name,
                            arguments: JSON.stringify(toolCall.arguments ?? {}),
                        },
                    }));

                messages.push({
                    role: "assistant",
                    content: message.getText(),
                    ...(toolCalls.length ? { tool_calls: toolCalls } : {}),
                });
                break;
            }

            case "tool": {
                message.getToolCallResults().forEach(toolCallResult => {
                    messages.push({
                        role: "tool",
                        tool_call_id: toolCallResult.toolCallId ?? "",
                        content: toolCallResult.content,
                    } as ChatCompletionToolMessageParam);
                });
                break;
            }
        }
    }

    return messages;
}

/** Convert LM Studio tool definitions to OpenAI function-tool descriptors. */
function toOpenAITools(ctl: GeneratorController): ChatCompletionTool[] | undefined {
    const tools = ctl.getToolDefinitions().map<ChatCompletionTool>(t => ({
        type: "function",
        function: {
            name: t.function.name,
            description: t.function.description,
            parameters: t.function.parameters ?? {},
        },
    }));
    return tools.length ? tools : undefined;
}

/**
 * Build the exact request body for the llama.cpp server.
 *
 * Contract notes (verified against tools/server/server-common.cpp of our build):
 *  - OpenAI-standard params (temperature, top_p, presence/frequency_penalty,
 *    max_tokens, seed, stop, stream, tools, response_format) are handled natively.
 *  - llama.cpp pass-through params (top_k, min_p, repeat_penalty, cache_prompt,
 *    grammar, …) are copied verbatim into llama_params.
 *  - chat_template_kwargs.enable_thinking / .preserve_thinking MUST be JSON
 *    booleans — the server dump()s each kwarg and the template compares against
 *    "true"/"false"; sending the STRING "false" would read as truthy.
 *  - reasoning_effort is the OpenAI-style request key; the server special-cases
 *    it and forwards it to the template. Only xhigh/medium/low are valid for
 *    the bonsai template (its default is xhigh).
 *  - reasoning_budget_tokens (server alias: thinking_budget_tokens) enforces a
 *    hard thinking-token budget at the sampling layer; requires the template to
 *    expose thinking tags (the qwen35/bonsai template does).
 *  - extraParams is merged last so it can add anything else (mirostat & co)
 *    and override individual fields deliberately.
 */
export function buildRequestBody(
    config: ParsedModelConfig,
    messages: ChatCompletionMessageParam[],
    tools?: ChatCompletionTool[],
): LlamaChatBody {
    const body: LlamaChatBody = {
        model: config.get("model"),
        messages,
        tools,
        stream: true,
    };

    if (!tools || tools.length === 0) {
        delete body.tools; // llama.cpp is fine with tools: [], but cleaner without.
    }

    const samplerPicks: Array<[string, any, (v: any) => boolean]> = [
        ["temperature", config.get("temperature"), (v: any): boolean => v >= 0],
        ["top_p", config.get("top_p"), (v: any): boolean => v >= 0],
        ["top_k", config.get("top_k"), (v: any): boolean => v >= 0],
        ["min_p", config.get("min_p"), (v: any): boolean => v >= 0],
        ["repeat_penalty", config.get("repeat_penalty"), (v: any): boolean => v >= 0],
        ["presence_penalty", config.get("presence_penalty"), (): boolean => true],
        ["frequency_penalty", config.get("frequency_penalty"), (): boolean => true],
        ["max_tokens", config.get("max_tokens"), (v: any): boolean => v > 0],
        ["seed", config.get("seed"), (v: any): boolean => v >= 0],
    ];
    for (const [key, value, include] of samplerPicks) {
        if (include(value)) {
            body[key] = value;
        }
    }

    // Stop sequences: one per line in the UI, OpenAI array on the wire.
    const stop = String(config.get("stop") ?? "")
        .split("\n")
        .map(s => s.trim())
        .filter(s => s.length > 0);
    if (stop.length > 0) {
        body.stop = stop;
    }

    if (config.get("cache_prompt")) {
        body.cache_prompt = true;
    }

    const grammar = String(config.get("grammar") ?? "").trim();
    if (grammar.length > 0) {
        if (tools && tools.length > 0) {
            // llama.cpp server rejects the combination (HTTP 400).
            throw new Error(
                'llama-compat-endpoint: "Grammar (GBNF)" cannot be combined with tools ' +
                "(llama.cpp: custom grammar constraints exclude tool calls). Clear the grammar field.",
            );
        }
        body.grammar = grammar;
    }

    // --- Reasoning / thinking -------------------------------------------------
    // chat_template_kwargs is always present so the template kwargs are explicit.
    const chatTemplateKwargs: Record<string, any> = {
        enable_thinking: config.get("enableThinking") === true,
        preserve_thinking: config.get("preserveThinking") === true,
    };
    body.chat_template_kwargs = chatTemplateKwargs;

    const reasoningEffort = String(config.get("reasoningEffort") ?? "");
    if (["xhigh", "medium", "low"].includes(reasoningEffort)) {
        body.reasoning_effort = reasoningEffort;
    }

    const thinkingBudget = Math.trunc(Number(config.get("thinkingBudget") ?? 0));
    if (Number.isFinite(thinkingBudget) && thinkingBudget > 0) {
        body.reasoning_budget_tokens = thinkingBudget;
    }

    body.reasoning_format = String(config.get("reasoningFormat") ?? "deepseek");

    // --- Catch-all ------------------------------------------------------------
    const extraRaw = String(config.get("extraParams") ?? "{}").trim() || "{}";
    let extra: Record<string, any>;
    try {
        extra = JSON.parse(extraRaw);
    } catch {
        throw new Error(
            `llama-compat-endpoint: "Extra Params (JSON)" is not valid JSON: ${extraRaw}`,
        );
    }
    if (typeof extra !== "object" || extra === null || Array.isArray(extra)) {
        throw new Error('llama-compat-endpoint: "Extra Params (JSON)" must be a JSON object.');
    }
    Object.assign(body, extra);

    return body;
}

/* -------------------------------------------------------------------------- */
/*                        Reasoning-aware stream router                       */
/* -------------------------------------------------------------------------- */

/**
 * Routes a llama.cpp reasoning stream into LM Studio's GeneratorController.
 *
 * The server (reasoning_format deepseek) separates <think>…</think> content into
 * delta.reasoning_content. LM Studio understands typed fragments natively, so in
 * "native" mode we emit reasoningStartTag / reasoning / reasoningEndTag-marked
 * fragments — that makes the UI show a proper collapsible thinking block.
 *
 * Exported for the unit tests.
 */
export class ReasoningStreamRouter {
    private inReasoning = false;

    constructor(
        private ctl: GeneratorController,
        private mode: ReasoningDisplay,
    ) {}

    /** Close an open thinking block (marker fragment or closing tag). */
    private closeReasoning() {
        if (!this.inReasoning) {
            return;
        }
        this.inReasoning = false;
        if (this.mode === "native") {
            this.ctl.fragmentGenerated("", { reasoningType: "reasoningEndTag", tokenCount: 0 });
        } else if (this.mode === "inline-tags") {
            this.ctl.fragmentGenerated("\n</think>\n");
        }
    }

    /** Feed one delta object (chunk.choices[0].delta). */
    onDelta(delta: any) {
        if (!delta) {
            return;
        }

        const reasoning: string | undefined = (delta as any).reasoning_content;
        if (typeof reasoning === "string" && reasoning.length > 0) {
            if (!this.inReasoning) {
                this.inReasoning = true;
                if (this.mode === "native") {
                    this.ctl.fragmentGenerated("", { reasoningType: "reasoningStartTag", tokenCount: 0 });
                } else if (this.mode === "inline-tags") {
                    this.ctl.fragmentGenerated("<think>\n");
                }
            }
            if (this.mode !== "hidden") {
                this.ctl.fragmentGenerated(reasoning, { reasoningType: "reasoning" });
            }
            return; // a delta is either reasoning or content in llama.cpp streams
        }

        const content: string | undefined = delta.content;
        if (typeof content === "string" && content.length > 0) {
            this.closeReasoning();
            // Normal answer text is always shown; only reasoning can be hidden.
            this.ctl.fragmentGenerated(content);
        }

        for (const toolCall of delta.tool_calls ?? []) {
            this.closeReasoning(); // tool call fragments are not reasoning
            this.onToolCallFragment(toolCall);
        }
    }

    /** Feed a tool_calls fragment (id / name / argument chunks). */
    private onToolCallFragment(toolCall: any) {
        if (!toolCall) {
            return;
        }
        if (toolCall.id !== undefined && toolCall.id !== null) {
            if (this.current !== null && this.current.name !== null) {
                this.flushToolCall();
            }
            this.current = {
                id: toolCall.id,
                name: null,
                index: toolCall.index ?? this.toolCallIndex++,
                arguments: "",
            };
            this.ctl.toolCallGenerationStarted();
        }

        if (typeof toolCall.function?.name === "string" && this.current !== null) {
            this.current.name = toolCall.function.name;
            this.ctl.toolCallGenerationNameReceived(toolCall.function.name);
        }

        if (typeof toolCall.function?.arguments === "string" && this.current !== null) {
            this.current.arguments += toolCall.function.arguments;
            this.ctl.toolCallGenerationArgumentFragmentGenerated(toolCall.function.arguments);
        }
    }

    public current: ToolCallState | null = null;
    private toolCallIndex = 0;

    /** Emit a finalized tool call request into LM Studio. */
    public flushToolCall() {
        const state = this.current;
        if (state === null || state.name === null) {
            return;
        }
        let args: unknown;
        try {
            args = JSON.parse(state.arguments || "{}");
        } catch {
            args = {};
        }
        this.ctl.toolCallGenerationEnded({
            type: "function",
            name: state.name,
            arguments: args,
            id: state.id,
        });
        this.current = null;
    }

    /** Call when the SSE stream ended (closes a still-open thinking block). */
    public onStreamEnd() {
        this.closeReasoning();
        this.flushToolCall();
    }
}

/* -------------------------------------------------------------------------- */
/*                                  API                                       */
/* -------------------------------------------------------------------------- */

/** Stream consumer wiring the router to the SSE stream. */
async function consumeStream(stream: AsyncIterable<any>, router: ReasoningStreamRouter) {
    for await (const chunk of stream) {
        const choice = chunk?.choices?.[0];
        if (!choice) {
            continue; // usage-only final chunk etc.
        }
        router.onDelta(choice.delta);
        if (choice.finish_reason === "tool_calls" || choice.finish_reason === "stop") {
            router.flushToolCall();
        }
    }
    router.onStreamEnd();
}

/** User-facing error translation for the LM Studio chat window. */
function throwReadable(err: unknown): never {
    const e = err as { status?: number; message?: string; cause?: unknown };
    let hint = "";
    if (e?.cause && (e.cause as NodeJS.ErrnoException).code === "ECONNREFUSED") {
        hint =
            " — connection refused: is the llama-server running? " +
            "(e.g. llama-server -m <model.gguf> -ngl 99 -c 131072 --port 9931)";
    } else if (e?.status === 400 && /reasoning effort/i.test(e?.message ?? "")) {
        hint = " — the Reasoning Effort select only supports xhigh / medium / low.";
    } else if (e?.status === 401) {
        hint = " — the server requires --api-key: set it under Global Config → API Key.";
    }
    throw new Error(`llama-compat-endpoint: ${e?.message ?? String(err)}${hint}`);
}

export async function generate(ctl: GeneratorController, history: Chat) {
    const config = ctl.getPluginConfig(configSchematics);
    const globalConfig = ctl.getGlobalPluginConfig(globalConfigSchematics);

    const model = config.get("model");

    /* 1. System prompt (with {variable} substitution). */
    let processedSystemPrompt: string | undefined;
    const systemPromptTemplate = config.get("systemPrompt");
    if (systemPromptTemplate) {
        processedSystemPrompt = processSystemPrompt(systemPromptTemplate, model);
        const unresolved = processedSystemPrompt
            .match(/\{[^}]+\}/g)
            ?.map(v => v.slice(1, -1))
            .filter(v => !(SYSTEM_PROMPT_VARIABLES as readonly string[]).includes(v.toLowerCase()));
        if (unresolved && unresolved.length > 0) {
            console.warn(`[llama-compat] Unknown system prompt variables: ${unresolved.join(", ")}`);
        }
    }

    /* 2. Client, messages, tools. */
    const openai = createClient(globalConfig);
    const messages = toOpenAIMessages(history, processedSystemPrompt);
    const tools = toOpenAITools(ctl);
    const body = buildRequestBody(config, messages, tools);

    console.info(
        `[llama-compat] POST ${globalConfig.get("baseUrl")}/chat/completions` +
        ` model=${body.model} msgs=${messages.length} tools=${tools?.length ?? 0}` +
        ` thinking=${body.chat_template_kwargs.enable_thinking}` +
        ` effort=${body.reasoning_effort ?? "(template default)"} budget=${body.reasoning_budget_tokens ?? 0}`,
    );

    /* 3. Stream (typed fragments make the UI render a real thinking block). */
    const display = String(config.get("reasoningDisplay") ?? "native") as ReasoningDisplay;
    const router = new ReasoningStreamRouter(ctl, display);

    let stream: AsyncIterable<any>;
    try {
        stream = await openai.chat.completions.create(body as any);
    } catch (err) {
        throwReadable(err);
    }

    ctl.onAborted(() => {
        console.info("[llama-compat] Generation aborted by user.");
        (stream as unknown as { controller: AbortController }).controller.abort();
    });

    try {
        await consumeStream(stream, router);
    } catch (err) {
        if (aborted(stream)) {
            console.info("[llama-compat] Stream ended by abort.");
            return;
        }
        throwReadable(err);
    }
    console.info("[llama-compat] Generation completed.");
}

function aborted(stream: unknown): boolean {
    const controller = (stream as unknown as { controller?: AbortController })?.controller;
    return controller?.signal?.aborted === true;
}
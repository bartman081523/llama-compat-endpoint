"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/config.ts
var import_sdk, configSchematics, globalConfigSchematics, SYSTEM_PROMPT_VARIABLES;
var init_config = __esm({
  "src/config.ts"() {
    "use strict";
    import_sdk = require("@lmstudio/sdk");
    configSchematics = (0, import_sdk.createConfigSchematics)().field(
      "model",
      "string",
      {
        displayName: "Model Name",
        subtitle: "Label sent as `model`. The llama.cpp server ignores it, but it keeps the request valid.",
        placeholder: "ternary-bonsai-27b-gf3"
      },
      "ternary-bonsai-27b-gf3"
    ).field(
      "systemPrompt",
      "string",
      {
        displayName: "System Prompt",
        subtitle: "Custom system prompt. Supports variables: {date}, {time}, {datetime}, {model}, {timestamp}, {year}, {month}, {day}.",
        placeholder: "You are a helpful assistant. Current date: {date}",
        isParagraph: true
      },
      ""
    ).field(
      "temperature",
      "numeric",
      {
        displayName: "Temperature",
        subtitle: "-1 = omit (server/GGUF default). Otherwise maps to `temperature` directly.",
        min: -1,
        max: 2,
        step: 0.05,
        slider: { min: -1, max: 2, step: 0.05 }
      },
      -1
    ).field(
      "top_p",
      "numeric",
      {
        displayName: "Top P",
        subtitle: "-1 = omit (server/GGUF default). Otherwise maps to `top_p`.",
        min: -1,
        max: 1,
        step: 0.01
      },
      -1
    ).field(
      "top_k",
      "numeric",
      {
        displayName: "Top K",
        subtitle: "-1 = omit. 0 = disabled. Otherwise maps to `top_k`.",
        min: -1,
        max: 200,
        int: true,
        step: 1
      },
      -1
    ).field(
      "min_p",
      "numeric",
      {
        displayName: "Min P",
        subtitle: "-1 = omit (server/GGUF default). Otherwise maps to `min_p`.",
        min: -1,
        max: 1,
        step: 1e-3
      },
      -1
    ).field(
      "repeat_penalty",
      "numeric",
      {
        displayName: "Repeat Penalty",
        subtitle: "llama.cpp-native `repeat_penalty`. -1 = omit.",
        min: -1,
        max: 3,
        step: 0.01
      },
      -1
    ).field(
      "presence_penalty",
      "numeric",
      {
        displayName: "Presence Penalty",
        subtitle: "OpenAI-style; 0 = no effect. Always sent.",
        min: -2,
        max: 2,
        step: 0.05
      },
      0
    ).field(
      "frequency_penalty",
      "numeric",
      {
        displayName: "Frequency Penalty",
        subtitle: "OpenAI-style; 0 = no effect. Always sent.",
        min: -2,
        max: 2,
        step: 0.05
      },
      0
    ).field(
      "max_tokens",
      "numeric",
      {
        displayName: "Max Tokens (n_predict)",
        subtitle: "-1 = omit \u2192 server generates until EOS. Otherwise maps to `max_tokens`/`n_predict`.",
        min: -1,
        max: 131072,
        int: true,
        step: 1
      },
      -1
    ).field(
      "seed",
      "numeric",
      {
        displayName: "Seed",
        subtitle: "-1 = omit (server picks a random seed). Otherwise maps to `seed`.",
        min: -1,
        max: 2147483647,
        int: true,
        step: 1
      },
      -1
    ).field(
      "stop",
      "string",
      {
        displayName: "Stop Sequences",
        subtitle: 'One sequence per line \u2192 `stop` array. WARNING: short single-character sequences ("a") abort generation almost immediately \u2014 use realistic multi-char stops.',
        placeholder: "<|im_end|>\n### ENDE",
        isParagraph: true
      },
      ""
    ).field(
      "cache_prompt",
      "boolean",
      {
        displayName: "Prompt Cache Reuse",
        subtitle: "llama.cpp-native `cache_prompt`: keep the slot KV cache between turns (recommended)."
      },
      true
    ).field(
      "grammar",
      "string",
      {
        displayName: "Grammar (GBNF)",
        subtitle: "Optional GBNF grammar constraining the output. Empty = unconstrained.",
        placeholder: 'root ::= "yes" | "no"',
        isParagraph: true
      },
      ""
    ).field(
      "enableThinking",
      "boolean",
      {
        displayName: "Enable Thinking",
        subtitle: "chat_template_kwargs.enable_thinking (JSON boolean). true = model opens <think>; false = empty think block, straight answer."
      },
      true
    ).field(
      "reasoningEffort",
      "select",
      {
        displayName: "Reasoning Effort",
        subtitle: '"default" = omit \u2192 template default (xhigh). WARNING: the bonsai template accepts ONLY xhigh, medium, low \u2014 any other value aborts the request.',
        options: [
          { value: "default", displayName: "Template default (xhigh)" },
          { value: "xhigh", displayName: "xhigh (explicit)" },
          { value: "medium", displayName: "medium" },
          { value: "low", displayName: "low" }
        ]
      },
      "default"
    ).field(
      "thinkingBudget",
      "numeric",
      {
        displayName: "Thinking Budget (Tokens)",
        subtitle: "0 = off. >0 \u2192 `reasoning_budget_tokens`: server rewrites the prompt with a token count and hard-stops thinking past the budget.",
        min: 0,
        max: 65536,
        int: true,
        step: 1
      },
      0
    ).field(
      "preserveThinking",
      "boolean",
      {
        displayName: "Preserve Thinking in Context",
        subtitle: "chat_template_kwargs.preserve_thinking (JSON boolean): re-send past assistant <think> blocks on later turns. Turn off to save context."
      },
      true
    ).field(
      "reasoningDisplay",
      "select",
      {
        displayName: "Reasoning Display",
        subtitle: "How reasoning reaches the LM Studio UI. Only used when thinking tokens are streamed.",
        options: [
          { value: "native", displayName: "Native (typed fragments)" },
          { value: "inline-tags", displayName: "Inline (tags)" },
          { value: "hidden", displayName: "Hidden (drop)" }
        ],
        dependencies: [{ key: "enableThinking", condition: { type: "equals", value: true } }]
      },
      "native"
    ).field(
      "reasoningFormat",
      "select",
      {
        displayName: "Server Reasoning Format",
        subtitle: "Request-level `reasoning_format`: deepseek/auto separate thinking into `reasoning_content` deltas; none keeps raw tags in content.",
        options: [
          { value: "deepseek", displayName: "deepseek (recommended)" },
          { value: "auto", displayName: "auto" },
          { value: "deepseek-legacy", displayName: "deepseek-legacy" },
          { value: "none", displayName: "none" }
        ]
      },
      "deepseek"
    ).field(
      "extraParams",
      "string",
      {
        displayName: "Extra Params (JSON)",
        subtitle: "Catch-all merged onto the request last: mirostat / mirostat_tau / mirostat_eta, dynatemp_range, dynatemp_exponent, top_n_sigma, n_predict, penalize_nl, \u2026",
        placeholder: '{"mirostat": 2, "mirostat_tau": 5.0, "mirostat_eta": 0.1}',
        isParagraph: true
      },
      "{}"
    ).build();
    globalConfigSchematics = (0, import_sdk.createConfigSchematics)().field(
      "baseUrl",
      "string",
      {
        displayName: "llama.cpp Base URL",
        subtitle: "OpenAI-compatible endpoint of the llama.cpp server (incl. /v1).",
        placeholder: "http://127.0.0.1:9931/v1"
      },
      "http://127.0.0.1:9931/v1"
    ).field(
      "apiKey",
      "string",
      {
        displayName: "API Key",
        subtitle: 'Only needed when the server runs with --api-key. The openai client requires a non-empty key; "no-key" is used when empty.',
        isProtected: true,
        placeholder: "(server default: no auth)"
      },
      ""
    ).field(
      "timeoutMs",
      "numeric",
      {
        displayName: "Request Timeout (ms)",
        subtitle: "Long generations / big prefills need more than the library default (10 min).",
        min: 1e3,
        max: 72e5,
        int: true,
        step: 1e3
      },
      36e5
    ).field(
      "maxRetries",
      "numeric",
      {
        displayName: "Max Retries",
        subtitle: "Automatic retries of the openai client on connection errors / 5xx.",
        min: 0,
        max: 10,
        int: true,
        step: 1
      },
      2
    ).field(
      "caCertPath",
      "string",
      {
        displayName: "(Optional) CA Certificate Path",
        subtitle: "Absolute path to a PEM file to trust for HTTPS base URLs (self-signed local servers). Empty = system trust store.",
        placeholder: "/home/user/.lmstudio/certs-extra-ca.pem"
      },
      ""
    ).build();
    SYSTEM_PROMPT_VARIABLES = [
      "date",
      "time",
      "datetime",
      "model",
      "timestamp",
      "year",
      "month",
      "day"
    ];
  }
});

// src/generator.ts
function createClient(globalConfig) {
  const baseURL = globalConfig.get("baseUrl");
  const apiKey = globalConfig.get("apiKey");
  const timeoutMs = globalConfig.get("timeoutMs");
  const maxRetries = globalConfig.get("maxRetries");
  const caCertPath = globalConfig.get("caCertPath");
  let httpsAgent;
  if (baseURL.startsWith("https://") && caCertPath) {
    try {
      const ca = fs.readFileSync(caCertPath, "utf8");
      httpsAgent = new https.Agent({ ca, keepAlive: true });
      console.info(`[llama-compat] Using custom CA certificate: ${caCertPath}`);
    } catch (err) {
      console.warn(`[llama-compat] Failed to read CA cert at ${caCertPath}:`, err.message);
    }
  }
  return new import_openai.default({
    apiKey: apiKey || "no-key",
    // llama.cpp ignores the key unless --api-key is set.
    baseURL,
    timeout: timeoutMs,
    maxRetries,
    ...httpsAgent ? { httpsAgent } : {},
    defaultHeaders: { "Content-Type": "application/json" }
  });
}
function processSystemPrompt(systemPrompt, model) {
  if (!systemPrompt) {
    return "";
  }
  const now = /* @__PURE__ */ new Date();
  const variables = {
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    datetime: now.toLocaleString(),
    model,
    timestamp: now.toISOString(),
    year: now.getFullYear().toString(),
    month: (now.getMonth() + 1).toString().padStart(2, "0"),
    day: now.getDate().toString().padStart(2, "0")
  };
  let processed = systemPrompt;
  for (const [key, value] of Object.entries(variables)) {
    processed = processed.replace(new RegExp(`\\{${key}\\}`, "gi"), value);
  }
  return processed;
}
function toOpenAIMessages(history, systemPrompt) {
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  for (const message of history) {
    switch (message.getRole()) {
      case "system":
        if (!systemPrompt) {
          messages.push({ role: "system", content: message.getText() });
        }
        break;
      case "user":
        messages.push({ role: "user", content: message.getText() });
        break;
      case "assistant": {
        const toolCalls = message.getToolCallRequests().map((toolCall) => ({
          id: toolCall.id ?? "",
          type: "function",
          function: {
            name: toolCall.name,
            arguments: JSON.stringify(toolCall.arguments ?? {})
          }
        }));
        messages.push({
          role: "assistant",
          content: message.getText(),
          ...toolCalls.length ? { tool_calls: toolCalls } : {}
        });
        break;
      }
      case "tool": {
        message.getToolCallResults().forEach((toolCallResult) => {
          messages.push({
            role: "tool",
            tool_call_id: toolCallResult.toolCallId ?? "",
            content: toolCallResult.content
          });
        });
        break;
      }
    }
  }
  return messages;
}
function toOpenAITools(ctl) {
  const tools = ctl.getToolDefinitions().map((t) => ({
    type: "function",
    function: {
      name: t.function.name,
      description: t.function.description,
      parameters: t.function.parameters ?? {}
    }
  }));
  return tools.length ? tools : void 0;
}
function buildRequestBody(config, messages, tools) {
  const body = {
    model: config.get("model"),
    messages,
    tools,
    stream: true
  };
  if (!tools || tools.length === 0) {
    delete body.tools;
  }
  const samplerPicks = [
    ["temperature", config.get("temperature"), (v) => v >= 0],
    ["top_p", config.get("top_p"), (v) => v >= 0],
    ["top_k", config.get("top_k"), (v) => v >= 0],
    ["min_p", config.get("min_p"), (v) => v >= 0],
    ["repeat_penalty", config.get("repeat_penalty"), (v) => v >= 0],
    ["presence_penalty", config.get("presence_penalty"), () => true],
    ["frequency_penalty", config.get("frequency_penalty"), () => true],
    ["max_tokens", config.get("max_tokens"), (v) => v > 0],
    ["seed", config.get("seed"), (v) => v >= 0]
  ];
  for (const [key, value, include] of samplerPicks) {
    if (include(value)) {
      body[key] = value;
    }
  }
  const stop = String(config.get("stop") ?? "").split("\n").map((s) => s.trim()).filter((s) => s.length > 0);
  if (stop.length > 0) {
    body.stop = stop;
  }
  if (config.get("cache_prompt")) {
    body.cache_prompt = true;
  }
  const grammar = String(config.get("grammar") ?? "").trim();
  if (grammar.length > 0) {
    if (tools && tools.length > 0) {
      throw new Error(
        'llama-compat-endpoint: "Grammar (GBNF)" cannot be combined with tools (llama.cpp: custom grammar constraints exclude tool calls). Clear the grammar field.'
      );
    }
    body.grammar = grammar;
  }
  const chatTemplateKwargs = {
    enable_thinking: config.get("enableThinking") === true,
    preserve_thinking: config.get("preserveThinking") === true
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
  const extraRaw = String(config.get("extraParams") ?? "{}").trim() || "{}";
  let extra;
  try {
    extra = JSON.parse(extraRaw);
  } catch {
    throw new Error(
      `llama-compat-endpoint: "Extra Params (JSON)" is not valid JSON: ${extraRaw}`
    );
  }
  if (typeof extra !== "object" || extra === null || Array.isArray(extra)) {
    throw new Error('llama-compat-endpoint: "Extra Params (JSON)" must be a JSON object.');
  }
  Object.assign(body, extra);
  return body;
}
async function consumeStream(stream, router) {
  for await (const chunk of stream) {
    const choice = chunk?.choices?.[0];
    if (!choice) {
      continue;
    }
    router.onDelta(choice.delta);
    if (choice.finish_reason === "tool_calls" || choice.finish_reason === "stop") {
      router.flushToolCall();
    }
  }
  router.onStreamEnd();
}
function throwReadable(err) {
  const e = err;
  let hint = "";
  if (e?.cause && e.cause.code === "ECONNREFUSED") {
    hint = " \u2014 connection refused: is the llama-server running? (e.g. llama-server -m <model.gguf> -ngl 99 -c 131072 --port 9931)";
  } else if (e?.status === 400 && /reasoning effort/i.test(e?.message ?? "")) {
    hint = " \u2014 the Reasoning Effort select only supports xhigh / medium / low.";
  } else if (e?.status === 401) {
    hint = " \u2014 the server requires --api-key: set it under Global Config \u2192 API Key.";
  }
  throw new Error(`llama-compat-endpoint: ${e?.message ?? String(err)}${hint}`);
}
async function generate(ctl, history) {
  const config = ctl.getPluginConfig(configSchematics);
  const globalConfig = ctl.getGlobalPluginConfig(globalConfigSchematics);
  const model = config.get("model");
  let processedSystemPrompt;
  const systemPromptTemplate = config.get("systemPrompt");
  if (systemPromptTemplate) {
    processedSystemPrompt = processSystemPrompt(systemPromptTemplate, model);
    const unresolved = processedSystemPrompt.match(/\{[^}]+\}/g)?.map((v) => v.slice(1, -1)).filter((v) => !SYSTEM_PROMPT_VARIABLES.includes(v.toLowerCase()));
    if (unresolved && unresolved.length > 0) {
      console.warn(`[llama-compat] Unknown system prompt variables: ${unresolved.join(", ")}`);
    }
  }
  const openai = createClient(globalConfig);
  const messages = toOpenAIMessages(history, processedSystemPrompt);
  const tools = toOpenAITools(ctl);
  const body = buildRequestBody(config, messages, tools);
  console.info(
    `[llama-compat] POST ${globalConfig.get("baseUrl")}/chat/completions model=${body.model} msgs=${messages.length} tools=${tools?.length ?? 0} thinking=${body.chat_template_kwargs.enable_thinking} effort=${body.reasoning_effort ?? "(template default)"} budget=${body.reasoning_budget_tokens ?? 0}`
  );
  const display = String(config.get("reasoningDisplay") ?? "native");
  const router = new ReasoningStreamRouter(ctl, display);
  let stream;
  try {
    stream = await openai.chat.completions.create(body);
  } catch (err) {
    throwReadable(err);
  }
  ctl.onAborted(() => {
    console.info("[llama-compat] Generation aborted by user.");
    stream.controller.abort();
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
function aborted(stream) {
  const controller = stream?.controller;
  return controller?.signal?.aborted === true;
}
var import_openai, fs, https, ReasoningStreamRouter;
var init_generator = __esm({
  "src/generator.ts"() {
    "use strict";
    import_openai = __toESM(require("openai"));
    init_config();
    fs = __toESM(require("node:fs"));
    https = __toESM(require("node:https"));
    ReasoningStreamRouter = class {
      constructor(ctl, mode) {
        this.ctl = ctl;
        this.mode = mode;
        this.inReasoning = false;
        this.current = null;
        this.toolCallIndex = 0;
      }
      /** Close an open thinking block (marker fragment or closing tag). */
      closeReasoning() {
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
      onDelta(delta) {
        if (!delta) {
          return;
        }
        const reasoning = delta.reasoning_content;
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
          return;
        }
        const content = delta.content;
        if (typeof content === "string" && content.length > 0) {
          this.closeReasoning();
          this.ctl.fragmentGenerated(content);
        }
        for (const toolCall of delta.tool_calls ?? []) {
          this.closeReasoning();
          this.onToolCallFragment(toolCall);
        }
      }
      /** Feed a tool_calls fragment (id / name / argument chunks). */
      onToolCallFragment(toolCall) {
        if (!toolCall) {
          return;
        }
        if (toolCall.id !== void 0 && toolCall.id !== null) {
          if (this.current !== null && this.current.name !== null) {
            this.flushToolCall();
          }
          this.current = {
            id: toolCall.id,
            name: null,
            index: toolCall.index ?? this.toolCallIndex++,
            arguments: ""
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
      /** Emit a finalized tool call request into LM Studio. */
      flushToolCall() {
        const state = this.current;
        if (state === null || state.name === null) {
          return;
        }
        let args;
        try {
          args = JSON.parse(state.arguments || "{}");
        } catch {
          args = {};
        }
        this.ctl.toolCallGenerationEnded({
          type: "function",
          name: state.name,
          arguments: args,
          id: state.id
        });
        this.current = null;
      }
      /** Call when the SSE stream ended (closes a still-open thinking block). */
      onStreamEnd() {
        this.closeReasoning();
        this.flushToolCall();
      }
    };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  main: () => main
});
async function main(context) {
  context.withConfigSchematics(configSchematics);
  context.withGlobalConfigSchematics(globalConfigSchematics);
  context.withGenerator(generate);
}
var init_src = __esm({
  "src/index.ts"() {
    "use strict";
    init_config();
    init_generator();
  }
});

// .lmstudio/entry.ts
var import_sdk2 = require("@lmstudio/sdk");
var clientIdentifier = process.env.LMS_PLUGIN_CLIENT_IDENTIFIER;
var clientPasskey = process.env.LMS_PLUGIN_CLIENT_PASSKEY;
var baseUrl = process.env.LMS_PLUGIN_BASE_URL;
var client = new import_sdk2.LMStudioClient({
  clientIdentifier,
  clientPasskey,
  baseUrl
});
globalThis.__LMS_PLUGIN_CONTEXT = true;
var predictionLoopHandlerSet = false;
var promptPreprocessorSet = false;
var configSchematicsSet = false;
var globalConfigSchematicsSet = false;
var toolsProviderSet = false;
var generatorSet = false;
var selfRegistrationHost = client.plugins.getSelfRegistrationHost();
var pluginContext = {
  withPredictionLoopHandler: (generate2) => {
    if (predictionLoopHandlerSet) {
      throw new Error("PredictionLoopHandler already registered");
    }
    if (toolsProviderSet) {
      throw new Error("PredictionLoopHandler cannot be used with a tools provider");
    }
    predictionLoopHandlerSet = true;
    selfRegistrationHost.setPredictionLoopHandler(generate2);
    return pluginContext;
  },
  withPromptPreprocessor: (preprocess) => {
    if (promptPreprocessorSet) {
      throw new Error("PromptPreprocessor already registered");
    }
    promptPreprocessorSet = true;
    selfRegistrationHost.setPromptPreprocessor(preprocess);
    return pluginContext;
  },
  withConfigSchematics: (configSchematics2) => {
    if (configSchematicsSet) {
      throw new Error("Config schematics already registered");
    }
    configSchematicsSet = true;
    selfRegistrationHost.setConfigSchematics(configSchematics2);
    return pluginContext;
  },
  withGlobalConfigSchematics: (globalConfigSchematics2) => {
    if (globalConfigSchematicsSet) {
      throw new Error("Global config schematics already registered");
    }
    globalConfigSchematicsSet = true;
    selfRegistrationHost.setGlobalConfigSchematics(globalConfigSchematics2);
    return pluginContext;
  },
  withToolsProvider: (toolsProvider) => {
    if (toolsProviderSet) {
      throw new Error("Tools provider already registered");
    }
    if (predictionLoopHandlerSet) {
      throw new Error("Tools provider cannot be used with a predictionLoopHandler");
    }
    toolsProviderSet = true;
    selfRegistrationHost.setToolsProvider(toolsProvider);
    return pluginContext;
  },
  withGenerator: (generator) => {
    if (generatorSet) {
      throw new Error("Generator already registered");
    }
    generatorSet = true;
    selfRegistrationHost.setGenerator(generator);
    return pluginContext;
  }
};
Promise.resolve().then(() => (init_src(), src_exports)).then(async (module2) => {
  return await module2.main(pluginContext);
}).then(() => {
  selfRegistrationHost.initCompleted();
}).catch((error) => {
  console.error("Failed to execute the main function of the plugin.");
  console.error(error);
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2NvbmZpZy50cyIsICIuLi9zcmMvZ2VuZXJhdG9yLnRzIiwgIi4uL3NyYy9pbmRleC50cyIsICJlbnRyeS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgY3JlYXRlQ29uZmlnU2NoZW1hdGljcyB9IGZyb20gXCJAbG1zdHVkaW8vc2RrXCI7XG5cbi8qKlxuICogQ29uZmlnIHNjaGVtYXRpY3MgZm9yIHRoZSBsbGFtYS1jb21wYXQtZW5kcG9pbnQgcGx1Z2luLlxuICpcbiAqIEV2ZXJ5IG1vZGVsLWxldmVsIGZpZWxkIG1hcHMgMToxIG9udG8gYSBsbGFtYS5jcHAgc2VydmVyIHJlcXVlc3QgcGFyYW1ldGVyXG4gKiAoT3BlbkFJLWNvbXBhdCBlbmRwb2ludCBwbHVzIHRoZSBsbGFtYS5jcHAgcGFzcy10aHJvdWdoIHByb3BlcnRpZXMgdGhhdCB0aGVcbiAqIHNlcnZlciBjb3BpZXMgdmVyYmF0aW0gaW50byBsbGFtYV9wYXJhbXMpLiBTZW50aW5lbCBzZW1hbnRpY3M6XG4gKiAgLSAtMSBvbiBzYW1wbGVyIGZpZWxkcyAgPSBcIm9taXQgZnJvbSByZXF1ZXN0XCIgXHUyMTkyIGxsYW1hLmNwcCAvIEdHVUYgZGVmYXVsdHMuXG4gKiAgLSAwIG9uIHRoaW5raW5nQnVkZ2V0ICAgPSBcIm9mZlwiIFx1MjE5MiBubyByZWFzb25pbmdfYnVkZ2V0IGVuZm9yY2VtZW50LlxuICogIC0gXCJcIiBvbiBzdHJpbmcgZmllbGRzICAgPSBcIm9taXRcIi5cbiAqXG4gKiBSYXRpb25hbGUgZm9yIG5vbi1zdGFuZGFyZCBjaG9pY2VzIGxpdmVzIGluIFJFQURNRS5tZC5cbiAqL1xuZXhwb3J0IGNvbnN0IGNvbmZpZ1NjaGVtYXRpY3MgPSBjcmVhdGVDb25maWdTY2hlbWF0aWNzKClcbiAgICAuZmllbGQoXG4gICAgICAgIFwibW9kZWxcIixcbiAgICAgICAgXCJzdHJpbmdcIixcbiAgICAgICAge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwiTW9kZWwgTmFtZVwiLFxuICAgICAgICAgICAgc3VidGl0bGU6XG4gICAgICAgICAgICAgICAgXCJMYWJlbCBzZW50IGFzIGBtb2RlbGAuIFRoZSBsbGFtYS5jcHAgc2VydmVyIGlnbm9yZXMgaXQsIGJ1dCBpdCBrZWVwcyB0aGUgcmVxdWVzdCB2YWxpZC5cIixcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcInRlcm5hcnktYm9uc2FpLTI3Yi1nZjNcIixcbiAgICAgICAgfSxcbiAgICAgICAgXCJ0ZXJuYXJ5LWJvbnNhaS0yN2ItZ2YzXCIsXG4gICAgKVxuICAgIC5maWVsZChcbiAgICAgICAgXCJzeXN0ZW1Qcm9tcHRcIixcbiAgICAgICAgXCJzdHJpbmdcIixcbiAgICAgICAge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwiU3lzdGVtIFByb21wdFwiLFxuICAgICAgICAgICAgc3VidGl0bGU6XG4gICAgICAgICAgICAgICAgXCJDdXN0b20gc3lzdGVtIHByb21wdC4gU3VwcG9ydHMgdmFyaWFibGVzOiB7ZGF0ZX0sIHt0aW1lfSwge2RhdGV0aW1lfSwge21vZGVsfSwge3RpbWVzdGFtcH0sIHt5ZWFyfSwge21vbnRofSwge2RheX0uXCIsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJZb3UgYXJlIGEgaGVscGZ1bCBhc3Npc3RhbnQuIEN1cnJlbnQgZGF0ZToge2RhdGV9XCIsXG4gICAgICAgICAgICBpc1BhcmFncmFwaDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJcIixcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcInRlbXBlcmF0dXJlXCIsXG4gICAgICAgIFwibnVtZXJpY1wiLFxuICAgICAgICB7XG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJUZW1wZXJhdHVyZVwiLFxuICAgICAgICAgICAgc3VidGl0bGU6IFwiLTEgPSBvbWl0IChzZXJ2ZXIvR0dVRiBkZWZhdWx0KS4gT3RoZXJ3aXNlIG1hcHMgdG8gYHRlbXBlcmF0dXJlYCBkaXJlY3RseS5cIixcbiAgICAgICAgICAgIG1pbjogLTEsXG4gICAgICAgICAgICBtYXg6IDIuMCxcbiAgICAgICAgICAgIHN0ZXA6IDAuMDUsXG4gICAgICAgICAgICBzbGlkZXI6IHsgbWluOiAtMSwgbWF4OiAyLjAsIHN0ZXA6IDAuMDUgfSxcbiAgICAgICAgfSxcbiAgICAgICAgLTEsXG4gICAgKVxuICAgIC5maWVsZChcbiAgICAgICAgXCJ0b3BfcFwiLFxuICAgICAgICBcIm51bWVyaWNcIixcbiAgICAgICAge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwiVG9wIFBcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOiBcIi0xID0gb21pdCAoc2VydmVyL0dHVUYgZGVmYXVsdCkuIE90aGVyd2lzZSBtYXBzIHRvIGB0b3BfcGAuXCIsXG4gICAgICAgICAgICBtaW46IC0xLFxuICAgICAgICAgICAgbWF4OiAxLjAsXG4gICAgICAgICAgICBzdGVwOiAwLjAxLFxuICAgICAgICB9LFxuICAgICAgICAtMSxcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcInRvcF9rXCIsXG4gICAgICAgIFwibnVtZXJpY1wiLFxuICAgICAgICB7XG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJUb3AgS1wiLFxuICAgICAgICAgICAgc3VidGl0bGU6IFwiLTEgPSBvbWl0LiAwID0gZGlzYWJsZWQuIE90aGVyd2lzZSBtYXBzIHRvIGB0b3Bfa2AuXCIsXG4gICAgICAgICAgICBtaW46IC0xLFxuICAgICAgICAgICAgbWF4OiAyMDAsXG4gICAgICAgICAgICBpbnQ6IHRydWUsXG4gICAgICAgICAgICBzdGVwOiAxLFxuICAgICAgICB9LFxuICAgICAgICAtMSxcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcIm1pbl9wXCIsXG4gICAgICAgIFwibnVtZXJpY1wiLFxuICAgICAgICB7XG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJNaW4gUFwiLFxuICAgICAgICAgICAgc3VidGl0bGU6IFwiLTEgPSBvbWl0IChzZXJ2ZXIvR0dVRiBkZWZhdWx0KS4gT3RoZXJ3aXNlIG1hcHMgdG8gYG1pbl9wYC5cIixcbiAgICAgICAgICAgIG1pbjogLTEsXG4gICAgICAgICAgICBtYXg6IDEuMCxcbiAgICAgICAgICAgIHN0ZXA6IDAuMDAxLFxuICAgICAgICB9LFxuICAgICAgICAtMSxcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcInJlcGVhdF9wZW5hbHR5XCIsXG4gICAgICAgIFwibnVtZXJpY1wiLFxuICAgICAgICB7XG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJSZXBlYXQgUGVuYWx0eVwiLFxuICAgICAgICAgICAgc3VidGl0bGU6IFwibGxhbWEuY3BwLW5hdGl2ZSBgcmVwZWF0X3BlbmFsdHlgLiAtMSA9IG9taXQuXCIsXG4gICAgICAgICAgICBtaW46IC0xLFxuICAgICAgICAgICAgbWF4OiAzLjAsXG4gICAgICAgICAgICBzdGVwOiAwLjAxLFxuICAgICAgICB9LFxuICAgICAgICAtMSxcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcInByZXNlbmNlX3BlbmFsdHlcIixcbiAgICAgICAgXCJudW1lcmljXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIlByZXNlbmNlIFBlbmFsdHlcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOiBcIk9wZW5BSS1zdHlsZTsgMCA9IG5vIGVmZmVjdC4gQWx3YXlzIHNlbnQuXCIsXG4gICAgICAgICAgICBtaW46IC0yLjAsXG4gICAgICAgICAgICBtYXg6IDIuMCxcbiAgICAgICAgICAgIHN0ZXA6IDAuMDUsXG4gICAgICAgIH0sXG4gICAgICAgIDAsXG4gICAgKVxuICAgIC5maWVsZChcbiAgICAgICAgXCJmcmVxdWVuY3lfcGVuYWx0eVwiLFxuICAgICAgICBcIm51bWVyaWNcIixcbiAgICAgICAge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwiRnJlcXVlbmN5IFBlbmFsdHlcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOiBcIk9wZW5BSS1zdHlsZTsgMCA9IG5vIGVmZmVjdC4gQWx3YXlzIHNlbnQuXCIsXG4gICAgICAgICAgICBtaW46IC0yLjAsXG4gICAgICAgICAgICBtYXg6IDIuMCxcbiAgICAgICAgICAgIHN0ZXA6IDAuMDUsXG4gICAgICAgIH0sXG4gICAgICAgIDAsXG4gICAgKVxuICAgIC5maWVsZChcbiAgICAgICAgXCJtYXhfdG9rZW5zXCIsXG4gICAgICAgIFwibnVtZXJpY1wiLFxuICAgICAgICB7XG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJNYXggVG9rZW5zIChuX3ByZWRpY3QpXCIsXG4gICAgICAgICAgICBzdWJ0aXRsZTogXCItMSA9IG9taXQgXHUyMTkyIHNlcnZlciBnZW5lcmF0ZXMgdW50aWwgRU9TLiBPdGhlcndpc2UgbWFwcyB0byBgbWF4X3Rva2Vuc2AvYG5fcHJlZGljdGAuXCIsXG4gICAgICAgICAgICBtaW46IC0xLFxuICAgICAgICAgICAgbWF4OiAxMzEwNzIsXG4gICAgICAgICAgICBpbnQ6IHRydWUsXG4gICAgICAgICAgICBzdGVwOiAxLFxuICAgICAgICB9LFxuICAgICAgICAtMSxcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcInNlZWRcIixcbiAgICAgICAgXCJudW1lcmljXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIlNlZWRcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOiBcIi0xID0gb21pdCAoc2VydmVyIHBpY2tzIGEgcmFuZG9tIHNlZWQpLiBPdGhlcndpc2UgbWFwcyB0byBgc2VlZGAuXCIsXG4gICAgICAgICAgICBtaW46IC0xLFxuICAgICAgICAgICAgbWF4OiAyMTQ3NDgzNjQ3LFxuICAgICAgICAgICAgaW50OiB0cnVlLFxuICAgICAgICAgICAgc3RlcDogMSxcbiAgICAgICAgfSxcbiAgICAgICAgLTEsXG4gICAgKVxuICAgIC5maWVsZChcbiAgICAgICAgXCJzdG9wXCIsXG4gICAgICAgIFwic3RyaW5nXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIlN0b3AgU2VxdWVuY2VzXCIsXG4gICAgICAgICAgICBzdWJ0aXRsZTpcbiAgICAgICAgICAgICAgICBcIk9uZSBzZXF1ZW5jZSBwZXIgbGluZSBcdTIxOTIgYHN0b3BgIGFycmF5LiBXQVJOSU5HOiBzaG9ydCBzaW5nbGUtY2hhcmFjdGVyIHNlcXVlbmNlcyAoXFxcImFcXFwiKSBhYm9ydCBnZW5lcmF0aW9uIGFsbW9zdCBpbW1lZGlhdGVseSBcdTIwMTQgdXNlIHJlYWxpc3RpYyBtdWx0aS1jaGFyIHN0b3BzLlwiLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiPHxpbV9lbmR8PlxcbiMjIyBFTkRFXCIsXG4gICAgICAgICAgICBpc1BhcmFncmFwaDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJcIixcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcImNhY2hlX3Byb21wdFwiLFxuICAgICAgICBcImJvb2xlYW5cIixcbiAgICAgICAge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwiUHJvbXB0IENhY2hlIFJldXNlXCIsXG4gICAgICAgICAgICBzdWJ0aXRsZTogXCJsbGFtYS5jcHAtbmF0aXZlIGBjYWNoZV9wcm9tcHRgOiBrZWVwIHRoZSBzbG90IEtWIGNhY2hlIGJldHdlZW4gdHVybnMgKHJlY29tbWVuZGVkKS5cIixcbiAgICAgICAgfSxcbiAgICAgICAgdHJ1ZSxcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcImdyYW1tYXJcIixcbiAgICAgICAgXCJzdHJpbmdcIixcbiAgICAgICAge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwiR3JhbW1hciAoR0JORilcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOiBcIk9wdGlvbmFsIEdCTkYgZ3JhbW1hciBjb25zdHJhaW5pbmcgdGhlIG91dHB1dC4gRW1wdHkgPSB1bmNvbnN0cmFpbmVkLlwiLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwicm9vdCA6Oj0gXFxcInllc1xcXCIgfCBcXFwibm9cXFwiXCIsXG4gICAgICAgICAgICBpc1BhcmFncmFwaDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJcIixcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcImVuYWJsZVRoaW5raW5nXCIsXG4gICAgICAgIFwiYm9vbGVhblwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJFbmFibGUgVGhpbmtpbmdcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOlxuICAgICAgICAgICAgICAgIFwiY2hhdF90ZW1wbGF0ZV9rd2FyZ3MuZW5hYmxlX3RoaW5raW5nIChKU09OIGJvb2xlYW4pLiB0cnVlID0gbW9kZWwgb3BlbnMgPHRoaW5rPjsgZmFsc2UgPSBlbXB0eSB0aGluayBibG9jaywgc3RyYWlnaHQgYW5zd2VyLlwiLFxuICAgICAgICB9LFxuICAgICAgICB0cnVlLFxuICAgIClcbiAgICAuZmllbGQoXG4gICAgICAgIFwicmVhc29uaW5nRWZmb3J0XCIsXG4gICAgICAgIFwic2VsZWN0XCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIlJlYXNvbmluZyBFZmZvcnRcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOlxuICAgICAgICAgICAgICAgIFwiXFxcImRlZmF1bHRcXFwiID0gb21pdCBcdTIxOTIgdGVtcGxhdGUgZGVmYXVsdCAoeGhpZ2gpLiBXQVJOSU5HOiB0aGUgYm9uc2FpIHRlbXBsYXRlIGFjY2VwdHMgT05MWSB4aGlnaCwgbWVkaXVtLCBsb3cgXHUyMDE0IGFueSBvdGhlciB2YWx1ZSBhYm9ydHMgdGhlIHJlcXVlc3QuXCIsXG4gICAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICAgICAgeyB2YWx1ZTogXCJkZWZhdWx0XCIsIGRpc3BsYXlOYW1lOiBcIlRlbXBsYXRlIGRlZmF1bHQgKHhoaWdoKVwiIH0sXG4gICAgICAgICAgICAgICAgeyB2YWx1ZTogXCJ4aGlnaFwiLCBkaXNwbGF5TmFtZTogXCJ4aGlnaCAoZXhwbGljaXQpXCIgfSxcbiAgICAgICAgICAgICAgICB7IHZhbHVlOiBcIm1lZGl1bVwiLCBkaXNwbGF5TmFtZTogXCJtZWRpdW1cIiB9LFxuICAgICAgICAgICAgICAgIHsgdmFsdWU6IFwibG93XCIsIGRpc3BsYXlOYW1lOiBcImxvd1wiIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBcImRlZmF1bHRcIixcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcInRoaW5raW5nQnVkZ2V0XCIsXG4gICAgICAgIFwibnVtZXJpY1wiLFxuICAgICAgICB7XG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJUaGlua2luZyBCdWRnZXQgKFRva2VucylcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOlxuICAgICAgICAgICAgICAgIFwiMCA9IG9mZi4gPjAgXHUyMTkyIGByZWFzb25pbmdfYnVkZ2V0X3Rva2Vuc2A6IHNlcnZlciByZXdyaXRlcyB0aGUgcHJvbXB0IHdpdGggYSB0b2tlbiBjb3VudCBhbmQgaGFyZC1zdG9wcyB0aGlua2luZyBwYXN0IHRoZSBidWRnZXQuXCIsXG4gICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICBtYXg6IDY1NTM2LFxuICAgICAgICAgICAgaW50OiB0cnVlLFxuICAgICAgICAgICAgc3RlcDogMSxcbiAgICAgICAgfSxcbiAgICAgICAgMCxcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcInByZXNlcnZlVGhpbmtpbmdcIixcbiAgICAgICAgXCJib29sZWFuXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIlByZXNlcnZlIFRoaW5raW5nIGluIENvbnRleHRcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOlxuICAgICAgICAgICAgICAgIFwiY2hhdF90ZW1wbGF0ZV9rd2FyZ3MucHJlc2VydmVfdGhpbmtpbmcgKEpTT04gYm9vbGVhbik6IHJlLXNlbmQgcGFzdCBhc3Npc3RhbnQgPHRoaW5rPiBibG9ja3Mgb24gbGF0ZXIgdHVybnMuIFR1cm4gb2ZmIHRvIHNhdmUgY29udGV4dC5cIixcbiAgICAgICAgfSxcbiAgICAgICAgdHJ1ZSxcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcInJlYXNvbmluZ0Rpc3BsYXlcIixcbiAgICAgICAgXCJzZWxlY3RcIixcbiAgICAgICAge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwiUmVhc29uaW5nIERpc3BsYXlcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOlxuICAgICAgICAgICAgICAgIFwiSG93IHJlYXNvbmluZyByZWFjaGVzIHRoZSBMTSBTdHVkaW8gVUkuIE9ubHkgdXNlZCB3aGVuIHRoaW5raW5nIHRva2VucyBhcmUgc3RyZWFtZWQuXCIsXG4gICAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICAgICAgeyB2YWx1ZTogXCJuYXRpdmVcIiwgZGlzcGxheU5hbWU6IFwiTmF0aXZlICh0eXBlZCBmcmFnbWVudHMpXCIgfSxcbiAgICAgICAgICAgICAgICB7IHZhbHVlOiBcImlubGluZS10YWdzXCIsIGRpc3BsYXlOYW1lOiBcIklubGluZSAodGFncylcIiB9LFxuICAgICAgICAgICAgICAgIHsgdmFsdWU6IFwiaGlkZGVuXCIsIGRpc3BsYXlOYW1lOiBcIkhpZGRlbiAoZHJvcClcIiB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGRlcGVuZGVuY2llczogW3sga2V5OiBcImVuYWJsZVRoaW5raW5nXCIsIGNvbmRpdGlvbjogeyB0eXBlOiBcImVxdWFsc1wiLCB2YWx1ZTogdHJ1ZSB9IH1dLFxuICAgICAgICB9LFxuICAgICAgICBcIm5hdGl2ZVwiLFxuICAgIClcbiAgICAuZmllbGQoXG4gICAgICAgIFwicmVhc29uaW5nRm9ybWF0XCIsXG4gICAgICAgIFwic2VsZWN0XCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIlNlcnZlciBSZWFzb25pbmcgRm9ybWF0XCIsXG4gICAgICAgICAgICBzdWJ0aXRsZTpcbiAgICAgICAgICAgICAgICBcIlJlcXVlc3QtbGV2ZWwgYHJlYXNvbmluZ19mb3JtYXRgOiBkZWVwc2Vlay9hdXRvIHNlcGFyYXRlIHRoaW5raW5nIGludG8gYHJlYXNvbmluZ19jb250ZW50YCBkZWx0YXM7IG5vbmUga2VlcHMgcmF3IHRhZ3MgaW4gY29udGVudC5cIixcbiAgICAgICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgICAgICB7IHZhbHVlOiBcImRlZXBzZWVrXCIsIGRpc3BsYXlOYW1lOiBcImRlZXBzZWVrIChyZWNvbW1lbmRlZClcIiB9LFxuICAgICAgICAgICAgICAgIHsgdmFsdWU6IFwiYXV0b1wiLCBkaXNwbGF5TmFtZTogXCJhdXRvXCIgfSxcbiAgICAgICAgICAgICAgICB7IHZhbHVlOiBcImRlZXBzZWVrLWxlZ2FjeVwiLCBkaXNwbGF5TmFtZTogXCJkZWVwc2Vlay1sZWdhY3lcIiB9LFxuICAgICAgICAgICAgICAgIHsgdmFsdWU6IFwibm9uZVwiLCBkaXNwbGF5TmFtZTogXCJub25lXCIgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFwiZGVlcHNlZWtcIixcbiAgICApXG4gICAgLmZpZWxkKFxuICAgICAgICBcImV4dHJhUGFyYW1zXCIsXG4gICAgICAgIFwic3RyaW5nXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIkV4dHJhIFBhcmFtcyAoSlNPTilcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOlxuICAgICAgICAgICAgICAgIFwiQ2F0Y2gtYWxsIG1lcmdlZCBvbnRvIHRoZSByZXF1ZXN0IGxhc3Q6IG1pcm9zdGF0IC8gbWlyb3N0YXRfdGF1IC8gbWlyb3N0YXRfZXRhLCBkeW5hdGVtcF9yYW5nZSwgZHluYXRlbXBfZXhwb25lbnQsIHRvcF9uX3NpZ21hLCBuX3ByZWRpY3QsIHBlbmFsaXplX25sLCBcdTIwMjZcIixcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIntcXFwibWlyb3N0YXRcXFwiOiAyLCBcXFwibWlyb3N0YXRfdGF1XFxcIjogNS4wLCBcXFwibWlyb3N0YXRfZXRhXFxcIjogMC4xfVwiLFxuICAgICAgICAgICAgaXNQYXJhZ3JhcGg6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIFwie31cIixcbiAgICApXG4gICAgLmJ1aWxkKCk7XG5cbmV4cG9ydCBjb25zdCBnbG9iYWxDb25maWdTY2hlbWF0aWNzID0gY3JlYXRlQ29uZmlnU2NoZW1hdGljcygpXG4gICAgLmZpZWxkKFxuICAgICAgICBcImJhc2VVcmxcIixcbiAgICAgICAgXCJzdHJpbmdcIixcbiAgICAgICAge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwibGxhbWEuY3BwIEJhc2UgVVJMXCIsXG4gICAgICAgICAgICBzdWJ0aXRsZTogXCJPcGVuQUktY29tcGF0aWJsZSBlbmRwb2ludCBvZiB0aGUgbGxhbWEuY3BwIHNlcnZlciAoaW5jbC4gL3YxKS5cIixcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcImh0dHA6Ly8xMjcuMC4wLjE6OTkzMS92MVwiLFxuICAgICAgICB9LFxuICAgICAgICBcImh0dHA6Ly8xMjcuMC4wLjE6OTkzMS92MVwiLFxuICAgIClcbiAgICAuZmllbGQoXG4gICAgICAgIFwiYXBpS2V5XCIsXG4gICAgICAgIFwic3RyaW5nXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIkFQSSBLZXlcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOlxuICAgICAgICAgICAgICAgIFwiT25seSBuZWVkZWQgd2hlbiB0aGUgc2VydmVyIHJ1bnMgd2l0aCAtLWFwaS1rZXkuIFRoZSBvcGVuYWkgY2xpZW50IHJlcXVpcmVzIGEgbm9uLWVtcHR5IGtleTsgXFxcIm5vLWtleVxcXCIgaXMgdXNlZCB3aGVuIGVtcHR5LlwiLFxuICAgICAgICAgICAgaXNQcm90ZWN0ZWQ6IHRydWUsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogXCIoc2VydmVyIGRlZmF1bHQ6IG5vIGF1dGgpXCIsXG4gICAgICAgIH0sXG4gICAgICAgIFwiXCIsXG4gICAgKVxuICAgIC5maWVsZChcbiAgICAgICAgXCJ0aW1lb3V0TXNcIixcbiAgICAgICAgXCJudW1lcmljXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIlJlcXVlc3QgVGltZW91dCAobXMpXCIsXG4gICAgICAgICAgICBzdWJ0aXRsZTogXCJMb25nIGdlbmVyYXRpb25zIC8gYmlnIHByZWZpbGxzIG5lZWQgbW9yZSB0aGFuIHRoZSBsaWJyYXJ5IGRlZmF1bHQgKDEwIG1pbikuXCIsXG4gICAgICAgICAgICBtaW46IDEwMDAsXG4gICAgICAgICAgICBtYXg6IDcyMDAwMDAsXG4gICAgICAgICAgICBpbnQ6IHRydWUsXG4gICAgICAgICAgICBzdGVwOiAxMDAwLFxuICAgICAgICB9LFxuICAgICAgICAzNjAwMDAwLFxuICAgIClcbiAgICAuZmllbGQoXG4gICAgICAgIFwibWF4UmV0cmllc1wiLFxuICAgICAgICBcIm51bWVyaWNcIixcbiAgICAgICAge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwiTWF4IFJldHJpZXNcIixcbiAgICAgICAgICAgIHN1YnRpdGxlOiBcIkF1dG9tYXRpYyByZXRyaWVzIG9mIHRoZSBvcGVuYWkgY2xpZW50IG9uIGNvbm5lY3Rpb24gZXJyb3JzIC8gNXh4LlwiLFxuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAxMCxcbiAgICAgICAgICAgIGludDogdHJ1ZSxcbiAgICAgICAgICAgIHN0ZXA6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIDIsXG4gICAgKVxuICAgIC5maWVsZChcbiAgICAgICAgXCJjYUNlcnRQYXRoXCIsXG4gICAgICAgIFwic3RyaW5nXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIihPcHRpb25hbCkgQ0EgQ2VydGlmaWNhdGUgUGF0aFwiLFxuICAgICAgICAgICAgc3VidGl0bGU6XG4gICAgICAgICAgICAgICAgXCJBYnNvbHV0ZSBwYXRoIHRvIGEgUEVNIGZpbGUgdG8gdHJ1c3QgZm9yIEhUVFBTIGJhc2UgVVJMcyAoc2VsZi1zaWduZWQgbG9jYWwgc2VydmVycykuIEVtcHR5ID0gc3lzdGVtIHRydXN0IHN0b3JlLlwiLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwiL2hvbWUvdXNlci8ubG1zdHVkaW8vY2VydHMtZXh0cmEtY2EucGVtXCIsXG4gICAgICAgIH0sXG4gICAgICAgIFwiXCIsXG4gICAgKVxuICAgIC5idWlsZCgpO1xuXG4vKiogTmFtZXMgYWxsb3dlZCBpbiB7dmFyaWFibGV9IHN1YnN0aXR1dGlvbiBpbnNpZGUgdGhlIHN5c3RlbSBwcm9tcHQuICovXG5leHBvcnQgY29uc3QgU1lTVEVNX1BST01QVF9WQVJJQUJMRVMgPSBbXG4gICAgXCJkYXRlXCIsXG4gICAgXCJ0aW1lXCIsXG4gICAgXCJkYXRldGltZVwiLFxuICAgIFwibW9kZWxcIixcbiAgICBcInRpbWVzdGFtcFwiLFxuICAgIFwieWVhclwiLFxuICAgIFwibW9udGhcIixcbiAgICBcImRheVwiLFxuXSBhcyBjb25zdDsiLCAiaW1wb3J0IHsgdHlwZSBDaGF0LCB0eXBlIEdlbmVyYXRvckNvbnRyb2xsZXIsIHR5cGUgSW5mZXJQYXJzZWRDb25maWcgfSBmcm9tIFwiQGxtc3R1ZGlvL3Nka1wiO1xuaW1wb3J0IE9wZW5BSSBmcm9tIFwib3BlbmFpXCI7XG5pbXBvcnQge1xuICAgIHR5cGUgQ2hhdENvbXBsZXRpb25NZXNzYWdlUGFyYW0sXG4gICAgdHlwZSBDaGF0Q29tcGxldGlvbk1lc3NhZ2VUb29sQ2FsbCxcbiAgICB0eXBlIENoYXRDb21wbGV0aW9uVG9vbCxcbiAgICB0eXBlIENoYXRDb21wbGV0aW9uVG9vbE1lc3NhZ2VQYXJhbSxcbn0gZnJvbSBcIm9wZW5haS9yZXNvdXJjZXMvaW5kZXhcIjtcbmltcG9ydCB7IGNvbmZpZ1NjaGVtYXRpY3MsIGdsb2JhbENvbmZpZ1NjaGVtYXRpY3MsIFNZU1RFTV9QUk9NUFRfVkFSSUFCTEVTIH0gZnJvbSBcIi4vY29uZmlnXCI7XG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwibm9kZTpmc1wiO1xuaW1wb3J0ICogYXMgaHR0cHMgZnJvbSBcIm5vZGU6aHR0cHNcIjtcblxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8qICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUeXBlcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICovXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG50eXBlIFRvb2xDYWxsU3RhdGUgPSB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBuYW1lOiBzdHJpbmcgfCBudWxsO1xuICAgIGluZGV4OiBudW1iZXI7XG4gICAgYXJndW1lbnRzOiBzdHJpbmc7XG59O1xuXG50eXBlIFJlYXNvbmluZ0Rpc3BsYXkgPSBcIm5hdGl2ZVwiIHwgXCJpbmxpbmUtdGFnc1wiIHwgXCJoaWRkZW5cIjtcblxudHlwZSBQYXJzZWRNb2RlbENvbmZpZyA9IEluZmVyUGFyc2VkQ29uZmlnPHR5cGVvZiBjb25maWdTY2hlbWF0aWNzPjtcblxuLyoqXG4gKiBUaGUgZXhhY3QgYm9keSB0aGlzIHBsdWdpbiBzZW5kcyB0byB0aGUgbGxhbWEuY3BwIHNlcnZlcidzIC92MS9jaGF0L2NvbXBsZXRpb25zLlxuICogRXhwb3J0ZWQgZm9yIHRoZSB1bml0IHRlc3RzIChzZWUgc2NyYXRjaGVzIGluIHRoZSBwbHVnaW4gd29ya3NwYWNlKS5cbiAqL1xuZXhwb3J0IHR5cGUgTGxhbWFDaGF0Qm9keSA9IFJlY29yZDxzdHJpbmcsIGFueT47XG5cbi8qKiBGcmFnbWVudCBvcHRpb25zIGZvcndhcmRlZCB0byB0aGUgTE0gU3R1ZGlvIFVJIChzdWJzZXQgb2YgdGhlIFNESydzKS4gKi9cbnR5cGUgRnJhZ21lbnRPcHRzID0geyB0b2tlbkNvdW50PzogbnVtYmVyOyByZWFzb25pbmdUeXBlPzogXCJub25lXCIgfCBcInJlYXNvbmluZ1wiIH07XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiAgICAgICAgICAgICAgICAgICAgICAgICAgIENsaWVudCAmIHJlcXVlc3QgYnVpbGRpbmcgICAgICAgICAgICAgICAgICAgICAgICAqL1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqIEJ1aWxkIGEgcHJlLWNvbmZpZ3VyZWQgT3BlbkFJIGNsaWVudCBwb2ludGVkIGF0IHRoZSBsbGFtYS5jcHAgc2VydmVyLiAqL1xuZnVuY3Rpb24gY3JlYXRlQ2xpZW50KFxuICAgIGdsb2JhbENvbmZpZzogSW5mZXJQYXJzZWRDb25maWc8dHlwZW9mIGdsb2JhbENvbmZpZ1NjaGVtYXRpY3M+LFxuKTogT3BlbkFJIHtcbiAgICBjb25zdCBiYXNlVVJMID0gZ2xvYmFsQ29uZmlnLmdldChcImJhc2VVcmxcIik7XG4gICAgY29uc3QgYXBpS2V5ID0gZ2xvYmFsQ29uZmlnLmdldChcImFwaUtleVwiKTtcbiAgICBjb25zdCB0aW1lb3V0TXMgPSBnbG9iYWxDb25maWcuZ2V0KFwidGltZW91dE1zXCIpO1xuICAgIGNvbnN0IG1heFJldHJpZXMgPSBnbG9iYWxDb25maWcuZ2V0KFwibWF4UmV0cmllc1wiKTtcbiAgICBjb25zdCBjYUNlcnRQYXRoID0gZ2xvYmFsQ29uZmlnLmdldChcImNhQ2VydFBhdGhcIik7XG5cbiAgICBsZXQgaHR0cHNBZ2VudDogaHR0cHMuQWdlbnQgfCB1bmRlZmluZWQ7XG4gICAgaWYgKGJhc2VVUkwuc3RhcnRzV2l0aChcImh0dHBzOi8vXCIpICYmIGNhQ2VydFBhdGgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNhID0gZnMucmVhZEZpbGVTeW5jKGNhQ2VydFBhdGgsIFwidXRmOFwiKTtcbiAgICAgICAgICAgIGh0dHBzQWdlbnQgPSBuZXcgaHR0cHMuQWdlbnQoeyBjYSwga2VlcEFsaXZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKGBbbGxhbWEtY29tcGF0XSBVc2luZyBjdXN0b20gQ0EgY2VydGlmaWNhdGU6ICR7Y2FDZXJ0UGF0aH1gKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtsbGFtYS1jb21wYXRdIEZhaWxlZCB0byByZWFkIENBIGNlcnQgYXQgJHtjYUNlcnRQYXRofTpgLCAoZXJyIGFzIEVycm9yKS5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgT3BlbkFJKHtcbiAgICAgICAgYXBpS2V5OiBhcGlLZXkgfHwgXCJuby1rZXlcIiwgLy8gbGxhbWEuY3BwIGlnbm9yZXMgdGhlIGtleSB1bmxlc3MgLS1hcGkta2V5IGlzIHNldC5cbiAgICAgICAgYmFzZVVSTCxcbiAgICAgICAgdGltZW91dDogdGltZW91dE1zLFxuICAgICAgICBtYXhSZXRyaWVzLFxuICAgICAgICAuLi4oaHR0cHNBZ2VudCA/IHsgaHR0cHNBZ2VudCB9IDoge30pLFxuICAgICAgICBkZWZhdWx0SGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgIH0pO1xufVxuXG4vKiogUHJvY2VzcyBzeXN0ZW0gcHJvbXB0IHdpdGggZHluYW1pYyB2YXJpYWJsZSBzdWJzdGl0dXRpb24gKGFzLWlzLCBiZWZvcmUgdmFsaWRhdGlvbikuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc1N5c3RlbVByb21wdChzeXN0ZW1Qcm9tcHQ6IHN0cmluZywgbW9kZWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKCFzeXN0ZW1Qcm9tcHQpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCB2YXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgIGRhdGU6IG5vdy50b0xvY2FsZURhdGVTdHJpbmcoKSxcbiAgICAgICAgdGltZTogbm93LnRvTG9jYWxlVGltZVN0cmluZygpLFxuICAgICAgICBkYXRldGltZTogbm93LnRvTG9jYWxlU3RyaW5nKCksXG4gICAgICAgIG1vZGVsOiBtb2RlbCxcbiAgICAgICAgdGltZXN0YW1wOiBub3cudG9JU09TdHJpbmcoKSxcbiAgICAgICAgeWVhcjogbm93LmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSxcbiAgICAgICAgbW9udGg6IChub3cuZ2V0TW9udGgoKSArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpLFxuICAgICAgICBkYXk6IG5vdy5nZXREYXRlKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIiksXG4gICAgfTtcblxuICAgIGxldCBwcm9jZXNzZWQgPSBzeXN0ZW1Qcm9tcHQ7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModmFyaWFibGVzKSkge1xuICAgICAgICBwcm9jZXNzZWQgPSBwcm9jZXNzZWQucmVwbGFjZShuZXcgUmVnRXhwKGBcXFxceyR7a2V5fVxcXFx9YCwgXCJnaVwiKSwgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvY2Vzc2VkO1xufVxuXG4vKiogQ29udmVydCBMTSBTdHVkaW8gY2hhdCBoaXN0b3J5IHRvIE9wZW5BSSBtZXNzYWdlIGZvcm1hdC4gKi9cbmZ1bmN0aW9uIHRvT3BlbkFJTWVzc2FnZXMoXG4gICAgaGlzdG9yeTogQ2hhdCxcbiAgICBzeXN0ZW1Qcm9tcHQ/OiBzdHJpbmcsXG4pOiBDaGF0Q29tcGxldGlvbk1lc3NhZ2VQYXJhbVtdIHtcbiAgICBjb25zdCBtZXNzYWdlczogQ2hhdENvbXBsZXRpb25NZXNzYWdlUGFyYW1bXSA9IFtdO1xuXG4gICAgaWYgKHN5c3RlbVByb21wdCkge1xuICAgICAgICBtZXNzYWdlcy5wdXNoKHsgcm9sZTogXCJzeXN0ZW1cIiwgY29udGVudDogc3lzdGVtUHJvbXB0IH0pO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBoaXN0b3J5KSB7XG4gICAgICAgIHN3aXRjaCAobWVzc2FnZS5nZXRSb2xlKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJzeXN0ZW1cIjpcbiAgICAgICAgICAgICAgICAvLyBDdXN0b20gc3lzdGVtIHByb21wdCB3aW5zOyBvbmx5IGZhbGwgYmFjayB0byBoaXN0b3J5J3Mgb3duIHN5c3RlbSB0ZXh0LlxuICAgICAgICAgICAgICAgIGlmICghc3lzdGVtUHJvbXB0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goeyByb2xlOiBcInN5c3RlbVwiLCBjb250ZW50OiBtZXNzYWdlLmdldFRleHQoKSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgXCJ1c2VyXCI6XG4gICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaCh7IHJvbGU6IFwidXNlclwiLCBjb250ZW50OiBtZXNzYWdlLmdldFRleHQoKSB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBcImFzc2lzdGFudFwiOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9vbENhbGxzOiBDaGF0Q29tcGxldGlvbk1lc3NhZ2VUb29sQ2FsbFtdID0gbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAuZ2V0VG9vbENhbGxSZXF1ZXN0cygpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAodG9vbENhbGwgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0b29sQ2FsbC5pZCA/PyBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJmdW5jdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB0b29sQ2FsbC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50czogSlNPTi5zdHJpbmdpZnkodG9vbENhbGwuYXJndW1lbnRzID8/IHt9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICByb2xlOiBcImFzc2lzdGFudFwiLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBtZXNzYWdlLmdldFRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgLi4uKHRvb2xDYWxscy5sZW5ndGggPyB7IHRvb2xfY2FsbHM6IHRvb2xDYWxscyB9IDoge30pLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYXNlIFwidG9vbFwiOiB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZS5nZXRUb29sQ2FsbFJlc3VsdHMoKS5mb3JFYWNoKHRvb2xDYWxsUmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlOiBcInRvb2xcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvb2xfY2FsbF9pZDogdG9vbENhbGxSZXN1bHQudG9vbENhbGxJZCA/PyBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogdG9vbENhbGxSZXN1bHQuY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgfSBhcyBDaGF0Q29tcGxldGlvblRvb2xNZXNzYWdlUGFyYW0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lc3NhZ2VzO1xufVxuXG4vKiogQ29udmVydCBMTSBTdHVkaW8gdG9vbCBkZWZpbml0aW9ucyB0byBPcGVuQUkgZnVuY3Rpb24tdG9vbCBkZXNjcmlwdG9ycy4gKi9cbmZ1bmN0aW9uIHRvT3BlbkFJVG9vbHMoY3RsOiBHZW5lcmF0b3JDb250cm9sbGVyKTogQ2hhdENvbXBsZXRpb25Ub29sW10gfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHRvb2xzID0gY3RsLmdldFRvb2xEZWZpbml0aW9ucygpLm1hcDxDaGF0Q29tcGxldGlvblRvb2w+KHQgPT4gKHtcbiAgICAgICAgdHlwZTogXCJmdW5jdGlvblwiLFxuICAgICAgICBmdW5jdGlvbjoge1xuICAgICAgICAgICAgbmFtZTogdC5mdW5jdGlvbi5uYW1lLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IHQuZnVuY3Rpb24uZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB0LmZ1bmN0aW9uLnBhcmFtZXRlcnMgPz8ge30sXG4gICAgICAgIH0sXG4gICAgfSkpO1xuICAgIHJldHVybiB0b29scy5sZW5ndGggPyB0b29scyA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBCdWlsZCB0aGUgZXhhY3QgcmVxdWVzdCBib2R5IGZvciB0aGUgbGxhbWEuY3BwIHNlcnZlci5cbiAqXG4gKiBDb250cmFjdCBub3RlcyAodmVyaWZpZWQgYWdhaW5zdCB0b29scy9zZXJ2ZXIvc2VydmVyLWNvbW1vbi5jcHAgb2Ygb3VyIGJ1aWxkKTpcbiAqICAtIE9wZW5BSS1zdGFuZGFyZCBwYXJhbXMgKHRlbXBlcmF0dXJlLCB0b3BfcCwgcHJlc2VuY2UvZnJlcXVlbmN5X3BlbmFsdHksXG4gKiAgICBtYXhfdG9rZW5zLCBzZWVkLCBzdG9wLCBzdHJlYW0sIHRvb2xzLCByZXNwb25zZV9mb3JtYXQpIGFyZSBoYW5kbGVkIG5hdGl2ZWx5LlxuICogIC0gbGxhbWEuY3BwIHBhc3MtdGhyb3VnaCBwYXJhbXMgKHRvcF9rLCBtaW5fcCwgcmVwZWF0X3BlbmFsdHksIGNhY2hlX3Byb21wdCxcbiAqICAgIGdyYW1tYXIsIFx1MjAyNikgYXJlIGNvcGllZCB2ZXJiYXRpbSBpbnRvIGxsYW1hX3BhcmFtcy5cbiAqICAtIGNoYXRfdGVtcGxhdGVfa3dhcmdzLmVuYWJsZV90aGlua2luZyAvIC5wcmVzZXJ2ZV90aGlua2luZyBNVVNUIGJlIEpTT05cbiAqICAgIGJvb2xlYW5zIFx1MjAxNCB0aGUgc2VydmVyIGR1bXAoKXMgZWFjaCBrd2FyZyBhbmQgdGhlIHRlbXBsYXRlIGNvbXBhcmVzIGFnYWluc3RcbiAqICAgIFwidHJ1ZVwiL1wiZmFsc2VcIjsgc2VuZGluZyB0aGUgU1RSSU5HIFwiZmFsc2VcIiB3b3VsZCByZWFkIGFzIHRydXRoeS5cbiAqICAtIHJlYXNvbmluZ19lZmZvcnQgaXMgdGhlIE9wZW5BSS1zdHlsZSByZXF1ZXN0IGtleTsgdGhlIHNlcnZlciBzcGVjaWFsLWNhc2VzXG4gKiAgICBpdCBhbmQgZm9yd2FyZHMgaXQgdG8gdGhlIHRlbXBsYXRlLiBPbmx5IHhoaWdoL21lZGl1bS9sb3cgYXJlIHZhbGlkIGZvclxuICogICAgdGhlIGJvbnNhaSB0ZW1wbGF0ZSAoaXRzIGRlZmF1bHQgaXMgeGhpZ2gpLlxuICogIC0gcmVhc29uaW5nX2J1ZGdldF90b2tlbnMgKHNlcnZlciBhbGlhczogdGhpbmtpbmdfYnVkZ2V0X3Rva2VucykgZW5mb3JjZXMgYVxuICogICAgaGFyZCB0aGlua2luZy10b2tlbiBidWRnZXQgYXQgdGhlIHNhbXBsaW5nIGxheWVyOyByZXF1aXJlcyB0aGUgdGVtcGxhdGUgdG9cbiAqICAgIGV4cG9zZSB0aGlua2luZyB0YWdzICh0aGUgcXdlbjM1L2JvbnNhaSB0ZW1wbGF0ZSBkb2VzKS5cbiAqICAtIGV4dHJhUGFyYW1zIGlzIG1lcmdlZCBsYXN0IHNvIGl0IGNhbiBhZGQgYW55dGhpbmcgZWxzZSAobWlyb3N0YXQgJiBjbylcbiAqICAgIGFuZCBvdmVycmlkZSBpbmRpdmlkdWFsIGZpZWxkcyBkZWxpYmVyYXRlbHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFJlcXVlc3RCb2R5KFxuICAgIGNvbmZpZzogUGFyc2VkTW9kZWxDb25maWcsXG4gICAgbWVzc2FnZXM6IENoYXRDb21wbGV0aW9uTWVzc2FnZVBhcmFtW10sXG4gICAgdG9vbHM/OiBDaGF0Q29tcGxldGlvblRvb2xbXSxcbik6IExsYW1hQ2hhdEJvZHkge1xuICAgIGNvbnN0IGJvZHk6IExsYW1hQ2hhdEJvZHkgPSB7XG4gICAgICAgIG1vZGVsOiBjb25maWcuZ2V0KFwibW9kZWxcIiksXG4gICAgICAgIG1lc3NhZ2VzLFxuICAgICAgICB0b29scyxcbiAgICAgICAgc3RyZWFtOiB0cnVlLFxuICAgIH07XG5cbiAgICBpZiAoIXRvb2xzIHx8IHRvb2xzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgYm9keS50b29sczsgLy8gbGxhbWEuY3BwIGlzIGZpbmUgd2l0aCB0b29sczogW10sIGJ1dCBjbGVhbmVyIHdpdGhvdXQuXG4gICAgfVxuXG4gICAgY29uc3Qgc2FtcGxlclBpY2tzOiBBcnJheTxbc3RyaW5nLCBhbnksICh2OiBhbnkpID0+IGJvb2xlYW5dPiA9IFtcbiAgICAgICAgW1widGVtcGVyYXR1cmVcIiwgY29uZmlnLmdldChcInRlbXBlcmF0dXJlXCIpLCAodjogYW55KTogYm9vbGVhbiA9PiB2ID49IDBdLFxuICAgICAgICBbXCJ0b3BfcFwiLCBjb25maWcuZ2V0KFwidG9wX3BcIiksICh2OiBhbnkpOiBib29sZWFuID0+IHYgPj0gMF0sXG4gICAgICAgIFtcInRvcF9rXCIsIGNvbmZpZy5nZXQoXCJ0b3Bfa1wiKSwgKHY6IGFueSk6IGJvb2xlYW4gPT4gdiA+PSAwXSxcbiAgICAgICAgW1wibWluX3BcIiwgY29uZmlnLmdldChcIm1pbl9wXCIpLCAodjogYW55KTogYm9vbGVhbiA9PiB2ID49IDBdLFxuICAgICAgICBbXCJyZXBlYXRfcGVuYWx0eVwiLCBjb25maWcuZ2V0KFwicmVwZWF0X3BlbmFsdHlcIiksICh2OiBhbnkpOiBib29sZWFuID0+IHYgPj0gMF0sXG4gICAgICAgIFtcInByZXNlbmNlX3BlbmFsdHlcIiwgY29uZmlnLmdldChcInByZXNlbmNlX3BlbmFsdHlcIiksICgpOiBib29sZWFuID0+IHRydWVdLFxuICAgICAgICBbXCJmcmVxdWVuY3lfcGVuYWx0eVwiLCBjb25maWcuZ2V0KFwiZnJlcXVlbmN5X3BlbmFsdHlcIiksICgpOiBib29sZWFuID0+IHRydWVdLFxuICAgICAgICBbXCJtYXhfdG9rZW5zXCIsIGNvbmZpZy5nZXQoXCJtYXhfdG9rZW5zXCIpLCAodjogYW55KTogYm9vbGVhbiA9PiB2ID4gMF0sXG4gICAgICAgIFtcInNlZWRcIiwgY29uZmlnLmdldChcInNlZWRcIiksICh2OiBhbnkpOiBib29sZWFuID0+IHYgPj0gMF0sXG4gICAgXTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlLCBpbmNsdWRlXSBvZiBzYW1wbGVyUGlja3MpIHtcbiAgICAgICAgaWYgKGluY2x1ZGUodmFsdWUpKSB7XG4gICAgICAgICAgICBib2R5W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0b3Agc2VxdWVuY2VzOiBvbmUgcGVyIGxpbmUgaW4gdGhlIFVJLCBPcGVuQUkgYXJyYXkgb24gdGhlIHdpcmUuXG4gICAgY29uc3Qgc3RvcCA9IFN0cmluZyhjb25maWcuZ2V0KFwic3RvcFwiKSA/PyBcIlwiKVxuICAgICAgICAuc3BsaXQoXCJcXG5cIilcbiAgICAgICAgLm1hcChzID0+IHMudHJpbSgpKVxuICAgICAgICAuZmlsdGVyKHMgPT4gcy5sZW5ndGggPiAwKTtcbiAgICBpZiAoc3RvcC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGJvZHkuc3RvcCA9IHN0b3A7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5nZXQoXCJjYWNoZV9wcm9tcHRcIikpIHtcbiAgICAgICAgYm9keS5jYWNoZV9wcm9tcHQgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGdyYW1tYXIgPSBTdHJpbmcoY29uZmlnLmdldChcImdyYW1tYXJcIikgPz8gXCJcIikudHJpbSgpO1xuICAgIGlmIChncmFtbWFyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHRvb2xzICYmIHRvb2xzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIGxsYW1hLmNwcCBzZXJ2ZXIgcmVqZWN0cyB0aGUgY29tYmluYXRpb24gKEhUVFAgNDAwKS5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnbGxhbWEtY29tcGF0LWVuZHBvaW50OiBcIkdyYW1tYXIgKEdCTkYpXCIgY2Fubm90IGJlIGNvbWJpbmVkIHdpdGggdG9vbHMgJyArXG4gICAgICAgICAgICAgICAgXCIobGxhbWEuY3BwOiBjdXN0b20gZ3JhbW1hciBjb25zdHJhaW50cyBleGNsdWRlIHRvb2wgY2FsbHMpLiBDbGVhciB0aGUgZ3JhbW1hciBmaWVsZC5cIixcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgYm9keS5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgICB9XG5cbiAgICAvLyAtLS0gUmVhc29uaW5nIC8gdGhpbmtpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGNoYXRfdGVtcGxhdGVfa3dhcmdzIGlzIGFsd2F5cyBwcmVzZW50IHNvIHRoZSB0ZW1wbGF0ZSBrd2FyZ3MgYXJlIGV4cGxpY2l0LlxuICAgIGNvbnN0IGNoYXRUZW1wbGF0ZUt3YXJnczogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICAgICAgZW5hYmxlX3RoaW5raW5nOiBjb25maWcuZ2V0KFwiZW5hYmxlVGhpbmtpbmdcIikgPT09IHRydWUsXG4gICAgICAgIHByZXNlcnZlX3RoaW5raW5nOiBjb25maWcuZ2V0KFwicHJlc2VydmVUaGlua2luZ1wiKSA9PT0gdHJ1ZSxcbiAgICB9O1xuICAgIGJvZHkuY2hhdF90ZW1wbGF0ZV9rd2FyZ3MgPSBjaGF0VGVtcGxhdGVLd2FyZ3M7XG5cbiAgICBjb25zdCByZWFzb25pbmdFZmZvcnQgPSBTdHJpbmcoY29uZmlnLmdldChcInJlYXNvbmluZ0VmZm9ydFwiKSA/PyBcIlwiKTtcbiAgICBpZiAoW1wieGhpZ2hcIiwgXCJtZWRpdW1cIiwgXCJsb3dcIl0uaW5jbHVkZXMocmVhc29uaW5nRWZmb3J0KSkge1xuICAgICAgICBib2R5LnJlYXNvbmluZ19lZmZvcnQgPSByZWFzb25pbmdFZmZvcnQ7XG4gICAgfVxuXG4gICAgY29uc3QgdGhpbmtpbmdCdWRnZXQgPSBNYXRoLnRydW5jKE51bWJlcihjb25maWcuZ2V0KFwidGhpbmtpbmdCdWRnZXRcIikgPz8gMCkpO1xuICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodGhpbmtpbmdCdWRnZXQpICYmIHRoaW5raW5nQnVkZ2V0ID4gMCkge1xuICAgICAgICBib2R5LnJlYXNvbmluZ19idWRnZXRfdG9rZW5zID0gdGhpbmtpbmdCdWRnZXQ7XG4gICAgfVxuXG4gICAgYm9keS5yZWFzb25pbmdfZm9ybWF0ID0gU3RyaW5nKGNvbmZpZy5nZXQoXCJyZWFzb25pbmdGb3JtYXRcIikgPz8gXCJkZWVwc2Vla1wiKTtcblxuICAgIC8vIC0tLSBDYXRjaC1hbGwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgY29uc3QgZXh0cmFSYXcgPSBTdHJpbmcoY29uZmlnLmdldChcImV4dHJhUGFyYW1zXCIpID8/IFwie31cIikudHJpbSgpIHx8IFwie31cIjtcbiAgICBsZXQgZXh0cmE6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gICAgdHJ5IHtcbiAgICAgICAgZXh0cmEgPSBKU09OLnBhcnNlKGV4dHJhUmF3KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYGxsYW1hLWNvbXBhdC1lbmRwb2ludDogXCJFeHRyYSBQYXJhbXMgKEpTT04pXCIgaXMgbm90IHZhbGlkIEpTT046ICR7ZXh0cmFSYXd9YCxcbiAgICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBleHRyYSAhPT0gXCJvYmplY3RcIiB8fCBleHRyYSA9PT0gbnVsbCB8fCBBcnJheS5pc0FycmF5KGV4dHJhKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2xsYW1hLWNvbXBhdC1lbmRwb2ludDogXCJFeHRyYSBQYXJhbXMgKEpTT04pXCIgbXVzdCBiZSBhIEpTT04gb2JqZWN0LicpO1xuICAgIH1cbiAgICBPYmplY3QuYXNzaWduKGJvZHksIGV4dHJhKTtcblxuICAgIHJldHVybiBib2R5O1xufVxuXG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLyogICAgICAgICAgICAgICAgICAgICAgICBSZWFzb25pbmctYXdhcmUgc3RyZWFtIHJvdXRlciAgICAgICAgICAgICAgICAgICAgICAgKi9cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbi8qKlxuICogUm91dGVzIGEgbGxhbWEuY3BwIHJlYXNvbmluZyBzdHJlYW0gaW50byBMTSBTdHVkaW8ncyBHZW5lcmF0b3JDb250cm9sbGVyLlxuICpcbiAqIFRoZSBzZXJ2ZXIgKHJlYXNvbmluZ19mb3JtYXQgZGVlcHNlZWspIHNlcGFyYXRlcyA8dGhpbms+XHUyMDI2PC90aGluaz4gY29udGVudCBpbnRvXG4gKiBkZWx0YS5yZWFzb25pbmdfY29udGVudC4gTE0gU3R1ZGlvIHVuZGVyc3RhbmRzIHR5cGVkIGZyYWdtZW50cyBuYXRpdmVseSwgc28gaW5cbiAqIFwibmF0aXZlXCIgbW9kZSB3ZSBlbWl0IHJlYXNvbmluZ1N0YXJ0VGFnIC8gcmVhc29uaW5nIC8gcmVhc29uaW5nRW5kVGFnLW1hcmtlZFxuICogZnJhZ21lbnRzIFx1MjAxNCB0aGF0IG1ha2VzIHRoZSBVSSBzaG93IGEgcHJvcGVyIGNvbGxhcHNpYmxlIHRoaW5raW5nIGJsb2NrLlxuICpcbiAqIEV4cG9ydGVkIGZvciB0aGUgdW5pdCB0ZXN0cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlYXNvbmluZ1N0cmVhbVJvdXRlciB7XG4gICAgcHJpdmF0ZSBpblJlYXNvbmluZyA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgY3RsOiBHZW5lcmF0b3JDb250cm9sbGVyLFxuICAgICAgICBwcml2YXRlIG1vZGU6IFJlYXNvbmluZ0Rpc3BsYXksXG4gICAgKSB7fVxuXG4gICAgLyoqIENsb3NlIGFuIG9wZW4gdGhpbmtpbmcgYmxvY2sgKG1hcmtlciBmcmFnbWVudCBvciBjbG9zaW5nIHRhZykuICovXG4gICAgcHJpdmF0ZSBjbG9zZVJlYXNvbmluZygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmluUmVhc29uaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pblJlYXNvbmluZyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5tb2RlID09PSBcIm5hdGl2ZVwiKSB7XG4gICAgICAgICAgICB0aGlzLmN0bC5mcmFnbWVudEdlbmVyYXRlZChcIlwiLCB7IHJlYXNvbmluZ1R5cGU6IFwicmVhc29uaW5nRW5kVGFnXCIsIHRva2VuQ291bnQ6IDAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5tb2RlID09PSBcImlubGluZS10YWdzXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY3RsLmZyYWdtZW50R2VuZXJhdGVkKFwiXFxuPC90aGluaz5cXG5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogRmVlZCBvbmUgZGVsdGEgb2JqZWN0IChjaHVuay5jaG9pY2VzWzBdLmRlbHRhKS4gKi9cbiAgICBvbkRlbHRhKGRlbHRhOiBhbnkpIHtcbiAgICAgICAgaWYgKCFkZWx0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVhc29uaW5nOiBzdHJpbmcgfCB1bmRlZmluZWQgPSAoZGVsdGEgYXMgYW55KS5yZWFzb25pbmdfY29udGVudDtcbiAgICAgICAgaWYgKHR5cGVvZiByZWFzb25pbmcgPT09IFwic3RyaW5nXCIgJiYgcmVhc29uaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pblJlYXNvbmluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5SZWFzb25pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vZGUgPT09IFwibmF0aXZlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdGwuZnJhZ21lbnRHZW5lcmF0ZWQoXCJcIiwgeyByZWFzb25pbmdUeXBlOiBcInJlYXNvbmluZ1N0YXJ0VGFnXCIsIHRva2VuQ291bnQ6IDAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1vZGUgPT09IFwiaW5saW5lLXRhZ3NcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN0bC5mcmFnbWVudEdlbmVyYXRlZChcIjx0aGluaz5cXG5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMubW9kZSAhPT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgICAgIHRoaXMuY3RsLmZyYWdtZW50R2VuZXJhdGVkKHJlYXNvbmluZywgeyByZWFzb25pbmdUeXBlOiBcInJlYXNvbmluZ1wiIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuOyAvLyBhIGRlbHRhIGlzIGVpdGhlciByZWFzb25pbmcgb3IgY29udGVudCBpbiBsbGFtYS5jcHAgc3RyZWFtc1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29udGVudDogc3RyaW5nIHwgdW5kZWZpbmVkID0gZGVsdGEuY29udGVudDtcbiAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiICYmIGNvbnRlbnQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZVJlYXNvbmluZygpO1xuICAgICAgICAgICAgLy8gTm9ybWFsIGFuc3dlciB0ZXh0IGlzIGFsd2F5cyBzaG93bjsgb25seSByZWFzb25pbmcgY2FuIGJlIGhpZGRlbi5cbiAgICAgICAgICAgIHRoaXMuY3RsLmZyYWdtZW50R2VuZXJhdGVkKGNvbnRlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCB0b29sQ2FsbCBvZiBkZWx0YS50b29sX2NhbGxzID8/IFtdKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlUmVhc29uaW5nKCk7IC8vIHRvb2wgY2FsbCBmcmFnbWVudHMgYXJlIG5vdCByZWFzb25pbmdcbiAgICAgICAgICAgIHRoaXMub25Ub29sQ2FsbEZyYWdtZW50KHRvb2xDYWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBGZWVkIGEgdG9vbF9jYWxscyBmcmFnbWVudCAoaWQgLyBuYW1lIC8gYXJndW1lbnQgY2h1bmtzKS4gKi9cbiAgICBwcml2YXRlIG9uVG9vbENhbGxGcmFnbWVudCh0b29sQ2FsbDogYW55KSB7XG4gICAgICAgIGlmICghdG9vbENhbGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9vbENhbGwuaWQgIT09IHVuZGVmaW5lZCAmJiB0b29sQ2FsbC5pZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudCAhPT0gbnVsbCAmJiB0aGlzLmN1cnJlbnQubmFtZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmx1c2hUb29sQ2FsbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0ge1xuICAgICAgICAgICAgICAgIGlkOiB0b29sQ2FsbC5pZCxcbiAgICAgICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAgICAgIGluZGV4OiB0b29sQ2FsbC5pbmRleCA/PyB0aGlzLnRvb2xDYWxsSW5kZXgrKyxcbiAgICAgICAgICAgICAgICBhcmd1bWVudHM6IFwiXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5jdGwudG9vbENhbGxHZW5lcmF0aW9uU3RhcnRlZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0b29sQ2FsbC5mdW5jdGlvbj8ubmFtZSA9PT0gXCJzdHJpbmdcIiAmJiB0aGlzLmN1cnJlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5uYW1lID0gdG9vbENhbGwuZnVuY3Rpb24ubmFtZTtcbiAgICAgICAgICAgIHRoaXMuY3RsLnRvb2xDYWxsR2VuZXJhdGlvbk5hbWVSZWNlaXZlZCh0b29sQ2FsbC5mdW5jdGlvbi5uYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdG9vbENhbGwuZnVuY3Rpb24/LmFyZ3VtZW50cyA9PT0gXCJzdHJpbmdcIiAmJiB0aGlzLmN1cnJlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5hcmd1bWVudHMgKz0gdG9vbENhbGwuZnVuY3Rpb24uYXJndW1lbnRzO1xuICAgICAgICAgICAgdGhpcy5jdGwudG9vbENhbGxHZW5lcmF0aW9uQXJndW1lbnRGcmFnbWVudEdlbmVyYXRlZCh0b29sQ2FsbC5mdW5jdGlvbi5hcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGN1cnJlbnQ6IFRvb2xDYWxsU3RhdGUgfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIHRvb2xDYWxsSW5kZXggPSAwO1xuXG4gICAgLyoqIEVtaXQgYSBmaW5hbGl6ZWQgdG9vbCBjYWxsIHJlcXVlc3QgaW50byBMTSBTdHVkaW8uICovXG4gICAgcHVibGljIGZsdXNoVG9vbENhbGwoKSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5jdXJyZW50O1xuICAgICAgICBpZiAoc3RhdGUgPT09IG51bGwgfHwgc3RhdGUubmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhcmdzOiB1bmtub3duO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXJncyA9IEpTT04ucGFyc2Uoc3RhdGUuYXJndW1lbnRzIHx8IFwie31cIik7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgYXJncyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3RsLnRvb2xDYWxsR2VuZXJhdGlvbkVuZGVkKHtcbiAgICAgICAgICAgIHR5cGU6IFwiZnVuY3Rpb25cIixcbiAgICAgICAgICAgIG5hbWU6IHN0YXRlLm5hbWUsXG4gICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3MsXG4gICAgICAgICAgICBpZDogc3RhdGUuaWQsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKiBDYWxsIHdoZW4gdGhlIFNTRSBzdHJlYW0gZW5kZWQgKGNsb3NlcyBhIHN0aWxsLW9wZW4gdGhpbmtpbmcgYmxvY2spLiAqL1xuICAgIHB1YmxpYyBvblN0cmVhbUVuZCgpIHtcbiAgICAgICAgdGhpcy5jbG9zZVJlYXNvbmluZygpO1xuICAgICAgICB0aGlzLmZsdXNoVG9vbENhbGwoKTtcbiAgICB9XG59XG5cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBUEkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuLyoqIFN0cmVhbSBjb25zdW1lciB3aXJpbmcgdGhlIHJvdXRlciB0byB0aGUgU1NFIHN0cmVhbS4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNvbnN1bWVTdHJlYW0oc3RyZWFtOiBBc3luY0l0ZXJhYmxlPGFueT4sIHJvdXRlcjogUmVhc29uaW5nU3RyZWFtUm91dGVyKSB7XG4gICAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiBzdHJlYW0pIHtcbiAgICAgICAgY29uc3QgY2hvaWNlID0gY2h1bms/LmNob2ljZXM/LlswXTtcbiAgICAgICAgaWYgKCFjaG9pY2UpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlOyAvLyB1c2FnZS1vbmx5IGZpbmFsIGNodW5rIGV0Yy5cbiAgICAgICAgfVxuICAgICAgICByb3V0ZXIub25EZWx0YShjaG9pY2UuZGVsdGEpO1xuICAgICAgICBpZiAoY2hvaWNlLmZpbmlzaF9yZWFzb24gPT09IFwidG9vbF9jYWxsc1wiIHx8IGNob2ljZS5maW5pc2hfcmVhc29uID09PSBcInN0b3BcIikge1xuICAgICAgICAgICAgcm91dGVyLmZsdXNoVG9vbENhbGwoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByb3V0ZXIub25TdHJlYW1FbmQoKTtcbn1cblxuLyoqIFVzZXItZmFjaW5nIGVycm9yIHRyYW5zbGF0aW9uIGZvciB0aGUgTE0gU3R1ZGlvIGNoYXQgd2luZG93LiAqL1xuZnVuY3Rpb24gdGhyb3dSZWFkYWJsZShlcnI6IHVua25vd24pOiBuZXZlciB7XG4gICAgY29uc3QgZSA9IGVyciBhcyB7IHN0YXR1cz86IG51bWJlcjsgbWVzc2FnZT86IHN0cmluZzsgY2F1c2U/OiB1bmtub3duIH07XG4gICAgbGV0IGhpbnQgPSBcIlwiO1xuICAgIGlmIChlPy5jYXVzZSAmJiAoZS5jYXVzZSBhcyBOb2RlSlMuRXJybm9FeGNlcHRpb24pLmNvZGUgPT09IFwiRUNPTk5SRUZVU0VEXCIpIHtcbiAgICAgICAgaGludCA9XG4gICAgICAgICAgICBcIiBcdTIwMTQgY29ubmVjdGlvbiByZWZ1c2VkOiBpcyB0aGUgbGxhbWEtc2VydmVyIHJ1bm5pbmc/IFwiICtcbiAgICAgICAgICAgIFwiKGUuZy4gbGxhbWEtc2VydmVyIC1tIDxtb2RlbC5nZ3VmPiAtbmdsIDk5IC1jIDEzMTA3MiAtLXBvcnQgOTkzMSlcIjtcbiAgICB9IGVsc2UgaWYgKGU/LnN0YXR1cyA9PT0gNDAwICYmIC9yZWFzb25pbmcgZWZmb3J0L2kudGVzdChlPy5tZXNzYWdlID8/IFwiXCIpKSB7XG4gICAgICAgIGhpbnQgPSBcIiBcdTIwMTQgdGhlIFJlYXNvbmluZyBFZmZvcnQgc2VsZWN0IG9ubHkgc3VwcG9ydHMgeGhpZ2ggLyBtZWRpdW0gLyBsb3cuXCI7XG4gICAgfSBlbHNlIGlmIChlPy5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICBoaW50ID0gXCIgXHUyMDE0IHRoZSBzZXJ2ZXIgcmVxdWlyZXMgLS1hcGkta2V5OiBzZXQgaXQgdW5kZXIgR2xvYmFsIENvbmZpZyBcdTIxOTIgQVBJIEtleS5cIjtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBsbGFtYS1jb21wYXQtZW5kcG9pbnQ6ICR7ZT8ubWVzc2FnZSA/PyBTdHJpbmcoZXJyKX0ke2hpbnR9YCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZShjdGw6IEdlbmVyYXRvckNvbnRyb2xsZXIsIGhpc3Rvcnk6IENoYXQpIHtcbiAgICBjb25zdCBjb25maWcgPSBjdGwuZ2V0UGx1Z2luQ29uZmlnKGNvbmZpZ1NjaGVtYXRpY3MpO1xuICAgIGNvbnN0IGdsb2JhbENvbmZpZyA9IGN0bC5nZXRHbG9iYWxQbHVnaW5Db25maWcoZ2xvYmFsQ29uZmlnU2NoZW1hdGljcyk7XG5cbiAgICBjb25zdCBtb2RlbCA9IGNvbmZpZy5nZXQoXCJtb2RlbFwiKTtcblxuICAgIC8qIDEuIFN5c3RlbSBwcm9tcHQgKHdpdGgge3ZhcmlhYmxlfSBzdWJzdGl0dXRpb24pLiAqL1xuICAgIGxldCBwcm9jZXNzZWRTeXN0ZW1Qcm9tcHQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBjb25zdCBzeXN0ZW1Qcm9tcHRUZW1wbGF0ZSA9IGNvbmZpZy5nZXQoXCJzeXN0ZW1Qcm9tcHRcIik7XG4gICAgaWYgKHN5c3RlbVByb21wdFRlbXBsYXRlKSB7XG4gICAgICAgIHByb2Nlc3NlZFN5c3RlbVByb21wdCA9IHByb2Nlc3NTeXN0ZW1Qcm9tcHQoc3lzdGVtUHJvbXB0VGVtcGxhdGUsIG1vZGVsKTtcbiAgICAgICAgY29uc3QgdW5yZXNvbHZlZCA9IHByb2Nlc3NlZFN5c3RlbVByb21wdFxuICAgICAgICAgICAgLm1hdGNoKC9cXHtbXn1dK1xcfS9nKVxuICAgICAgICAgICAgPy5tYXAodiA9PiB2LnNsaWNlKDEsIC0xKSlcbiAgICAgICAgICAgIC5maWx0ZXIodiA9PiAhKFNZU1RFTV9QUk9NUFRfVkFSSUFCTEVTIGFzIHJlYWRvbmx5IHN0cmluZ1tdKS5pbmNsdWRlcyh2LnRvTG93ZXJDYXNlKCkpKTtcbiAgICAgICAgaWYgKHVucmVzb2x2ZWQgJiYgdW5yZXNvbHZlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtsbGFtYS1jb21wYXRdIFVua25vd24gc3lzdGVtIHByb21wdCB2YXJpYWJsZXM6ICR7dW5yZXNvbHZlZC5qb2luKFwiLCBcIil9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiAyLiBDbGllbnQsIG1lc3NhZ2VzLCB0b29scy4gKi9cbiAgICBjb25zdCBvcGVuYWkgPSBjcmVhdGVDbGllbnQoZ2xvYmFsQ29uZmlnKTtcbiAgICBjb25zdCBtZXNzYWdlcyA9IHRvT3BlbkFJTWVzc2FnZXMoaGlzdG9yeSwgcHJvY2Vzc2VkU3lzdGVtUHJvbXB0KTtcbiAgICBjb25zdCB0b29scyA9IHRvT3BlbkFJVG9vbHMoY3RsKTtcbiAgICBjb25zdCBib2R5ID0gYnVpbGRSZXF1ZXN0Qm9keShjb25maWcsIG1lc3NhZ2VzLCB0b29scyk7XG5cbiAgICBjb25zb2xlLmluZm8oXG4gICAgICAgIGBbbGxhbWEtY29tcGF0XSBQT1NUICR7Z2xvYmFsQ29uZmlnLmdldChcImJhc2VVcmxcIil9L2NoYXQvY29tcGxldGlvbnNgICtcbiAgICAgICAgYCBtb2RlbD0ke2JvZHkubW9kZWx9IG1zZ3M9JHttZXNzYWdlcy5sZW5ndGh9IHRvb2xzPSR7dG9vbHM/Lmxlbmd0aCA/PyAwfWAgK1xuICAgICAgICBgIHRoaW5raW5nPSR7Ym9keS5jaGF0X3RlbXBsYXRlX2t3YXJncy5lbmFibGVfdGhpbmtpbmd9YCArXG4gICAgICAgIGAgZWZmb3J0PSR7Ym9keS5yZWFzb25pbmdfZWZmb3J0ID8/IFwiKHRlbXBsYXRlIGRlZmF1bHQpXCJ9IGJ1ZGdldD0ke2JvZHkucmVhc29uaW5nX2J1ZGdldF90b2tlbnMgPz8gMH1gLFxuICAgICk7XG5cbiAgICAvKiAzLiBTdHJlYW0gKHR5cGVkIGZyYWdtZW50cyBtYWtlIHRoZSBVSSByZW5kZXIgYSByZWFsIHRoaW5raW5nIGJsb2NrKS4gKi9cbiAgICBjb25zdCBkaXNwbGF5ID0gU3RyaW5nKGNvbmZpZy5nZXQoXCJyZWFzb25pbmdEaXNwbGF5XCIpID8/IFwibmF0aXZlXCIpIGFzIFJlYXNvbmluZ0Rpc3BsYXk7XG4gICAgY29uc3Qgcm91dGVyID0gbmV3IFJlYXNvbmluZ1N0cmVhbVJvdXRlcihjdGwsIGRpc3BsYXkpO1xuXG4gICAgbGV0IHN0cmVhbTogQXN5bmNJdGVyYWJsZTxhbnk+O1xuICAgIHRyeSB7XG4gICAgICAgIHN0cmVhbSA9IGF3YWl0IG9wZW5haS5jaGF0LmNvbXBsZXRpb25zLmNyZWF0ZShib2R5IGFzIGFueSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRocm93UmVhZGFibGUoZXJyKTtcbiAgICB9XG5cbiAgICBjdGwub25BYm9ydGVkKCgpID0+IHtcbiAgICAgICAgY29uc29sZS5pbmZvKFwiW2xsYW1hLWNvbXBhdF0gR2VuZXJhdGlvbiBhYm9ydGVkIGJ5IHVzZXIuXCIpO1xuICAgICAgICAoc3RyZWFtIGFzIHVua25vd24gYXMgeyBjb250cm9sbGVyOiBBYm9ydENvbnRyb2xsZXIgfSkuY29udHJvbGxlci5hYm9ydCgpO1xuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgY29uc3VtZVN0cmVhbShzdHJlYW0sIHJvdXRlcik7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmIChhYm9ydGVkKHN0cmVhbSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhcIltsbGFtYS1jb21wYXRdIFN0cmVhbSBlbmRlZCBieSBhYm9ydC5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3dSZWFkYWJsZShlcnIpO1xuICAgIH1cbiAgICBjb25zb2xlLmluZm8oXCJbbGxhbWEtY29tcGF0XSBHZW5lcmF0aW9uIGNvbXBsZXRlZC5cIik7XG59XG5cbmZ1bmN0aW9uIGFib3J0ZWQoc3RyZWFtOiB1bmtub3duKTogYm9vbGVhbiB7XG4gICAgY29uc3QgY29udHJvbGxlciA9IChzdHJlYW0gYXMgdW5rbm93biBhcyB7IGNvbnRyb2xsZXI/OiBBYm9ydENvbnRyb2xsZXIgfSk/LmNvbnRyb2xsZXI7XG4gICAgcmV0dXJuIGNvbnRyb2xsZXI/LnNpZ25hbD8uYWJvcnRlZCA9PT0gdHJ1ZTtcbn0iLCAiaW1wb3J0IHsgdHlwZSBQbHVnaW5Db250ZXh0IH0gZnJvbSBcIkBsbXN0dWRpby9zZGtcIjtcbmltcG9ydCB7IGNvbmZpZ1NjaGVtYXRpY3MsIGdsb2JhbENvbmZpZ1NjaGVtYXRpY3MgfSBmcm9tIFwiLi9jb25maWdcIjtcbmltcG9ydCB7IGdlbmVyYXRlIH0gZnJvbSBcIi4vZ2VuZXJhdG9yXCI7XG5cbi8qKlxuICogbGxhbWEtY29tcGF0LWVuZHBvaW50IFx1MjAxNCBPcGVuQUktY29tcGF0aWJsZSBnZW5lcmF0b3IgcGx1Z2luIGZvciBsbGFtYS5jcHAgc2VydmVycy5cbiAqXG4gKiBUYXJnZXRzIGEgbG9jYWwgbGxhbWEuY3BwIHNlcnZlciAoZS5nLiB0ZXJuYXJ5LWJvbnNhaS0yN2ItZ2YzIG9uIDo5OTMxKTpcbiAqICAtIGZ1bGwgbGxhbWEuY3BwIHBhcmFtZXRlciBzdXJmYWNlIChuYXRpdmUgcGFzcy10aHJvdWdoIHBhcmFtcyBpbmNsdWRlZCksXG4gKiAgLSB0ZW1wbGF0ZS1kcml2ZW4gdGhpbmtpbmcgY29udHJvbCAoZW5hYmxlX3RoaW5raW5nIC8gcmVhc29uaW5nX2VmZm9ydCAvXG4gKiAgICByZWFzb25pbmdfYnVkZ2V0X3Rva2VucyAvIHByZXNlcnZlX3RoaW5raW5nIGFzIEpTT04tYm9vbGVhbiBrd2FyZ3MpLFxuICogIC0gcmVhc29uaW5nIHJvdXRlZCB0byB0aGUgTE0gU3R1ZGlvIFVJIHZpYSB0eXBlZCBmcmFnbWVudHMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKGNvbnRleHQ6IFBsdWdpbkNvbnRleHQpIHtcbiAgY29udGV4dC53aXRoQ29uZmlnU2NoZW1hdGljcyhjb25maWdTY2hlbWF0aWNzKTtcbiAgY29udGV4dC53aXRoR2xvYmFsQ29uZmlnU2NoZW1hdGljcyhnbG9iYWxDb25maWdTY2hlbWF0aWNzKTtcbiAgY29udGV4dC53aXRoR2VuZXJhdG9yKGdlbmVyYXRlKTtcbn0iLCAiaW1wb3J0IHsgTE1TdHVkaW9DbGllbnQsIHR5cGUgUGx1Z2luQ29udGV4dCB9IGZyb20gXCJAbG1zdHVkaW8vc2RrXCI7XG5cbmRlY2xhcmUgdmFyIHByb2Nlc3M6IGFueTtcblxuLy8gV2UgcmVjZWl2ZSBydW50aW1lIGluZm9ybWF0aW9uIGluIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG5jb25zdCBjbGllbnRJZGVudGlmaWVyID0gcHJvY2Vzcy5lbnYuTE1TX1BMVUdJTl9DTElFTlRfSURFTlRJRklFUjtcbmNvbnN0IGNsaWVudFBhc3NrZXkgPSBwcm9jZXNzLmVudi5MTVNfUExVR0lOX0NMSUVOVF9QQVNTS0VZO1xuY29uc3QgYmFzZVVybCA9IHByb2Nlc3MuZW52LkxNU19QTFVHSU5fQkFTRV9VUkw7XG5cbmNvbnN0IGNsaWVudCA9IG5ldyBMTVN0dWRpb0NsaWVudCh7XG4gIGNsaWVudElkZW50aWZpZXIsXG4gIGNsaWVudFBhc3NrZXksXG4gIGJhc2VVcmwsXG59KTtcblxuKGdsb2JhbFRoaXMgYXMgYW55KS5fX0xNU19QTFVHSU5fQ09OVEVYVCA9IHRydWU7XG5cbmxldCBwcmVkaWN0aW9uTG9vcEhhbmRsZXJTZXQgPSBmYWxzZTtcbmxldCBwcm9tcHRQcmVwcm9jZXNzb3JTZXQgPSBmYWxzZTtcbmxldCBjb25maWdTY2hlbWF0aWNzU2V0ID0gZmFsc2U7XG5sZXQgZ2xvYmFsQ29uZmlnU2NoZW1hdGljc1NldCA9IGZhbHNlO1xubGV0IHRvb2xzUHJvdmlkZXJTZXQgPSBmYWxzZTtcbmxldCBnZW5lcmF0b3JTZXQgPSBmYWxzZTtcblxuY29uc3Qgc2VsZlJlZ2lzdHJhdGlvbkhvc3QgPSBjbGllbnQucGx1Z2lucy5nZXRTZWxmUmVnaXN0cmF0aW9uSG9zdCgpO1xuXG5jb25zdCBwbHVnaW5Db250ZXh0OiBQbHVnaW5Db250ZXh0ID0ge1xuICB3aXRoUHJlZGljdGlvbkxvb3BIYW5kbGVyOiAoZ2VuZXJhdGUpID0+IHtcbiAgICBpZiAocHJlZGljdGlvbkxvb3BIYW5kbGVyU2V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQcmVkaWN0aW9uTG9vcEhhbmRsZXIgYWxyZWFkeSByZWdpc3RlcmVkXCIpO1xuICAgIH1cbiAgICBpZiAodG9vbHNQcm92aWRlclNldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUHJlZGljdGlvbkxvb3BIYW5kbGVyIGNhbm5vdCBiZSB1c2VkIHdpdGggYSB0b29scyBwcm92aWRlclwiKTtcbiAgICB9XG5cbiAgICBwcmVkaWN0aW9uTG9vcEhhbmRsZXJTZXQgPSB0cnVlO1xuICAgIHNlbGZSZWdpc3RyYXRpb25Ib3N0LnNldFByZWRpY3Rpb25Mb29wSGFuZGxlcihnZW5lcmF0ZSk7XG4gICAgcmV0dXJuIHBsdWdpbkNvbnRleHQ7XG4gIH0sXG4gIHdpdGhQcm9tcHRQcmVwcm9jZXNzb3I6IChwcmVwcm9jZXNzKSA9PiB7XG4gICAgaWYgKHByb21wdFByZXByb2Nlc3NvclNldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUHJvbXB0UHJlcHJvY2Vzc29yIGFscmVhZHkgcmVnaXN0ZXJlZFwiKTtcbiAgICB9XG4gICAgcHJvbXB0UHJlcHJvY2Vzc29yU2V0ID0gdHJ1ZTtcbiAgICBzZWxmUmVnaXN0cmF0aW9uSG9zdC5zZXRQcm9tcHRQcmVwcm9jZXNzb3IocHJlcHJvY2Vzcyk7XG4gICAgcmV0dXJuIHBsdWdpbkNvbnRleHQ7XG4gIH0sXG4gIHdpdGhDb25maWdTY2hlbWF0aWNzOiAoY29uZmlnU2NoZW1hdGljcykgPT4ge1xuICAgIGlmIChjb25maWdTY2hlbWF0aWNzU2V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb25maWcgc2NoZW1hdGljcyBhbHJlYWR5IHJlZ2lzdGVyZWRcIik7XG4gICAgfVxuICAgIGNvbmZpZ1NjaGVtYXRpY3NTZXQgPSB0cnVlO1xuICAgIHNlbGZSZWdpc3RyYXRpb25Ib3N0LnNldENvbmZpZ1NjaGVtYXRpY3MoY29uZmlnU2NoZW1hdGljcyk7XG4gICAgcmV0dXJuIHBsdWdpbkNvbnRleHQ7XG4gIH0sXG4gIHdpdGhHbG9iYWxDb25maWdTY2hlbWF0aWNzOiAoZ2xvYmFsQ29uZmlnU2NoZW1hdGljcykgPT4ge1xuICAgIGlmIChnbG9iYWxDb25maWdTY2hlbWF0aWNzU2V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHbG9iYWwgY29uZmlnIHNjaGVtYXRpY3MgYWxyZWFkeSByZWdpc3RlcmVkXCIpO1xuICAgIH1cbiAgICBnbG9iYWxDb25maWdTY2hlbWF0aWNzU2V0ID0gdHJ1ZTtcbiAgICBzZWxmUmVnaXN0cmF0aW9uSG9zdC5zZXRHbG9iYWxDb25maWdTY2hlbWF0aWNzKGdsb2JhbENvbmZpZ1NjaGVtYXRpY3MpO1xuICAgIHJldHVybiBwbHVnaW5Db250ZXh0O1xuICB9LFxuICB3aXRoVG9vbHNQcm92aWRlcjogKHRvb2xzUHJvdmlkZXIpID0+IHtcbiAgICBpZiAodG9vbHNQcm92aWRlclNldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVG9vbHMgcHJvdmlkZXIgYWxyZWFkeSByZWdpc3RlcmVkXCIpO1xuICAgIH1cbiAgICBpZiAocHJlZGljdGlvbkxvb3BIYW5kbGVyU2V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUb29scyBwcm92aWRlciBjYW5ub3QgYmUgdXNlZCB3aXRoIGEgcHJlZGljdGlvbkxvb3BIYW5kbGVyXCIpO1xuICAgIH1cblxuICAgIHRvb2xzUHJvdmlkZXJTZXQgPSB0cnVlO1xuICAgIHNlbGZSZWdpc3RyYXRpb25Ib3N0LnNldFRvb2xzUHJvdmlkZXIodG9vbHNQcm92aWRlcik7XG4gICAgcmV0dXJuIHBsdWdpbkNvbnRleHQ7XG4gIH0sXG4gIHdpdGhHZW5lcmF0b3I6IChnZW5lcmF0b3IpID0+IHtcbiAgICBpZiAoZ2VuZXJhdG9yU2V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgYWxyZWFkeSByZWdpc3RlcmVkXCIpO1xuICAgIH1cblxuICAgIGdlbmVyYXRvclNldCA9IHRydWU7XG4gICAgc2VsZlJlZ2lzdHJhdGlvbkhvc3Quc2V0R2VuZXJhdG9yKGdlbmVyYXRvcik7XG4gICAgcmV0dXJuIHBsdWdpbkNvbnRleHQ7XG4gIH0sXG59O1xuXG5pbXBvcnQoXCIuLy4uL3NyYy9pbmRleC50c1wiKS50aGVuKGFzeW5jIG1vZHVsZSA9PiB7XG4gIHJldHVybiBhd2FpdCBtb2R1bGUubWFpbihwbHVnaW5Db250ZXh0KTtcbn0pLnRoZW4oKCkgPT4ge1xuICBzZWxmUmVnaXN0cmF0aW9uSG9zdC5pbml0Q29tcGxldGVkKCk7XG59KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBleGVjdXRlIHRoZSBtYWluIGZ1bmN0aW9uIG9mIHRoZSBwbHVnaW4uXCIpO1xuICBjb25zb2xlLmVycm9yKGVycm9yKTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnQkFjYSxrQkF3UUEsd0JBK0RBO0FBclZiO0FBQUE7QUFBQTtBQUFBLGlCQUF1QztBQWNoQyxJQUFNLHVCQUFtQixtQ0FBdUIsRUFDbEQ7QUFBQSxNQUNHO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxRQUNJLGFBQWE7QUFBQSxRQUNiLFVBQ0k7QUFBQSxRQUNKLGFBQWE7QUFBQSxNQUNqQjtBQUFBLE1BQ0E7QUFBQSxJQUNKLEVBQ0M7QUFBQSxNQUNHO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxRQUNJLGFBQWE7QUFBQSxRQUNiLFVBQ0k7QUFBQSxRQUNKLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxNQUNqQjtBQUFBLE1BQ0E7QUFBQSxJQUNKLEVBQ0M7QUFBQSxNQUNHO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxRQUNJLGFBQWE7QUFBQSxRQUNiLFVBQVU7QUFBQSxRQUNWLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLE1BQU07QUFBQSxRQUNOLFFBQVEsRUFBRSxLQUFLLElBQUksS0FBSyxHQUFLLE1BQU0sS0FBSztBQUFBLE1BQzVDO0FBQUEsTUFDQTtBQUFBLElBQ0osRUFDQztBQUFBLE1BQ0c7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLFFBQ0ksYUFBYTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFFBQ1YsS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsTUFBTTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsSUFDSixFQUNDO0FBQUEsTUFDRztBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsUUFDSSxhQUFhO0FBQUEsUUFDYixVQUFVO0FBQUEsUUFDVixLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxNQUFNO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxJQUNKLEVBQ0M7QUFBQSxNQUNHO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxRQUNJLGFBQWE7QUFBQSxRQUNiLFVBQVU7QUFBQSxRQUNWLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLE1BQU07QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLElBQ0osRUFDQztBQUFBLE1BQ0c7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLFFBQ0ksYUFBYTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFFBQ1YsS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsTUFBTTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsSUFDSixFQUNDO0FBQUEsTUFDRztBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsUUFDSSxhQUFhO0FBQUEsUUFDYixVQUFVO0FBQUEsUUFDVixLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxNQUFNO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxJQUNKLEVBQ0M7QUFBQSxNQUNHO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxRQUNJLGFBQWE7QUFBQSxRQUNiLFVBQVU7QUFBQSxRQUNWLEtBQUs7QUFBQSxRQUNMLEtBQUs7QUFBQSxRQUNMLE1BQU07QUFBQSxNQUNWO0FBQUEsTUFDQTtBQUFBLElBQ0osRUFDQztBQUFBLE1BQ0c7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLFFBQ0ksYUFBYTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFFBQ1YsS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBLFFBQ0wsTUFBTTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsSUFDSixFQUNDO0FBQUEsTUFDRztBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsUUFDSSxhQUFhO0FBQUEsUUFDYixVQUFVO0FBQUEsUUFDVixLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxLQUFLO0FBQUEsUUFDTCxNQUFNO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxJQUNKLEVBQ0M7QUFBQSxNQUNHO0FBQUEsTUFD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QUFzQjtBQUN0Qix5QkFBcUIsb0JBQW9CQSxpQkFBZ0I7QUFDekQsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLDRCQUE0QixDQUFDQyw0QkFBMkI7QUFDdEQsUUFBSSwyQkFBMkI7QUFDN0IsWUFBTSxJQUFJLE1BQU0sNkNBQTZDO0FBQUEsSUFDL0Q7QUFDQSxnQ0FBNEI7QUFDNUIseUJBQXFCLDBCQUEwQkEsdUJBQXNCO0FBQ3JFLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxtQkFBbUIsQ0FBQyxrQkFBa0I7QUFDcEMsUUFBSSxrQkFBa0I7QUFDcEIsWUFBTSxJQUFJLE1BQU0sbUNBQW1DO0FBQUEsSUFDckQ7QUFDQSxRQUFJLDBCQUEwQjtBQUM1QixZQUFNLElBQUksTUFBTSw0REFBNEQ7QUFBQSxJQUM5RTtBQUVBLHVCQUFtQjtBQUNuQix5QkFBcUIsaUJBQWlCLGFBQWE7QUFDbkQsV0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLGVBQWUsQ0FBQyxjQUFjO0FBQzVCLFFBQUksY0FBYztBQUNoQixZQUFNLElBQUksTUFBTSw4QkFBOEI7QUFBQSxJQUNoRDtBQUVBLG1CQUFlO0FBQ2YseUJBQXFCLGFBQWEsU0FBUztBQUMzQyxXQUFPO0FBQUEsRUFDVDtBQUNGO0FBRUEsd0RBQTRCLEtBQUssT0FBTUMsWUFBVTtBQUMvQyxTQUFPLE1BQU1BLFFBQU8sS0FBSyxhQUFhO0FBQ3hDLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDWix1QkFBcUIsY0FBYztBQUNyQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFVBQVU7QUFDbEIsVUFBUSxNQUFNLG9EQUFvRDtBQUNsRSxVQUFRLE1BQU0sS0FBSztBQUNyQixDQUFDOyIsCiAgIm5hbWVzIjogWyJPcGVuQUkiLCAiaW1wb3J0X3NkayIsICJnZW5lcmF0ZSIsICJjb25maWdTY2hlbWF0aWNzIiwgImdsb2JhbENvbmZpZ1NjaGVtYXRpY3MiLCAibW9kdWxlIl0KfQo=

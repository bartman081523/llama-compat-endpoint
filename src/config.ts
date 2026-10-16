import { createConfigSchematics } from "@lmstudio/sdk";

/**
 * Config schematics for the llama-compat-endpoint plugin.
 *
 * Every model-level field maps 1:1 onto a llama.cpp server request parameter
 * (OpenAI-compat endpoint plus the llama.cpp pass-through properties that the
 * server copies verbatim into llama_params). Sentinel semantics:
 *  - -1 on sampler fields  = "omit from request" → llama.cpp / GGUF defaults.
 *  - 0 on thinkingBudget   = "off" → no reasoning_budget enforcement.
 *  - "" on string fields   = "omit".
 *
 * Rationale for non-standard choices lives in README.md.
 */
export const configSchematics = createConfigSchematics()
    .field(
        "model",
        "string",
        {
            displayName: "Model Name",
            subtitle:
                "Label sent as `model`. The llama.cpp server ignores it, but it keeps the request valid.",
            placeholder: "ternary-bonsai-27b-gf3",
        },
        "ternary-bonsai-27b-gf3",
    )
    .field(
        "systemPrompt",
        "string",
        {
            displayName: "System Prompt",
            subtitle:
                "Custom system prompt. Supports variables: {date}, {time}, {datetime}, {model}, {timestamp}, {year}, {month}, {day}.",
            placeholder: "You are a helpful assistant. Current date: {date}",
            isParagraph: true,
        },
        "",
    )
    .field(
        "temperature",
        "numeric",
        {
            displayName: "Temperature",
            subtitle: "-1 = omit (server/GGUF default). Otherwise maps to `temperature` directly.",
            min: -1,
            max: 2.0,
            step: 0.05,
            slider: { min: -1, max: 2.0, step: 0.05 },
        },
        -1,
    )
    .field(
        "top_p",
        "numeric",
        {
            displayName: "Top P",
            subtitle: "-1 = omit (server/GGUF default). Otherwise maps to `top_p`.",
            min: -1,
            max: 1.0,
            step: 0.01,
        },
        -1,
    )
    .field(
        "top_k",
        "numeric",
        {
            displayName: "Top K",
            subtitle: "-1 = omit. 0 = disabled. Otherwise maps to `top_k`.",
            min: -1,
            max: 200,
            int: true,
            step: 1,
        },
        -1,
    )
    .field(
        "min_p",
        "numeric",
        {
            displayName: "Min P",
            subtitle: "-1 = omit (server/GGUF default). Otherwise maps to `min_p`.",
            min: -1,
            max: 1.0,
            step: 0.001,
        },
        -1,
    )
    .field(
        "repeat_penalty",
        "numeric",
        {
            displayName: "Repeat Penalty",
            subtitle: "llama.cpp-native `repeat_penalty`. -1 = omit.",
            min: -1,
            max: 3.0,
            step: 0.01,
        },
        -1,
    )
    .field(
        "presence_penalty",
        "numeric",
        {
            displayName: "Presence Penalty",
            subtitle: "OpenAI-style; 0 = no effect. Always sent.",
            min: -2.0,
            max: 2.0,
            step: 0.05,
        },
        0,
    )
    .field(
        "frequency_penalty",
        "numeric",
        {
            displayName: "Frequency Penalty",
            subtitle: "OpenAI-style; 0 = no effect. Always sent.",
            min: -2.0,
            max: 2.0,
            step: 0.05,
        },
        0,
    )
    .field(
        "max_tokens",
        "numeric",
        {
            displayName: "Max Tokens (n_predict)",
            subtitle: "-1 = omit → server generates until EOS. Otherwise maps to `max_tokens`/`n_predict`.",
            min: -1,
            max: 131072,
            int: true,
            step: 1,
        },
        -1,
    )
    .field(
        "seed",
        "numeric",
        {
            displayName: "Seed",
            subtitle: "-1 = omit (server picks a random seed). Otherwise maps to `seed`.",
            min: -1,
            max: 2147483647,
            int: true,
            step: 1,
        },
        -1,
    )
    .field(
        "stop",
        "string",
        {
            displayName: "Stop Sequences",
            subtitle:
                "One sequence per line → `stop` array. WARNING: short single-character sequences (\"a\") abort generation almost immediately — use realistic multi-char stops.",
            placeholder: "<|im_end|>\n### ENDE",
            isParagraph: true,
        },
        "",
    )
    .field(
        "cache_prompt",
        "boolean",
        {
            displayName: "Prompt Cache Reuse",
            subtitle: "llama.cpp-native `cache_prompt`: keep the slot KV cache between turns (recommended).",
        },
        true,
    )
    .field(
        "grammar",
        "string",
        {
            displayName: "Grammar (GBNF)",
            subtitle: "Optional GBNF grammar constraining the output. Empty = unconstrained.",
            placeholder: "root ::= \"yes\" | \"no\"",
            isParagraph: true,
        },
        "",
    )
    .field(
        "enableThinking",
        "boolean",
        {
            displayName: "Enable Thinking",
            subtitle:
                "chat_template_kwargs.enable_thinking (JSON boolean). true = model opens <think>; false = empty think block, straight answer.",
        },
        true,
    )
    .field(
        "reasoningEffort",
        "select",
        {
            displayName: "Reasoning Effort",
            subtitle:
                "\"default\" = omit → template default (xhigh). WARNING: the bonsai template accepts ONLY xhigh, medium, low — any other value aborts the request.",
            options: [
                { value: "default", displayName: "Template default (xhigh)" },
                { value: "xhigh", displayName: "xhigh (explicit)" },
                { value: "medium", displayName: "medium" },
                { value: "low", displayName: "low" },
            ],
        },
        "default",
    )
    .field(
        "thinkingBudget",
        "numeric",
        {
            displayName: "Thinking Budget (Tokens)",
            subtitle:
                "0 = off. >0 → `reasoning_budget_tokens`: server rewrites the prompt with a token count and hard-stops thinking past the budget.",
            min: 0,
            max: 65536,
            int: true,
            step: 1,
        },
        0,
    )
    .field(
        "preserveThinking",
        "boolean",
        {
            displayName: "Preserve Thinking in Context",
            subtitle:
                "chat_template_kwargs.preserve_thinking (JSON boolean): re-send past assistant <think> blocks on later turns. Turn off to save context.",
        },
        true,
    )
    .field(
        "reasoningDisplay",
        "select",
        {
            displayName: "Reasoning Display",
            subtitle:
                "How reasoning reaches the LM Studio UI. Only used when thinking tokens are streamed.",
            options: [
                { value: "native", displayName: "Native (typed fragments)" },
                { value: "inline-tags", displayName: "Inline (tags)" },
                { value: "hidden", displayName: "Hidden (drop)" },
            ],
            dependencies: [{ key: "enableThinking", condition: { type: "equals", value: true } }],
        },
        "native",
    )
    .field(
        "reasoningFormat",
        "select",
        {
            displayName: "Server Reasoning Format",
            subtitle:
                "Request-level `reasoning_format`: deepseek/auto separate thinking into `reasoning_content` deltas; none keeps raw tags in content.",
            options: [
                { value: "deepseek", displayName: "deepseek (recommended)" },
                { value: "auto", displayName: "auto" },
                { value: "deepseek-legacy", displayName: "deepseek-legacy" },
                { value: "none", displayName: "none" },
            ],
        },
        "deepseek",
    )
    .field(
        "extraParams",
        "string",
        {
            displayName: "Extra Params (JSON)",
            subtitle:
                "Catch-all merged onto the request last: mirostat / mirostat_tau / mirostat_eta, dynatemp_range, dynatemp_exponent, top_n_sigma, n_predict, penalize_nl, …",
            placeholder: "{\"mirostat\": 2, \"mirostat_tau\": 5.0, \"mirostat_eta\": 0.1}",
            isParagraph: true,
        },
        "{}",
    )
    .build();

export const globalConfigSchematics = createConfigSchematics()
    .field(
        "baseUrl",
        "string",
        {
            displayName: "llama.cpp Base URL",
            subtitle: "OpenAI-compatible endpoint of the llama.cpp server (incl. /v1).",
            placeholder: "http://127.0.0.1:9931/v1",
        },
        "http://127.0.0.1:9931/v1",
    )
    .field(
        "apiKey",
        "string",
        {
            displayName: "API Key",
            subtitle:
                "Only needed when the server runs with --api-key. The openai client requires a non-empty key; \"no-key\" is used when empty.",
            isProtected: true,
            placeholder: "(server default: no auth)",
        },
        "",
    )
    .field(
        "timeoutMs",
        "numeric",
        {
            displayName: "Request Timeout (ms)",
            subtitle: "Long generations / big prefills need more than the library default (10 min).",
            min: 1000,
            max: 7200000,
            int: true,
            step: 1000,
        },
        3600000,
    )
    .field(
        "maxRetries",
        "numeric",
        {
            displayName: "Max Retries",
            subtitle: "Automatic retries of the openai client on connection errors / 5xx.",
            min: 0,
            max: 10,
            int: true,
            step: 1,
        },
        2,
    )
    .field(
        "caCertPath",
        "string",
        {
            displayName: "(Optional) CA Certificate Path",
            subtitle:
                "Absolute path to a PEM file to trust for HTTPS base URLs (self-signed local servers). Empty = system trust store.",
            placeholder: "/home/user/.lmstudio/certs-extra-ca.pem",
        },
        "",
    )
    .build();

/** Names allowed in {variable} substitution inside the system prompt. */
export const SYSTEM_PROMPT_VARIABLES = [
    "date",
    "time",
    "datetime",
    "model",
    "timestamp",
    "year",
    "month",
    "day",
] as const;
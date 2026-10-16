import { type PluginContext } from "@lmstudio/sdk";
import { configSchematics, globalConfigSchematics } from "./config";
import { generate } from "./generator";

/**
 * llama-compat-endpoint — OpenAI-compatible generator plugin for llama.cpp servers.
 *
 * Targets a local llama.cpp server (e.g. ternary-bonsai-27b-gf3 on :9931):
 *  - full llama.cpp parameter surface (native pass-through params included),
 *  - template-driven thinking control (enable_thinking / reasoning_effort /
 *    reasoning_budget_tokens / preserve_thinking as JSON-boolean kwargs),
 *  - reasoning routed to the LM Studio UI via typed fragments.
 */
export async function main(context: PluginContext) {
  context.withConfigSchematics(configSchematics);
  context.withGlobalConfigSchematics(globalConfigSchematics);
  context.withGenerator(generate);
}
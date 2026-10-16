/**
 * Unit tests for buildRequestBody / ReasoningStreamRouter / processSystemPrompt.
 * Run: esbuild bundle (cjs) → node. Writes payload snapshots for the E2E curl.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { buildRequestBody, ReasoningStreamRouter, processSystemPrompt } from "../src/generator";

/* ------------------------------ harness --------------------------------- */

const outDir = path.dirname(process.argv[1]);

let passed = 0;
const failures: string[] = [];

function check(name: string, actual: unknown, expected: unknown) {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a === e) {
        passed++;
    } else {
        failures.push(`${name}\n  expected: ${e}\n  actual:   ${a}`);
    }
}

function checkTrue(name: string, cond: boolean, detail = "") {
    if (cond) {
        passed++;
    } else {
        failures.push(`${name} ${detail}`);
    }
}

/** Config stub: every requested key comes from `values`, missing keys = schematic defaults. */
function makeConfig(values: Record<string, any> = {}) {
    const defaults: Record<string, any> = {
        model: "ternary-bonsai-27b-gf3",
        systemPrompt: "",
        temperature: -1,
        top_p: -1,
        top_k: -1,
        min_p: -1,
        repeat_penalty: -1,
        presence_penalty: 0,
        frequency_penalty: 0,
        max_tokens: -1,
        seed: -1,
        stop: "",
        cache_prompt: true,
        grammar: "",
        enableThinking: true,
        reasoningEffort: "default",
        thinkingBudget: 0,
        preserveThinking: true,
        reasoningDisplay: "native",
        reasoningFormat: "deepseek",
        extraParams: "{}",
    };
    const merged = { ...defaults, ...values };
    return { get: (key: string) => merged[key] };
}

/* --------------------------- buildRequestBody --------------------------- */

const MESSAGES: any = [
    { role: "system", content: "You are terse." },
    { role: "user", content: "Hi" },
    { role: "assistant", content: "Hello" },
    { role: "user", content: "Now" },
];

// 1. Defaults → sentinels omitted, always-on keys present.
const body1 = buildRequestBody(makeConfig() as any, MESSAGES, undefined);
check("defaults: model", body1.model, "ternary-bonsai-27b-gf3");
checkTrue("defaults: no tools key", !("tools" in body1));
check("defaults: stream", body1.stream, true);
check("defaults: messages kept", body1.messages.length, 4);
checkTrue("defaults: no temperature", !("temperature" in body1), JSON.stringify(body1));
checkTrue("defaults: no top_p", !("top_p" in body1));
checkTrue("defaults: no top_k", !("top_k" in body1));
checkTrue("defaults: no min_p", !("min_p" in body1));
checkTrue("defaults: no repeat_penalty", !("repeat_penalty" in body1));
checkTrue("defaults: no max_tokens", !("max_tokens" in body1));
checkTrue("defaults: no seed", !("seed" in body1));
checkTrue("defaults: no stop", !("stop" in body1));
checkTrue("defaults: no grammar", !("grammar" in body1));
checkTrue("defaults: no reasoning_effort", !("reasoning_effort" in body1));
checkTrue("defaults: no reasoning_budget", !("reasoning_budget_tokens" in body1));
check("defaults: presence_penalty", body1.presence_penalty, 0);
check("defaults: frequency_penalty", body1.frequency_penalty, 0);
check("defaults: cache_prompt", body1.cache_prompt, true);
check("defaults: chat_template_kwargs", body1.chat_template_kwargs, {
    enable_thinking: true,
    preserve_thinking: true,
});
checkTrue(
    "defaults: enable_thinking is JSON boolean",
    typeof body1.chat_template_kwargs.enable_thinking === "boolean",
);
check("defaults: reasoning_format", body1.reasoning_format, "deepseek");

// 2. Full sampler set + stop split + grammar + budget + extra merge.
const body2 = buildRequestBody(
    makeConfig({
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        min_p: 0.05,
        repeat_penalty: 1.1,
        max_tokens: 4096,
        seed: 42,
        stop: "### ENDE\n<|end|>\n",
        grammar: 'root ::= "x"',
        reasoningEffort: "medium",
        thinkingBudget: 1024,
        extraParams: '{"mirostat": 2, "mirostat_tau": 5.0}',
    }) as any,
    MESSAGES,
);
check("full: temperature", body2.temperature, 0.7);
check("full: top_p", body2.top_p, 0.9);
check("full: top_k", body2.top_k, 40);
check("full: min_p", body2.min_p, 0.05);
check("full: repeat_penalty", body2.repeat_penalty, 1.1);
check("full: max_tokens", body2.max_tokens, 4096);
check("full: seed", body2.seed, 42);
check("full: stop array", body2.stop, ["### ENDE", "<|end|>"]);
check("full: grammar", body2.grammar, 'root ::= "x"');
check("full: reasoning_effort", body2.reasoning_effort, "medium");
check("full: reasoning_budget_tokens", body2.reasoning_budget_tokens, 1024);
checkTrue("full: no tools key (grammar request)", !("tools" in body2));
check("full: extra merge", body2.mirostat, 2);
check("full: extra merge tau", body2.mirostat_tau, 5.0);

// 2b. tools + budget (NO grammar) → payload_tools.json for E2E.
const body2b = buildRequestBody(
    makeConfig({
        max_tokens: 4096,
        stop: "### ENDE\n<|end|>",
        reasoningEffort: "medium",
        thinkingBudget: 1024,
    }) as any,
    MESSAGES,
    [{ type: "function", function: { name: "f", description: "d", parameters: {} } }] as any,
);
check("tools+budget: tools kept", body2b.tools.length, 1);
check("tools+budget: budget", body2b.reasoning_budget_tokens, 1024);
checkTrue("tools+budget: no grammar", !("grammar" in body2b));
fs.writeFileSync(path.join(outDir, "payload_tools.json"), JSON.stringify(body2b, null, 2));

// 3. thinking off (JSON boolean false) + preserve off.
const body3 = buildRequestBody(
    makeConfig({ enableThinking: false, preserveThinking: false }) as any,
    MESSAGES,
);
check("thinking off: kwargs", body3.chat_template_kwargs, {
    enable_thinking: false,
    preserve_thinking: false,
});
checkTrue(
    "thinking off: preserve_thinking is boolean",
    typeof body3.chat_template_kwargs.preserve_thinking === "boolean",
);

// 4. extraParams overrides an absent config field (merge-last).
const body4 = buildRequestBody(makeConfig({ seed: -1, extraParams: '{"seed": 123}' }) as any, MESSAGES);
check("extra override: seed", body4.seed, 123);

// 5. extraParams invalid JSON → readable throw.
let threw = "";
try {
    buildRequestBody(makeConfig({ extraParams: "{not json" }) as any, MESSAGES);
} catch (err: any) {
    threw = String(err.message);
}
checkTrue("extra invalid: throws", threw.includes("Extra Params (JSON)"), threw);

// 5b. grammar + tools → readable error (llama.cpp rejects the combo with 400).
let grammarErr = "";
try {
    buildRequestBody(
        makeConfig({ grammar: 'root ::= "x"' }) as any,
        MESSAGES,
        [{ type: "function", function: { name: "f", description: "d", parameters: {} } }] as any,
    );
} catch (err: any) {
    grammarErr = String(err.message);
}
checkTrue(
    "grammar+tools: readable throw",
    grammarErr.includes("cannot be combined with tools"),
    grammarErr,
);

// 6. reasoningEffort invalid value (e.g. "high") / "default" → NOT on the wire.
const body6 = buildRequestBody(makeConfig({ reasoningEffort: "high" } as any), MESSAGES);
checkTrue("effort guard: 'high' not sent", !("reasoning_effort" in body6));
const body6b = buildRequestBody(makeConfig({ reasoningEffort: "default" } as any), MESSAGES);
checkTrue("effort guard: 'default' not sent", !("reasoning_effort" in body6b));

// 7. tools: [] → key removed.
const body7 = buildRequestBody(makeConfig() as any, MESSAGES, [] as any);
checkTrue("empty tools: no key", !("tools" in body7));

/* --------------------------- ReasoningStreamRouter ---------------------- */

function makeCtlRecorder() {
    const events: any[] = [];
    return {
        events,
        fragmentGenerated: (content: string, opts?: any) => events.push({ t: "frag", content, ...(opts ?? {}) }),
        toolCallGenerationStarted: (...args: any[]) => events.push({ t: "tc_start", args }),
        toolCallGenerationNameReceived: (name: string) => events.push({ t: "tc_name", name }),
        toolCallGenerationArgumentFragmentGenerated: (c: string) => events.push({ t: "tc_arg", c }),
        toolCallGenerationEnded: (req: any) => events.push({ t: "tc_end", name: req.name, args: req.arguments }),
    };
}

const flow: any[] = [
    { reasoning_content: "Let" },
    { reasoning_content: " me think" },
    { content: "The" },
    { content: " answer" },
    {},
];

// 8. native mode: typed fragments with markers.
const ctl8 = makeCtlRecorder();
const router8 = new ReasoningStreamRouter(ctl8 as any, "native");
for (const d of flow) {
    router8.onDelta(d);
}
router8.onStreamEnd();
check("native fragment flow", ctl8.events, [
    { t: "frag", content: "", reasoningType: "reasoningStartTag", tokenCount: 0 },
    { t: "frag", content: "Let", reasoningType: "reasoning" },
    { t: "frag", content: " me think", reasoningType: "reasoning" },
    { t: "frag", content: "", reasoningType: "reasoningEndTag", tokenCount: 0 },
    { t: "frag", content: "The" },
    { t: "frag", content: " answer" },
]);

// 9. inline-tags mode: literal wrappers, no reasoningType.
const ctl9 = makeCtlRecorder();
const router9 = new ReasoningStreamRouter(ctl9 as any, "inline-tags");
for (const d of flow) {
    router9.onDelta(d);
}
router9.onStreamEnd();
check(
    "inline fragment flow",
    ctl9.events.map(e => e.content),
    ["<think>\n", "Let", " me think", "\n</think>\n", "The", " answer"],
);

// 10. hidden mode: reasoning dropped, content kept.
const ctl10 = makeCtlRecorder();
const router10 = new ReasoningStreamRouter(ctl10 as any, "hidden");
for (const d of flow) {
    router10.onDelta(d);
}
router10.onStreamEnd();
check(
    "hidden fragment flow",
    ctl10.events.map(e => e.content),
    ["The", " answer"],
);

// 11. reasoning-only stream (budget/length stop): EndTag close at stream end.
const ctl11 = makeCtlRecorder();
const router11 = new ReasoningStreamRouter(ctl11 as any, "native");
router11.onDelta({ reasoning_content: "unfinished" });
router11.onStreamEnd();
check("reasoning-only native", ctl11.events, [
    { t: "frag", content: "", reasoningType: "reasoningStartTag", tokenCount: 0 },
    { t: "frag", content: "unfinished", reasoningType: "reasoning" },
    { t: "frag", content: "", reasoningType: "reasoningEndTag", tokenCount: 0 },
]);

// 12. tool call: started → name → args → ended; reasoning closed first.
const ctl12 = makeCtlRecorder();
const router12 = new ReasoningStreamRouter(ctl12 as any, "native");
router12.onDelta({ reasoning_content: "plan" });
router12.onDelta({ tool_calls: [{ index: 0, id: "call_x", function: { name: "f", arguments: "{\"a\":" } }] });
router12.onDelta({ tool_calls: [{ index: 0, function: { arguments: "1}" } }] });
router12.onStreamEnd();
checkTrue("tool: started event", ctl12.events.some(e => e.t === "tc_start"));
checkTrue("tool: name event", ctl12.events.some(e => e.t === "tc_name" && e.name === "f"));
const argCount = ctl12.events.filter(e => e.t === "tc_arg").length;
check("tool: arg fragments", argCount, 2);
const endEv = ctl12.events.find(e => e.t === "tc_end");
check("tool: ended args", endEv?.args, { a: 1 });
// reasoning must be closed before the tool call starts
const closeIdx = ctl12.events.findIndex(e => e.reasoningType === "reasoningEndTag");
const startIdx = ctl12.events.findIndex(e => e.t === "tc_start");
checkTrue("tool: EndTag before tc_start", closeIdx !== -1 && closeIdx < startIdx);

// 13. malformed tool args → {} instead of crash.
const ctl13 = makeCtlRecorder();
const router13 = new ReasoningStreamRouter(ctl13 as any, "native");
router13.onDelta({ tool_calls: [{ index: 0, id: "call_y", function: { name: "g", arguments: "{oops" } }] });
router13.flushToolCall();
check("tool: malformed args → {}", ctl13.events.find(e => e.t === "tc_end")?.args, {});

// 14. Two sequential tool calls: second id flushes first.
const ctl14 = makeCtlRecorder();
const router14 = new ReasoningStreamRouter(ctl14 as any, "native");
router14.onDelta({ tool_calls: [{ index: 0, id: "call_a", function: { name: "f", arguments: "{\"x\":1}" } }] });
router14.onDelta({ tool_calls: [{ index: 1, id: "call_b", function: { name: "g", arguments: "{\"y\":2}" } }] });
router14.onStreamEnd();
check("tool: two ended", ctl14.events.filter(e => e.t === "tc_end").length, 2);

/* --------------------------- processSystemPrompt ------------------------ */

// 15. variable substitution.
const sys15 = processSystemPrompt("Help on {model}. Year {year}. Bad {unknown}.", "bonsai-test");
checkTrue("sys: model substituted", sys15.includes("Help on bonsai-test."), sys15);
checkTrue("sys: year substituted", /Year 20\d\d\./.test(sys15), sys15);
checkTrue("sys: unknown var kept", sys15.includes("{unknown}"), sys15);
check("sys: empty prompt stays empty", processSystemPrompt("", "m"), "");

/* ------------------------------ report ---------------------------------- */

// Snapshot for the E2E curl (exact body the generator would send).
const e2eBody = body2; // full-parameter body
fs.writeFileSync(path.join(outDir, "payload_default.json"), JSON.stringify(body1, null, 2));
fs.writeFileSync(path.join(outDir, "payload_full.json"), JSON.stringify(body2, null, 2));

const summary = { passed, failed: failures.length, failures };
fs.writeFileSync(path.join(outDir, "test_report.json"), JSON.stringify(summary, null, 2));
console.log(`PASSED=${passed} FAILED=${failures.length}`);
if (failures.length > 0) {
    console.log(failures.join("\n---\n"));
    process.exit(1);
}
# llama-compat-endpoint (LM Studio plugin)

OpenAI-kompatibles Generator-Plugin für **llama.cpp-Server** — gebaut für
`ternary-bonsai-27b-gf3` auf `http://127.0.0.1:9931/v1` (PTQ1_0/GF3-GGUF,
131k-Kontext), funktioniert mit jedem llama.cpp `llama-server`.

Vorgänger: gdmkas `openai-compat-endpoint`-Fork (Systemprompt-Variablen und
Grundgerüst stammen daher); die OpenAI/Anthropic-Reasoning-Logik wurde durch
die llama.cpp-native Reasoning-Steuerung ersetzt.

## Reasoning (Thinking) — Semantik

Das Bonsai-GGUF bringt ein Qwen3.5-Template mit `</think>`-Denkblöcken mit.

| Plugin-Feld | Wire-Format | Wirkung |
|---|---|---|
| Enable Thinking | `chat_template_kwargs.enable_thinking` (JSON boolean!) | `false` → leerer Think-Block, direkte Antwort |
| Reasoning Effort | `reasoning_effort` | nur `xhigh` (Template-Default), `medium`, `low` — **kein** `high`/`none`, sonst bricht das Template ab |
| Thinking Budget | `reasoning_budget_tokens` | >0 → Server erzwingt Denk-Token-Budget (Sampling-Layer) |
| Preserve Thinking | `chat_template_kwargs.preserve_thinking` (JSON boolean!) | `false` → `</think>`-Blöcke älterer Assistent-Turns landen nicht im Prompt (spart Kontext) |
| Server Reasoning Format | `reasoning_format` | `deepseek` (Default): Server trennt `</think>`-Inhalt in `delta.reasoning_content` |
| Reasoning Display | – | `native` = typisierte Fragmente (klappbarer Denk-Block im UI) · `inline-tags` = Tags im Text · `hidden` = Reasoning verwerfen, Antwort bleibt |

**Wichtig:** `enable_thinking`/`preserve_thinking` werden als **JSON-Booleans**
geschickt — der Server `dump()`et die kwarg-Werte und das Template vergleicht
gegen `"true"`/`"false"`; der String `"false"` wäre in Jinja truthy.

## Rest-Parameter

- Sampler mit Sentinel `-1` = **weglassen** → llama.cpp/GGUF-Defaults
  (temperature, top_p, top_k, min_p, repeat_penalty, seed, max_tokens).
- `presence_penalty`/`frequency_penalty` werden immer geschickt (0 = aus).
- `stop` = eine Stop-Sequenz pro Zeile → OpenAI-`stop`-Array.
- `cache_prompt` (Default an) → Slot-KV-Cache bleibt über Turns erhalten.
- `grammar` → GBNF-Grammatik. **Achtung:** llama.cpp lehnt Grammar gemeinsam
  mit Tools ab (HTTP 400) — das Plugin wirft in dem Fall einen lesbaren
  Config-Fehler, bevor der Request rausgeht. Für Grammatik-Nutzung empfiehlt
  sich außerdem **Enable Thinking = off**: serverseitig beginnt die Generierung
  mit dem Think-Block, ein forciertes Erst-Token landet dann im Reasoning-Kanal
  (E2E-erprobt: mit Thinking off kommt `Ja` exakt im Content an).
- `extraParams` (JSON) → **zuletzt gemergt**: alles weitere
  (`mirostat`, `mirostat_tau`, `mirostat_eta`, `dynatemp_range`,
  `dynatemp_exponent`, `top_n_sigma`, `penalize_nl`, `n_predict`, …) und
  bewusste Overrides einzelner Felder.

## Globale Einstellungen

- **llama.cpp Base URL** — Default `http://127.0.0.1:9931/v1`.
- **API Key** — nur nötig, wenn der Server mit `--api-key` läuft
  (Plugin sendet sonst `no-key`, da der openai-Client einen nicht-leeren Key will).
- **Request Timeout (ms)** — Default 3.600.000 (opencode-erprobt: lange
  Prefills brauchen mehr als die Library-Default von 10 min).
- **Max Retries**, **CA Certificate Path** (für HTTPS-Remotes).

## Server starten

```bash
./llama-server \
  -m ~/models/bonsai/Ternary-Bonsai-2-27B-PTQ1_0-recon.gguf \
  -ngl 99 -c 131072 -np 1 -ctk q8_0 -ctv q8_0 \
  --port 9931 --host 127.0.0.1 --threads 6
```

## Bekannte Grenzen

- LM Studio speichert Reasoning getrennt vom Assistant-Text; das SDK bietet
  keinen Zugriff auf Reasoning alter Turns, d. h. `preserve_thinking: true`
  wirkt pro Turn nur auf Reasoning, das **über die Plugin-Konversation** läuft
  — dem Server wird das Denken vergangener Turns also nicht erneut
  zugespielt. Für
  Thinking-Durchlässe über mehrere Turns: `reasoning_format: none` +
  `inline-tags`, wenn das Modell das Denken im Inhalt sehen soll.
- Tool-Calls laufen über den OpenAI-Tool-Call-Weg des Servers
  (`finish_reason: tool_calls`) — abhängig von Template-Unterstützung.

## Build / Install

Schritt-für-Schritt-Anleitung siehe [INSTALL.md](./INSTALL.md). Kurzfassung:

```bash
git clone https://github.com/bartman081523/llama-compat-endpoint.git
cd llama-compat-endpoint
npm ci
DEST=~/.lmstudio/extensions/plugins/local/llama-compat-endpoint
mkdir -p "$DEST" && rsync -a --exclude .git ./ "$DEST/"
echo "{\"by\":\"node-plugin-installer-v1\",\"at\":$(date +%s%3N)}" > "$DEST/install-state.json"
```

→ LM Studio **neu starten** (Discovery beim Boot). Das Bundle
(`.lmstudio/production.js`) ist committet — nur bei `src/*.ts`-Änderungen neu bauen:

```bash
npx -y esbuild@0.25.10 .lmstudio/entry.ts --bundle --platform=node --format=cjs \
  --external:@lmstudio/sdk --external:openai --target=node20 \
  --sourcemap=inline --outfile=.lmstudio/production.js
```

Unit-Tests (Payload-Synthese + Reasoning-Router): `scratches/test_payload.ts` —
esbuild-bundlen und mit `node` ausführen, Ergebnis landet in `scratches/test_report.json`.

Unit-Tests (Payload-Synthese + Reasoning-Router): `scratches/test_payload.ts` —
esbuild-bundlen und mit `node` ausführen, Ergebnis landet in `scratches/test_report.json`.
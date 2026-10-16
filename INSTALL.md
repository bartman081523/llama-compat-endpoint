# INSTALL — llama-compat-endpoint in LM Studio

Plugin installieren, llama.cpp-Server starten, loslegen.

## 0. Ein-Kommando-Setup (Linux Mint / Ubuntu)

Das Skript [`setup-linux-mint.sh`](./setup-linux-mint.sh) macht Alles-auf-einmal:
apt-Abhängigkeiten, CUDA-Sondierung, llama.cpp-**PTQ1_0-Mod-Build**
(Standard-llama.cpp liest den Quant-Typ PTQ1_0/143 nicht!), Plugin-Installation
und optional systemd-User-Unit für den Server:

```bash
bash setup-linux-mint.sh                  # Standard: CUDA-Auto, kein Modell-Download
bash setup-linux-mint.sh --with-model     # zusätzlich GGUF (≈6,7 GB) von Hugging Face laden
bash setup-linux-mint.sh --model-file /pfad/Ternary-Bonsai-2-27B-PTQ1_0.gguf   # bestehendes GGUF
```

Weitere Flags: `--cpu-only`, `--install-cuda` (CUDA-Toolkit aus NVIDIA-Repo,
ggf. nötig wenn `nvcc` fehlt), `--cuda-arch N` (Arch-Override — sonst wird die
Compute-Capability der GPU erkannt, z. B. 3060 Ti → sm_86), `--no-service`,
`--port`, `--threads`, `--skip-llama`, `--skip-plugin`. Das Skript ist idempotent — erneutes Ausführen
aktualisiert nur. Der Server läuft danach als User-Unit:

```bash
systemctl --user status bonsai-llama
```

## Voraussetzungen

- **LM Studio** 0.4.x (getestet mit 0.4.26-4 AppImage)
- **Node.js ≥ 20 + npm** (für `npm ci`; das fertige Bundle `.lmstudio/production.js` ist im Repo enthalten)
- Ein laufender bzw. startbarer **llama.cpp-Server** (beliebig; gebaut für `ternary-bonsai-27b-gf3`)

## 1. Clonen & Abhängigkeiten

```bash
git clone https://github.com/bartman081523/llama-compat-endpoint.git
cd llama-compat-endpoint
npm ci
```

## 2. Bundle bauen (optional)

Das Repo enthält bereits ein gebautes Bundle (`production.js`). Der Schritt ist nur nötig,
wenn `src/*.ts` geändert wurde:

```bash
npx -y esbuild@0.25.10 .lmstudio/entry.ts --bundle --platform=node --format=cjs \
  --external:@lmstudio/sdk --external:openai --target=node20 \
  --sourcemap=inline --outfile=.lmstudio/production.js
```

## 3. In die LM-Studio-Plugin-Struktur kopieren

LM Studio lädt Plugins bei jedem Boot aus
`~/.lmstudio/extensions/plugins/<owner>/<name>/`. Owner laut manifest.json: `local`.

```bash
DEST=~/.lmstudio/extensions/plugins/local/llama-compat-endpoint
mkdir -p "$DEST"
rsync -a --exclude .git ./ "$DEST/"
echo "{\"by\":\"node-plugin-installer-v1\",\"at\":$(date +%s%3N)}" > "$DEST/install-state.json"

# Kontrolle — muss manifest.json, src/, node_modules/, .lmstudio/{entry.ts, production.js} zeigen:
ls "$DEST"
```

## 4. LM Studio starten

Den Plugin-Discovery-Scan macht LM Studio beim Boot. Danach erscheint das Plugin im
Chat unter den möglichen Endpunkten (aktivierte Plugins/Generator).

**Plugin-Modus:** Manuell abgelegte Plugins (Owner `local`) tauchen nur auf, wenn
LM Studio Development-Plugins erlaubt — die Keys `developerMode` und
`developer.allowDevelopmentPlugins` in `~/.lmstudio/settings.json`.
`setup-linux-mint.sh` setzt beide automatisch (nur wenn LM Studio geschlossen ist —
die App überschreibt die Datei beim Beenden). Läuft die App noch, in der GUI:
**Settings → Developer → "Developer Mode" + "Allow Development Plugins" an.**

## 5. llama.cpp-Server starten

```bash
./llama-server \
  -m ~/models/bonsai/Ternary-Bonsai-2-27B-PTQ1_0-recon.gguf \
  -ngl 99 -c 131072 -np 1 -ctk q8_0 -ctv q8_0 \
  --port 9931 --host 127.0.0.1 --threads 6
```

(Modellname/Pfad anpassen. Der Server MUSS mit dem Model laufen, das im Plugin als
`model` eingetragen ist — der Server ignoriert das Label, aber `/v1/chat/completions`
antwortet nur, wenn ein Modell geladen ist.)

## 6. Im Chat konfigurieren

- **Chat-Tab** → Plugin `llama-compat-endpoint` aktivieren/als Generator wählen.
- **Global Config**: Base URL (`http://127.0.0.1:9931/v1`) ist vorbefüllt.
- **Model Config** (siehe README für alle Felder): `model` = beliebiges Label
  (Default `ternary-bonsai-27b-gf3`), Reasoning-Steuerung über Enable Thinking /
  Reasoning Effort / Thinking Budget / Reasoning Display.

## Fehlersuche

| Symptom | Ursache/Lösung |
|---|---|
| Plugin erscheint nicht | Install-Pfad (`owner/name` = `local/llama-compat-endpoint`), `install-state.json` vorhanden, LM Studio NEU gestartet |
| „connection refused" | llama-server läuft nicht – Start-Kommando oben, Port/Host prüfen |
| HTTP 400 `reasoning effort` | Wert muss xhigh/medium/low sein (Template-Validierung) |
| HTTP 400 `grammar` + tools | GBNF-Feld leeren oder Tools deaktivieren (beides zusammen verweigert llama.cpp) |
| Generierung bricht sofort ab | Stop-Sequenz mit Einzelzeichen — realistische Multi-Char-Stops verwenden |
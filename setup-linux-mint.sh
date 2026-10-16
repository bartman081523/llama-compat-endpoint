#!/usr/bin/env bash
# ============================================================================
# setup-linux-mint.sh — Bonsai-Stack für LM Studio auf Linux Mint (Ubuntu-Basis)
#
# Download + Installation von:
#   1. llama.cpp mit PTQ1_0/GF3-Mod-Branch (bartman081523/llama.cpp, pr-ptq1_0-local)
#      — nötig, weil Standard-llama.cpp den GGUF-Quant-Typ PTQ1_0 (143) nicht kennt
#   2. LM-Studio-Plugin llama-compat-endpoint (npm ci + Discovery-Ordner)
#   Optional (Opt-in --with-model): Ternary-Bonsai-2-27B-PTQ1_0.gguf (≈6,7 GB, public HF)
#
# Voraussetzungen: LM Studio (.deb) bereits installiert; für CUDA-Build:
#   NVIDIA-Treiber (nvidia-smi) + nvcc >= 12 (CUDA-Toolkit).
#
# Aufruf:
#   bash setup-linux-mint.sh                  CUDA-Auto (wenn möglich), kein Modell-Download
#   bash setup-linux-mint.sh --cpu-only       CPU-Build (funktioniert, aber langsam)
#   bash setup-linux-mint.sh --with-model     zusätzlich GGUF von HF laden (resume-fähig)
#   bash setup-linux-mint.sh --model-file P   bestehendes GGUF verwenden (kein Download)
#   bash setup-linux-mint.sh --install-cuda   CUDA-Toolkit aus NVIDIA-Repo einrichten
#   bash setup-linux-mint.sh --no-service     systemd-User-Unit anlegen, aber nicht starten
#   bash setup-linux-mint.sh --cuda-arch 86   CUDA-Architektur override (Default: vom GPU-Treiber erkannt)
#   bash setup-linux-mint.sh --quit-lmstudio  laufendes LM Studio schließen, damit Plugin-Modus-Keys gesetzt werden können
#
# Idempotent: wiederholtes Ausführen aktualisiert/passt nur an.
# ============================================================================
set -euo pipefail

GH_LLAMA_CPP="https://github.com/bartman081523/llama.cpp"
GH_BRANCH="pr-ptq1_0-local"
GH_PLUGIN="https://github.com/bartman081523/llama-compat-endpoint"
HF_MODEL_URL="https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-gguf/resolve/main/Ternary-Bonsai-2-27B-PTQ1_0.gguf"

LLAMA_SRC="${HOME}/src/llama.cpp-bonsai"
PLUGIN_SRC="${HOME}/src/llama-compat-endpoint"
MODEL_DIR="${HOME}/models/bonsai"
MODEL_NAME="Ternary-Bonsai-2-27B-PTQ1_0.gguf"
LLM_EXTENSIONS="${HOME}/.lmstudio/extensions/plugins/local/llama-compat-endpoint"
SERVICE_NAME="bonsai-llama"

PORT=9931
NGL=99
CTX=131072
THREADS="$(nproc 2>/dev/null || echo 6)"

CPU_ONLY=0; WITH_MODEL=0; INSTALL_CUDA=0; NO_SERVICE=0; QUIT_LMS=0
MODEL_FILE_ARG=""; SKIP_PLUGIN=0; SKIP_LLAMA=0; CUDA_ARCH_ARG=""

log()  { printf '\033[1;34m[setup]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[setup]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31m[setup]\033[0m %s\n' "$*" >&2; exit 1; }
ask()  { local a=""; read -rp "[setup] $* [J/n] " a || return 1; [[ ! "$a" =~ ^[nN] ]]; }

# ----------------------------------------------------------------- Argumente
while [[ $# -gt 0 ]]; do
    case "$1" in
        --cpu-only) CPU_ONLY=1 ;;
        --with-model) WITH_MODEL=1 ;;
        --model-file) MODEL_FILE_ARG="${2:?}"; shift ;;
        --install-cuda) INSTALL_CUDA=1 ;;
        --no-service) NO_SERVICE=1 ;;
        --quit-lmstudio) QUIT_LMS=1 ;;
        --cuda-arch) CUDA_ARCH_ARG="${2:?}"; shift ;;
        --skip-plugin) SKIP_PLUGIN=1 ;;
        --skip-llama) SKIP_LLAMA=1 ;;
        --port) PORT="${2:?}"; shift ;;
        --threads) THREADS="${2:?}"; shift ;;
        -h|--help) awk 'NR<=2 {next} /^# ====/ {exit} {sub(/^# ?/,""); print}' "$0"; exit 0 ;;
        *) die "Unbekannte Option: $1 (siehe --help)" ;;
    esac
    shift
done

[[ -f /etc/os-release ]] && . /etc/os-release || true
case "${ID_LIKE:-}${ID:-}" in
    *debian*|*ubuntu*|*mint*) : ;;
    *) warn "Kein Debian/Ubuntu-basiertes System erkannt (${ID:-unbekannt}) — apt-Schritte werden übersprungen." ;;
esac
SUDO=""
[[ "$(id -u)" -eq 0 ]] || SUDO="sudo"

# --------------------------------------------------------------- Stufe 1: apt
apt_install() {
    # nur, wenn apt existiert und Paket nicht schon installiert ist
    if ! command -v apt-get >/dev/null 2>&1; then return 0; fi
    if dpkg -s "$1" >/dev/null 2>&1; then return 0; fi
    log "apt installiere: $1"
    $SUDO apt-get update -qq || true
    $SUDO apt-get install -y -qq "$1"
}

command -v git    >/dev/null || apt_install git
command -v curl   >/dev/null || apt_install curl
command -v cmake  >/dev/null || apt_install cmake
command -v rsync  >/dev/null || apt_install rsync
dpkg -s build-essential >/dev/null 2>&1 || apt_install build-essential

# ------------------------------------------------------- Stufe 2: Node.js ≥ 20
ensure_node() {
    if command -v node >/dev/null 2>&1; then
        local major; major="$(node -v | sed 's/^v\([0-9]*\).*/\1/')"
        if [[ "$major" -ge 20 ]]; then log "Node.js vorhanden ($(node -v))"; return 0; fi
        warn "Node.js $(node -v) ist zu alt (< 20) — installiere NodeSource 22.x"
    else
        log "Node.js fehlt — installiere NodeSource 22.x"
    fi
    command -v apt-get >/dev/null || die "Node fehlt und kein apt gefunden — Node ≥ 20 manuell installieren."
    $SUDO rm -f /etc/apt/sources.list.d/nodesource.list 2>/dev/null || true
    curl -fsSL https://deb.nodesource.com/setup_22.x | $SUDO bash -
    $SUDO apt-get install -y -qq nodejs
    log "Node.js installiert: $(node -v), npm: $(npm -v)"
}
[[ $SKIP_PLUGIN -eq 1 ]] || ensure_node

# ----------------------------------------------------- Stufe 3: CUDA-Sondierung
nvcc_major() {
    # Release-Zeile der nvcc: "Cuda compilation tools, release 13.3, ..." → 13
    "$1" -V 2>/dev/null | sed -n 's/.*release \([0-9]*\)\..*/\1/p' | head -1
}

CUDA_BUILD=0; NVCC_BIN=""; GPU_CC=""
if [[ $CPU_ONLY -eq 1 ]]; then
    log "CPU-Build erzwungen (--cpu-only)"
else
    if command -v nvidia-smi >/dev/null 2>&1; then
        log "NVIDIA-Treiber aktiv: $(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null | head -1)"
        # Compute Capability der GPU (z. B. 8.6 → 86) für die CUDA-Architektur-Wahl
        GPU_CC="$(nvidia-smi --query-gpu=compute_cap --format=csv,noheader 2>/dev/null | head -1 | tr -d ' .')"
        NVCC_BIN="$(command -v nvcc || true)"
        if [[ -z "$NVCC_BIN" ]]; then
            for d in /usr/local/cuda*/bin; do [[ -x "$d/nvcc" ]] && NVCC_BIN="$d/nvcc" && break; done
        fi
        if [[ -n "$NVCC_BIN" ]]; then
            local_major="$(nvcc_major "$NVCC_BIN" || echo 0)"
            if [[ "$local_major" -ge 12 ]]; then
                log "nvcc vorhanden: $($NVCC_BIN -V 2>/dev/null | tail -1)"
                CUDA_BUILD=1
            else
                warn "nvcc aber Version ${local_major:-?} < 12 — zu alt für llama.cpp (CUDA-Toolkit installieren: $0 --install-cuda)"
            fi
        fi
        if [[ $CUDA_BUILD -eq 0 && $INSTALL_CUDA -eq 1 ]]; then
            log "Installiere CUDA-Toolkit aus dem NVIDIA-Repo"
            local_codename="${UBUNTU_CODENAME:-${VERSION_CODENAME:-noble}}"
            case "$local_codename" in
                noble)  repo="ubuntu2404" ;;
                jammy)  repo="ubuntu2204" ;;
                focal)  repo="ubuntu2004" ;;
                *)      repo="ubuntu2404"; warn "Unbekannter Codename ${local_codename} — nehme ${repo}" ;;
            esac
            log "Codename ${local_codename} → NVIDIA-Repo ${repo}"
            curl -fsSL -o /tmp/cuda-keyring.deb \
                "https://developer.download.nvidia.com/compute/cuda/repos/${repo}/x86_64/cuda-keyring_1.1-1_all.deb" \
                || die "CUDA-Keyring-Download fehlgeschlagen — CUDA-Toolkit bitte manuell installieren (nvcc >= 12)."
            $SUDO dpkg -i /tmp/cuda-keyring.deb && $SUDO apt-get update -qq
            $SUDO apt-get install -y -qq cuda-toolkit-12-6   # ~4 GB Download; alternativ neuere Toolkit-Version
            export PATH="/usr/local/cuda/bin:$PATH"
            NVCC_BIN="/usr/local/cuda/bin/nvcc"   # Pfad merken für cmake (s. u.)
            CUDA_BUILD=1
        fi
        if [[ $CUDA_BUILD -eq 0 ]]; then
            warn "NVIDIA-GPU vorhanden, aber kein nvcc >= 12 (CUDA-Toolkit)."
            warn "→ Optionen: $0 --install-cuda   ODER   $0 --cpu-only (ohne GPU-Beschleunigung)"
            die "Abbruch: CUDA-Entscheidung unklar."
        fi
    else
        warn "Kein NVIDIA-Treiber (nvidia-smi fehlt) → CPU-Build. GPU-Build später: Treiber + CUDA installieren, Skript erneut laufen lassen."
        warn "Hinweis: CPU-Generierung bei 27B ist langsam (< 1 tok/s) — nur für Funktionstests sinnvoll."
        CPU_ONLY=1
    fi
fi

# -------------------------------------------------- Stufe 4: llama.cpp (Mod)
build_llama() {
    mkdir -p "$(dirname "$LLAMA_SRC")"
    if [[ -d "$LLAMA_SRC/.git" ]]; then
        log "llama.cpp-Mod-Bestand vorhanden — aktualisiere (branch $GH_BRANCH)"
        git -C "$LLAMA_SRC" fetch origin "$GH_BRANCH" --quiet
        git -C "$LLAMA_SRC" checkout "$GH_BRANCH" --quiet 2>/dev/null || true
        git -C "$LLAMA_SRC" reset --hard --quiet "origin/$GH_BRANCH"
    else
        log "Klone llama.cpp-Mod (${GH_BRANCH}) → ${LLAMA_SRC}"
        git clone --depth 1 --branch "$GH_BRANCH" "$GH_LLAMA_CPP" "$LLAMA_SRC"
    fi
    log "llama.cpp HEAD: $(git -C "$LLAMA_SRC" log --oneline -1)"

    local build_flags=( -B "$LLAMA_SRC/build" -DCMAKE_BUILD_TYPE=Release
                        -DLLAMA_BUILD_TESTS=OFF
                        -DLLAMA_BUILD_SERVER=ON -DBUILD_SHARED_LIBS=ON
                        -DLLAMA_CURL=OFF )
    if [[ $CUDA_BUILD -eq 1 ]]; then
        # GPU-Offload (GGML_CUDA=ON): erprobt mit nvcc 12.6/13.x + CUDAHOSTCXX=g++-13/14
        local gxx=""
        for gxx in g++-14 g++-13 g++-12; do command -v "$gxx" >/dev/null 2>&1 && break; gxx=""; done
        if [[ -z "$gxx" ]]; then
            apt_install g++-13
            gxx="g++-13"
        fi
        command -v "$gxx" >/dev/null 2>&1 || die "CUDAHOSTCXX-Kandidat $gxx nicht gefunden."
        # CUDA-Architektur: Override > GPU-Erkennung (compute_cap, z. B. 3060 Ti → 86) > CMake-"native"
        local cuda_arch="${CUDA_ARCH_ARG}"
        if [[ -z "$cuda_arch" && -n "$GPU_CC" ]]; then cuda_arch="$GPU_CC"; fi
        if [[ -n "$cuda_arch" ]]; then
            log "CUDA-Build: -DGGML_CUDA=ON, Arch sm_${cuda_arch}, CUDAHOSTCXX=${gxx}"
            build_flags+=( -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES="$cuda_arch" )
        else
            log "CUDA-Build: -DGGML_CUDA=ON, Arch=native (CMake-Erkennung), CUDAHOSTCXX=${gxx}"
            build_flags+=( -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES=native )
        fi
        export CUDAHOSTCXX="$gxx"
        # nvcc dem Build bekannt geben — NVIDIA-Repo-Toolkit (/usr/local/cuda/bin)
        # liegt NICHT auf PATH; cmake findet es allein sonst nicht
        [[ -n "$NVCC_BIN" ]] || NVCC_BIN="/usr/local/cuda/bin/nvcc"
        [[ -x "$NVCC_BIN" ]] || die "CUDA-Build verlangt nvcc, aber '$NVCC_BIN' ist nicht ausführbar."
        export PATH="$(dirname "$NVCC_BIN"):$PATH"
        export CUDACXX="$NVCC_BIN"
        build_flags+=( -DCMAKE_CUDA_COMPILER="$NVCC_BIN" )
    else
        build_flags+=( -DGGML_CUDA=OFF )
    fi
    mkdir -p "$LLAMA_SRC/build"   # Redirect-Ziel existiert VOR cmake-Anlauf
    log "cmake konfigurieren (Log: $LLAMA_SRC/build/configure.log) ..."
    cmake "${build_flags[@]}" "$LLAMA_SRC" > "$LLAMA_SRC/build/configure.log" 2>&1 \
        || die "cmake configure fehlgeschlagen — Log: $LLAMA_SRC/build/configure.log"
    log "Bauen mit $(nproc) Jobs (dauert einige Minuten) ..."
    cmake --build "$LLAMA_SRC/build" --config Release -j"$(nproc)" --target llama-server \
        > "$LLAMA_SRC/build/build.log" 2>&1 \
        || die "Build fehlgeschlagen — Log: $LLAMA_SRC/build/build.log"
    [[ -x "$LLAMA_SRC/build/bin/llama-server" ]] || die "llama-server nicht erzeugt."
    log "llama-server gebaut: $("$LLAMA_SRC/build/bin/llama-server" --version | head -1)"
}
[[ $SKIP_LLAMA -eq 1 ]] || build_llama

# ------------------------------------------------------- Modell (GGUF, optional)
download_model() {
    mkdir -p "$MODEL_DIR"
    local target="${MODEL_DIR}/${MODEL_NAME}"
    if [[ -n "$MODEL_FILE_ARG" ]]; then
        [[ -f "$MODEL_FILE_ARG" ]] || die "--model-file: Datei nicht gefunden: $MODEL_FILE_ARG"
        MODEL_PATH="$MODEL_FILE_ARG"
        log "Bestehendes Modell: $MODEL_PATH ($(( $(stat -c%s "$MODEL_PATH") / 1024 / 1024 )) MB)"
        return 0
    fi
    if [[ -f "$target" ]]; then
        MODEL_PATH="$target"; log "Modell vorhanden: $target"; return 0
    fi
    if [[ $WITH_MODEL -ne 1 ]]; then
        warn "Kein Modell unter ${target} und kein --with-model/--model-file angegeben."
        warn "→ GGUF besorgen: $0 --with-model (lädt ${HF_MODEL_URL}) oder --model-file P"
        return 0
    fi
    log "Download GGUF (≈6,7 GB, resume-fähig) → ${target}"
    if command -v aria2c >/dev/null 2>&1; then
        aria2c -x8 -s8 -c -d "$MODEL_DIR" -o "$MODEL_NAME" "$HF_MODEL_URL"
    else
        curl -L -C - --progress-bar -o "$target" "$HF_MODEL_URL"
    fi
    [[ -s "$target" ]] || die "Modell-Download fehlgeschlagen."
    MODEL_PATH="$target"
}

# ------------------------------------------------------------ Stufe 5: Plugin
install_plugin() {
    if [[ -d "$PLUGIN_SRC/.git" ]]; then
        log "Plugin-Source vorhanden — aktualisiere"
        git -C "$PLUGIN_SRC" fetch origin --quiet
        git -C "$PLUGIN_SRC" checkout main --quiet 2>/dev/null || true
        git -C "$PLUGIN_SRC" reset --hard --quiet origin/main
    else
        log "Klone Plugin → ${PLUGIN_SRC}"
        git clone "$GH_PLUGIN" "$PLUGIN_SRC"
    fi
    log "npm ci (node_modules)"
    (cd "$PLUGIN_SRC" && npm ci --no-fund --no-audit --progress=false >/dev/null) \
        || die "npm ci fehlgeschlagen (Node ≥ 20 nötig)."
    mkdir -p "$LLM_EXTENSIONS"
    log "Installiere nach $LLM_EXTENSIONS"
    rsync -a --delete --exclude .git "$PLUGIN_SRC/" "$LLM_EXTENSIONS/"
    # LM-Studio-Installationsmarker (epoch ms), wie vom node-plugin-installer-v1
    printf '{"by":"node-plugin-installer-v1","at":%s}\n' \
        "$(date +%s%3N)" > "$LLM_EXTENSIONS/install-state.json"
    node --check "$LLM_EXTENSIONS/.lmstudio/production.js" \
        && log "Bundle-Check ok (production.js)"
    log "Plugin installiert — Discovery beim nächsten LM-Studio-Boot."
}

# ------------------------------------------- Plugin-Modus in LM-Studio-Settings
# Manuell abgelegte Plugins (owner "local") tauchen nur unter "Integrations"
# auf, wenn LM Studio Development-Plugins erlaubt: developerMode = true +
# developer.allowDevelopmentPlugins = true (Settings → Developer).
# LM Studio offen? Wird geschlossen (Rückfrage / --quit-lmstudio), DANN geschrieben —
# die App überschreibt settings.json sonst beim Beenden mit ihrem In-Memory-Stand.
enable_plugin_mode() {
    local cfg="$HOME/.lmstudio/settings.json"
    if [[ ! -f "$cfg" ]]; then
        warn "$cfg nicht gefunden (LM Studio noch nie gestartet?)."
        warn "→ Nach dem ersten LM-Studio-Start: Settings → Developer → 'Developer Mode' + 'Allow Development Plugins' on"
        return 0
    fi
    if pgrep -f "[l]m-studio" >/dev/null 2>&1; then
        # [l]-Muster: pgrep matcht den eigenen Warteloop nicht mit
        if [[ "${QUIT_LMS:-0}" -ne 1 ]]; then
            if [[ ! -t 0 ]]; then
                warn "LM Studio läuft — ohne --quit-lmstudio und ohne TTY: kein Auto-Quit."
                warn "→ In der GUI: Settings → Developer → 'Developer Mode' + 'Allow Development Plugins' an"
                return 0
            fi
            ask "LM Studio läuft — schließen und Plugin-Modus setzen?" \
                || { warn "Übersprungen — manuell in der GUI: Settings → Developer → 'Developer Mode' + 'Allow Development Plugins' an"; return 0; }
            log "Schließe LM Studio (SIGTERM) ..."
        else
            log "Schließe LM Studio (--quit-lmstudio, SIGTERM) ..."
        fi
        pkill -TERM -f "[l]m-studio" 2>/dev/null || true
        # Begrenzt warten, bis die App weg ist (self-terminierend, max. 15 s)
        timeout 15 bash -c 'while pgrep -f "[l]m-studio" >/dev/null 2>&1; do sleep 0.5; done' || true
        if pgrep -f "[l]m-studio" >/dev/null 2>&1; then
            warn "LM Studio wurde nach 15 s nicht beendet — Keys nicht gesetzt."
            warn "→ LM Studio schließen und Skript erneut laufen lassen — oder GUI: Settings → Developer"
            return 0
        fi
        log "LM Studio beendet — setze Keys."
    fi
    local out
    out="$(python3 - "$cfg" <<'PYCFG'
import json, sys
p = sys.argv[1]
with open(p) as f:
    cfg = json.load(f)
dev = cfg.setdefault("developer", {})
changed = []
if not dev.get("allowDevelopmentPlugins"):
    dev["allowDevelopmentPlugins"] = True
    changed.append("developer.allowDevelopmentPlugins")
if not cfg.get("developerMode"):
    cfg["developerMode"] = True
    changed.append("developerMode")
if changed:
    with open(p, "w") as f:
        json.dump(cfg, f, indent=2)
print("SET " + (" ".join(changed) if changed else "none"))
PYCFG
)" || { warn "settings.json konnte nicht geparst/geschrieben werden — Plugin-Modus manuell in der GUI aktivieren (Settings → Developer)."; return 0; }
    log "Plugin-Modus aktiv (developerMode + allowDevelopmentPlugins) — Integrations beim Boot (SET: ${out#SET })."
}

[[ $SKIP_PLUGIN -eq 1 ]] || install_plugin
[[ $SKIP_PLUGIN -eq 1 ]] || enable_plugin_mode
download_model

# ---------------- VRAM-Ladder: volle Konfiguration zuerst, abwärts bis Start
# Probiert llama-server-Konfigurationen von voller VRAM-Belegung abwärts, bis
# eine tatsächlich startet (/health antwortet) — die Gewinner-Config landet in
# der systemd-Unit. Kontext-Reduktion ist hier explizit gewünscht (User) und
# kein stiller Cap im Lauf: die volle Referenz wird zuerst versucht.
PROBE_TIMEOUT=150
VRAM_LADDER=(
    "99 131072 q8_0 q8_0"      # volle Konfiguration (Referenz, dev-Box-proven)
    "99  65536 q8_0 q8_0"      # halber Kontext
    "99  24576 q8_0 q8_0"      # chat-tauglicher Kontext
    "99   8192 q8_0 q8_0"
    "99   8192 q4_0 q4_0 -fa"  # KV quantisiert; -fa ist Voraussetzung für KV-Quantisierung
    "40   8192 q8_0 q8_0"      # Teils-Offload (Gewichte auf CPU, langsames Dekodieren)
    "20   8192 q8_0 q8_0"      # noch mehr Last auf die CPU
)

# try_config NGL CTX CTK CTV [EXTRA-FLAGS...] — startet llama-server probe-weise
# und wartet begrenzt auf /health. Tod des Prozesses beendet den Wartelauf sofort
# (Zombie-Erkennung, weil der bg-Child erst nach dem wait verschwindet).
try_config() {
    local ngl="$1" ctx="$2" ctk="$3" ctv="$4"; shift 4
    local extra=("$@") pid rc why
    log "VRAM-Probe: -ngl $ngl -c $ctx -ctk $ctk -ctv $ctv${extra[*]:+ ${extra[*]}}"
    "$LLAMA_SRC/build/bin/llama-server" -m "$MODEL_PATH" \
        -ngl "$ngl" -c "$ctx" -np 1 -ctk "$ctk" -ctv "$ctv" \
        ${extra[@]+"${extra[@]}"} \
        --port "$PORT" --host 127.0.0.1 --threads "$THREADS" \
        > "$LLAMA_SRC/build/probe.log" 2>&1 &
    pid=$!
    rc=0
    timeout "$PROBE_TIMEOUT" bash -c "
        until curl -sf 'http://127.0.0.1:${PORT}/health' >/dev/null 2>&1; do
            if ! kill -0 ${pid} 2>/dev/null; then exit 3; fi
            ps -o stat= -p ${pid} 2>/dev/null | grep -q '^Z' && exit 3
            sleep 2
        done" || rc=$?
    if [[ "${rc:-124}" -eq 0 ]]; then
        kill "$pid" 2>/dev/null || true; wait "$pid" 2>/dev/null || true
        WIN_NGL="$ngl"; WIN_CTX="$ctx"; WIN_CTK="$ctk"; WIN_CTV="$ctv"; WIN_EXTRA="${extra[*]:-}"
        log "  → läuft — Config übernommen."
        return 0
    fi
    kill "$pid" 2>/dev/null || true; wait "$pid" 2>/dev/null || true
    why="$(grep -m1 -iE 'out of memory|error|failed' "$LLAMA_SRC/build/probe.log" 2>/dev/null | cut -c1-160 || true)"
    warn "  → startet nicht (${rc:-124})${why:+: $why}"
    return 1
}

# --------------------------------------------------- Stufe 6: systemd user-Unit
make_unit() {
    if [[ $NO_SERVICE -eq 1 ]]; then
        warn "Kein systemd-Unit (--no-service) — Start von Hand:"
        warn "  $LLAMA_SRC/build/bin/llama-server -m </pfad/gguf> -ngl $NGL -c $CTX -np 1 -ctk q8_0 -ctv q8_0 --port $PORT --host 127.0.0.1 --threads $THREADS"
        return 0
    fi
    if [[ ! -x "$LLAMA_SRC/build/bin/llama-server" ]]; then
        warn "llama-server nicht gefunden — kein Unit (erst bauen: --skip-llama weglassen)."
        return 0
    fi
    if [[ -z "${MODEL_PATH:-}" ]]; then
        warn "Kein Modell (--with-model/--model-file) — kein Unit, Start von Hand wie oben."
        return 0
    fi
    mkdir -p "$LLAMA_SRC/build"
    # Rerun-Fall: alten Unit-Server stoppen, sonst kollidiert die Probe mit dem Port
    systemctl --user stop "${SERVICE_NAME}" 2>/dev/null || true
    if curl -sf "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
        die "Port ${PORT} bereits belegt (fremder llama-server?) — erst beenden, dann erneut laufen lassen."
    fi
    # Referenz-Defaults; die Ladder überschreibt sie mit der ersten laufenden Config
    WIN_NGL="$NGL"; WIN_CTX="$CTX"; WIN_CTK="q8_0"; WIN_CTV="q8_0"; WIN_EXTRA=""
    if [[ $CUDA_BUILD -eq 1 && $CPU_ONLY -eq 0 ]]; then
        log "VRAM-Ladder: ${#VRAM_LADDER[@]} Konfigurationen, je max. ${PROBE_TIMEOUT}s (volle zuerst)."
        local found=0 rung
        for rung in "${VRAM_LADDER[@]}"; do
            # Rung-String wird bewusst in Argumente gesplittert:
            # shellcheck disable=SC2086
            if try_config $rung; then found=1; break; fi
        done
        [[ $found -eq 1 ]] || die "Keine VRAM-Konfiguration gestartet — letzte Diagnose: $LLAMA_SRC/build/probe.log"
    else
        log "CPU-Build — keine VRAM-Ladder, Unit mit Referenz-Flags."
    fi
    log "Gewinner-Config: -ngl ${WIN_NGL} -c ${WIN_CTX} -ctk ${WIN_CTK} -ctv ${WIN_CTV}${WIN_EXTRA:+ ${WIN_EXTRA}}"
    mkdir -p "$HOME/.config/systemd/user"
    cat > "$HOME/.config/systemd/user/${SERVICE_NAME}.service" <<UNIT
[Unit]
Description=Bonsai llama.cpp server (PTQ1_0) fuer LM Studio llama-compat-endpoint
[Service]
ExecStart=${LLAMA_SRC}/build/bin/llama-server -m ${MODEL_PATH} -ngl ${WIN_NGL} -c ${WIN_CTX} -np 1 -ctk ${WIN_CTK} -ctv ${WIN_CTV} ${WIN_EXTRA} --port ${PORT} --host 127.0.0.1 --threads ${THREADS}
Restart=on-failure
RestartSec=5
[Install]
WantedBy=default.target
UNIT
    systemctl --user daemon-reload
    systemctl --user enable --now "$SERVICE_NAME" 2>/dev/null \
        && log "Systemd-User-Unit aktiviert" \
        || warn "Unit angelegt, Start fehlgeschlagen (nach Login: systemctl --user start $SERVICE_NAME)"
    if timeout 5 curl -sf "http://127.0.0.1:${PORT}/health" >/dev/null 2>&1; then
        log "Server antwortet auf Port ${PORT}"
    else
        warn "Server auf Port ${PORT} (noch) nicht bereit — Modell-Load dauert ~1 min: systemctl --user status $SERVICE_NAME"
    fi
}
make_unit

# -------------------------------------------------------------------- Summary
log "────────────────────────────────────────────────────────"
log "FERTIG. Nächste Schritte:"
log "  1. LM Studio (neu) starten → Plugin-Discovery beim Boot"
log "  2. Chat-Tab: Generator 'llama-compat-endpoint'; Base URL http://127.0.0.1:${PORT}/v1"
log "  3. Reasoning: Enable Thinking an + Effort xhigh/medium/low"
log "  4. Server: systemctl --user start|stop|status ${SERVICE_NAME}"
log "────────────────────────────────────────────────────────"
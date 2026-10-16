#!/usr/bin/env bash
# E2E-Test der VRAM-Ladder in setup-linux-mint.sh in Sandbox-HOME (dev-Box):
# fake llama-server (scheitert bis Rung N, dann healthy+killbar), fake curl
# (Health nur wenn State-File existiert), fake systemctl (loggt nur).
# --skip-plugin/--skip-llama: keine Netzzugriffe; CUDA-Sondierung läuft echt
# (nvidia-smi/nvcc vorhanden → CUDA_BUILD=1 → Ladder-Ast).
set -euo pipefail

HERE="/run/media/julian/ML4/lmstudio/llama-compat-endpoint/scratches/vram-ladder-test"
SCRIPT="/run/media/julian/ML4/lmstudio/llama-compat-endpoint/setup-linux-mint.sh"
SHIM="$HERE/shim"

FAILS=0
ok()  { printf '  OK   %s\n' "$1"; }
bad() { printf '  FAIL %s\n' "$1"; FAILS=$((FAILS+1)); }
need() { if eval "$2"; then ok "$1"; else bad "$1"; fi; }

ROOT="$(mktemp -d "$HERE/sb.XXXXXX")"
trap 'rm -rf "$ROOT"' EXIT

# run_case NAME FAIL_RUNGS → macht Sandbox, führt Skript aus, gibt "<base> <rc>" aus
run_case() {
    local name="$1" fails="$2" base rc=0
    base="$ROOT/$name"
    mkdir -p "$base/home/src/llama.cpp-bonsai/build/bin" "$base/home/.lmstudio"
    cp "$SHIM/llama-server" "$base/home/src/llama.cpp-bonsai/build/bin/llama-server"
    chmod +x "$base/home/src/llama.cpp-bonsai/build/bin/llama-server"
    head -c 4096 /dev/zero > "$base/home/fake.gguf"
    printf '{}' > "$base/home/.lmstudio/settings.json"
    rm -f "$base/rungs" "$base/health"
    HOME="$base/home" PATH="$SHIM:$PATH" \
        FAKE_FAIL_RUNGS="$fails" FAKE_LADDER_STATE="$base/rungs" \
        FAKE_HEALTH_STATE="$base/health" FAKE_SYSTEMCTL_LOG="$base/sysctl.log" \
        bash "$SCRIPT" --skip-plugin --skip-llama --model-file "$base/home/fake.gguf" \
        > "$base/out.log" 2>&1 || rc=$?
    printf '%s %d\n' "$base" "$rc"
}

UNIT="home/.config/systemd/user/bonsai-llama.service"

echo "──────── Case A: 4 Rungs scheitern, Rung 5 (q4_0 -fa) gewinnt ────────"
A_OUT="$(run_case A 4)"; A_BASE="${A_OUT% *}"; A_RC="${A_OUT##* }"
echo "  Skript-RC: $A_RC — Sandbox: $A_BASE"
need "A: Skript RC=0"                      "[[ $A_RC -eq 0 ]]"
need "A: 5 Rungs aufgerufen (4 Fail + Win)" '[[ "$(cat "$A_BASE/rungs")" == "5" ]]'
need "A: Unit-File geschrieben"             "[[ -f '$A_BASE/$UNIT' ]]"
need "A: Unit enthält Gewinner-KV q4_0"     "grep -q 'q4_0' '$A_BASE/$UNIT'"
need "A: Unit enthält -fa (aus Rung 5)"     "grep -q ' -fa ' '$A_BASE/$UNIT'"
need "A: Unit enthält -ngl 99"              "grep -q -- '-ngl 99' '$A_BASE/$UNIT'"
need "A: Unit enthält -c 8192"              "grep -q -- '-c 8192' '$A_BASE/$UNIT'"
need "A: Gewinner-Logzeile kam"             "grep -q 'Gewinner-Config' '$A_BASE/out.log'"
need "A: Fake-Server lief (Health-State)"   "[[ -f '$A_BASE/health' ]]"
need "A: systemctl enable --now geloggt"    "grep -q 'enable --now' '$A_BASE/sysctl.log'"

echo "──────── Case B: alle Rungs scheitern → die(), kein Unit ─────────────"
B_OUT="$(run_case B 99)"; B_BASE="${B_OUT% *}"; B_RC="${B_OUT##* }"
echo "  Skript-RC: $B_RC — Sandbox: $B_BASE"
need "B: Skript RC≠0 (die)"                    "[[ $B_RC -ne 0 ]]"
need "B: 7 Rungs alle probiert"                '[[ "$(cat "$B_BASE/rungs")" == "7" ]]'
need "B: die-Meldung 'Keine VRAM-Konfiguration'" "grep -q 'Keine VRAM-Konfiguration' '$B_BASE/out.log'"
need "B: kein Unit-File"                       "[[ ! -f '$B_BASE/$UNIT' ]]"

echo "────────────────"
if [[ $FAILS -eq 0 ]]; then printf 'ALLE CASES GRÜN\n'; else printf '%s CASE(S) ROT\n' "$FAILS"; exit 1; fi
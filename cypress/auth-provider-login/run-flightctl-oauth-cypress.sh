#!/usr/bin/env bash
# Start `flightctl login --web --no-browser`, capture the printed OAuth authorize URL, run Cypress
# to complete the browser login (same kubeadmin / password flow as the console tests), then wait
# for flightctl to receive the localhost callback and finish.
#
# Requires: oc, flightctl, Node/npm (for npx cypress), same OPENSHIFT_* credentials as e2e.
# Optional: NODE_TLS_REJECT_UNAUTHORIZED=0 for lab clusters.
#
# Usage (from cypress/):
#   ./auth-provider-login/run-flightctl-oauth-cypress.sh
#   ./auth-provider-login/run-flightctl-oauth-cypress.sh 'https://flightctl-api.apps.../api' --browser chrome
#
set -euo pipefail

CYPRESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$CYPRESS_DIR"

FLIGHTCTL_BIN="${FLIGHTCTL:-flightctl}"
CALLBACK_PORT="${FLIGHTCTL_CALLBACK_PORT:-18080}"
if [[ "${1:-}" == https://* ]]; then
  API_URL="$1"
  shift
else
  API_URL="https://$(oc get route flightctl-api -n flightctl -o jsonpath='{.spec.host}')"
fi

LOG="$(mktemp)"
cleanup() { rm -f "$LOG"; }
trap cleanup EXIT

if command -v stdbuf >/dev/null 2>&1; then
  STDBUF=(stdbuf -oL -eL)
else
  STDBUF=()
fi

"${STDBUF[@]}" "$FLIGHTCTL_BIN" login "$API_URL" --web --no-browser -k --callback-port "$CALLBACK_PORT" 2>&1 | tee "$LOG" &
FLT_PID=$!

OAUTH_URL=""
for _ in $(seq 1 240); do
  if grep -qE 'oauth/authorize' "$LOG" 2>/dev/null; then
    OAUTH_URL="$(grep -oE 'https://[^[:space:]]+' "$LOG" | grep '/oauth/authorize' | head -1 || true)"
    if [[ -n "$OAUTH_URL" ]]; then
      break
    fi
  fi
  sleep 0.5
  if ! kill -0 "$FLT_PID" 2>/dev/null; then
    echo "flightctl exited before printing an OAuth URL. Output:" >&2
    cat "$LOG" >&2
    wait "$FLT_PID" || true
    exit 1
  fi
done

if [[ -z "$OAUTH_URL" ]]; then
  echo "Timed out waiting for OAuth authorize URL in flightctl output." >&2
  kill "$FLT_PID" 2>/dev/null || true
  cat "$LOG" >&2
  exit 1
fi

export CYPRESS_FLIGHTCTL_OAUTH_AUTHORIZE_URL="$OAUTH_URL"
export CYPRESS_FLIGHTCTL_CALLBACK_PORT="$CALLBACK_PORT"
# Relax chromeWebSecurity for this run only (see cypress.config.js setupNodeEvents).
export CYPRESS_AUTH_PROVIDER_DEVICE_LOGIN=true

if ! npx cypress run --spec auth-provider-login/auth-provider-login.cy.js "$@"; then
  CY_EXIT=$?
  kill "$FLT_PID" 2>/dev/null || true
  wait "$FLT_PID" 2>/dev/null || true
  exit "$CY_EXIT"
fi

wait "$FLT_PID"

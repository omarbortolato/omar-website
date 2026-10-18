#!/bin/bash
# Il giro delle spremute: ogni 15 minuti da /etc/cron.d/omar-website sulla sandbox (dal 18/10/2026; prima su Herbalife).
# Il percorso viene da dove sta lo script; Node e Chromium sono quelli per aarch64 in /opt/personale-omar.
cd "$(dirname "$0")/.." || exit 1
export PATH=/opt/personale-omar/node-v22.23.3/bin:/usr/bin:/bin
export PUPPETEER_EXECUTABLE_PATH="${PUPPETEER_EXECUTABLE_PATH:-$(ls -d /opt/personale-omar/browser/chromium-*/chrome-linux/chrome 2>/dev/null | head -n 1)}"
exec node_modules/.bin/tsx scripts/auto-genera-spremuta.ts

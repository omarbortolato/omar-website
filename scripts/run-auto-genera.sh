#!/bin/bash
cd /root/omar-website || exit 1
exec /root/omar-website/node_modules/.bin/tsx scripts/auto-genera-spremuta.ts

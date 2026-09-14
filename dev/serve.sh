#!/usr/bin/env bash
# Serve dev/ on http://localhost:8731 in the background. Idempotent.
cd "$(dirname "$0")"
if ! curl -s -o /dev/null http://localhost:8731/; then
  nohup python3 -m http.server 8731 >/dev/null 2>&1 &
  sleep 1
fi
echo "http://localhost:8731/#local-1"

#!/usr/bin/env bash
set -euo pipefail

npm install

if [ ! -f .env.local ] && [ -f .env.example ]; then
  cp .env.example .env.local
fi

#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=.github/scripts/lib.sh
source "${BASH_SOURCE[0]%/*}/lib.sh"

case "${1:?command required}" in
  deploy)
    require_commands pnpm
    pnpm --filter @wowlab/scripts deploy:cloudflare "${APP:?}" "${TARGET:?}"
    ;;
  *)
    echo "unknown web CI command: $1" >&2
    exit 2
    ;;
esac

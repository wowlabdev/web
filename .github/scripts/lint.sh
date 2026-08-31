#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=.github/scripts/lib.sh
source "${BASH_SOURCE[0]%/*}/lib.sh"

require_commands actionlint find shellcheck shfmt sort
mapfile -d '' scripts < <(find .github/scripts -type f -name '*.sh' -print0 | sort -z)
shellcheck -x "${scripts[@]}"
shfmt -d -i 2 -ci "${scripts[@]}"
actionlint

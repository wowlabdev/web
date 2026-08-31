#!/usr/bin/env bash
set -euo pipefail

# shellcheck source=.github/scripts/lib.sh
source "${BASH_SOURCE[0]%/*}/lib.sh"

case "${1:?command required}" in
  configure-caches)
    require_commands ln mkdir pnpm rm
    pnpm config set store-dir "${WOWLAB_CACHE_ROOT:?}/pnpm"

    if [[ ${NEXT_CACHE:-false} == true ]]; then
      for app in landing studio; do
        cache="$WOWLAB_CACHE_ROOT/next/${RUNNER_NAME:?}/$app"
        mkdir -p "$cache" "apps/$app/.next"
        rm -rf "apps/$app/.next/cache"
        ln -s "$cache" "apps/$app/.next/cache"
      done
    fi
    ;;
  install-ci-tools)
    require_commands curl install mkdir mktemp mv rm sha256sum tar
    tools_root="${WOWLAB_CACHE_ROOT:?}/tools"

    actionlint_dir="$tools_root/actionlint/1.7.12"
    download_archive_binary \
      'https://github.com/rhysd/actionlint/releases/download/v1.7.12/actionlint_1.7.12_linux_amd64.tar.gz' \
      '8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8' \
      actionlint \
      'c872d6db8c6bf83a8eaa704fc93999f027d55dffbc63b8a6abdccb47df5f4cd4' \
      "$actionlint_dir/actionlint"

    shellcheck_dir="$tools_root/shellcheck/0.11.0"
    download_archive_binary \
      'https://github.com/koalaman/shellcheck/releases/download/v0.11.0/shellcheck-v0.11.0.linux.x86_64.tar.gz' \
      'b7af85e41cc99489dcc21d66c6d5f3685138f06d34651e6d34b42ec6d54fe6f6' \
      'shellcheck-v0.11.0/shellcheck' \
      '4da528ddb3a4d1b7b24a59d4e16eb2f5fd960f4bd9a3708a15baddbdf1d5a55b' \
      "$shellcheck_dir/shellcheck"

    shfmt_dir="$tools_root/shfmt/3.14.0"
    download_binary \
      'https://github.com/mvdan/sh/releases/download/v3.14.0/shfmt_v3.14.0_linux_amd64' \
      'fe42021c7272ef2d67ea36cbc3031683c625d0badec733ef3a57b567246a0b66' \
      "$shfmt_dir/shfmt"

    {
      echo "$actionlint_dir"
      echo "$shellcheck_dir"
      echo "$shfmt_dir"
    } >>"${GITHUB_PATH:?}"
    ;;
  install-dependencies)
    require_commands pnpm
    if [[ -n ${INSTALL_FILTER:-} ]]; then
      read -ra filters <<<"$INSTALL_FILTER"
      args=()

      for filter in "${filters[@]}"; do
        args+=(--filter "$filter")
      done

      pnpm install "${args[@]}" --frozen-lockfile
    else
      pnpm install --frozen-lockfile
    fi
    ;;
  install-pnpm)
    require_commands corepack mkdir
    corepack_home="${WOWLAB_CACHE_ROOT:?}/corepack/${RUNNER_NAME:?}"
    mkdir -p "$corepack_home"
    export COREPACK_HOME=$corepack_home
    echo "COREPACK_HOME=$corepack_home" >>"${GITHUB_ENV:?}"
    corepack enable pnpm
    corepack install
    ;;
  *)
    echo "unknown environment command: $1" >&2
    exit 2
    ;;
esac

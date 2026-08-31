#!/usr/bin/env bash

install_hint() {
  case "$1" in
    actionlint | shellcheck | shfmt) printf '%s' 'run .github/scripts/environment.sh install-ci-tools' ;;
    corepack | node) printf '%s' 'install Node.js 24' ;;
    curl | tar) printf 'sudo apt-get install %s' "$1" ;;
    find | install | mkdir | mktemp | mv | rm | sha256sum | sort) printf '%s' 'sudo apt-get install coreutils' ;;
    pnpm) printf '%s' 'enable pnpm with Corepack' ;;
    *) printf "install the package that provides \`%s\`" "$1" ;;
  esac
}

require_commands() {
  local missing=0
  local tool

  for tool in "$@"; do
    if ! command -v "$tool" >/dev/null 2>&1; then
      printf "Missing required command \`%s\`; %s.\n" "$tool" "$(install_hint "$tool")" >&2
      missing=1
    fi
  done

  if ((missing != 0)); then
    exit 127
  fi
}

install_binary() {
  local source=$1
  local destination=$2
  local staging

  mkdir -p "${destination%/*}"
  staging="${destination}.${GITHUB_RUN_ID:-$$}.${RANDOM}"
  install -m 0755 "$source" "$staging"
  mv -f "$staging" "$destination"
  rm -f "$staging"
}

checksum_matches() {
  local file=$1
  local checksum=$2

  [[ -x $file ]] && printf '%s  %s\n' "$checksum" "$file" | sha256sum --check --status
}

download_binary() {
  local url=$1
  local checksum=$2
  local destination=$3
  local temp_dir

  checksum_matches "$destination" "$checksum" && return
  temp_dir=$(mktemp -d)
  curl -fsSL "$url" -o "$temp_dir/binary"
  printf '%s  %s\n' "$checksum" "$temp_dir/binary" | sha256sum --check --status
  install_binary "$temp_dir/binary" "$destination"
  rm -rf "$temp_dir"
}

download_archive_binary() {
  local url=$1
  local archive_checksum=$2
  local member=$3
  local binary_checksum=$4
  local destination=$5
  local temp_dir

  checksum_matches "$destination" "$binary_checksum" && return
  temp_dir=$(mktemp -d)
  curl -fsSL "$url" -o "$temp_dir/archive.tar.gz"
  printf '%s  %s\n' "$archive_checksum" "$temp_dir/archive.tar.gz" | sha256sum --check --status
  tar -xzf "$temp_dir/archive.tar.gz" --no-same-owner -C "$temp_dir" "$member"
  checksum_matches "$temp_dir/$member" "$binary_checksum"
  install_binary "$temp_dir/$member" "$destination"
  rm -rf "$temp_dir"
}

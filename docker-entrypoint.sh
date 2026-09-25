#!/bin/sh
set -e

# Runs the player as PUID:PGID (like SUB/WAVE), so files in the mounted
# cache folder belong to the NAS user. Without them the node user is used.
if [ "$(id -u)" = "0" ]; then
  USER_ID="${PUID:-1000}"
  GROUP_ID="${PGID:-1000}"

  case "$USER_ID$GROUP_ID" in
    *[!0-9]*)
      echo "PUID/PGID must be numbers, got PUID='$USER_ID' PGID='$GROUP_ID'" >&2
      exit 1
      ;;
  esac

  mkdir -p "$CACHE_DIR"
  find "$CACHE_DIR" \( ! -user "$USER_ID" -o ! -group "$GROUP_ID" \) \
    -exec chown "$USER_ID:$GROUP_ID" {} +

  exec su-exec "$USER_ID:$GROUP_ID" "$@"
fi

exec "$@"

#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/back-end"

cd "$BACKEND_DIR"
exec ./mvnw "$@"

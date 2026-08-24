#!/usr/bin/env bash
set -Eeuo pipefail
SRC="${DATA_FILE:-/var/lib/contrato/data.json}"
DEST="${BACKUP_DIR:-/var/backups/contrato}"
KEEP="${BACKUP_KEEP:-14}"
mkdir -p "$DEST"
chmod 700 "$DEST"
if [ ! -f "$SRC" ]; then
  echo "No data file at $SRC; nothing to back up."
  exit 0
fi
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TMP="$DEST/.data-$STAMP.json.tmp"
OUT="$DEST/data-$STAMP.json"
cp --preserve=mode,timestamps "$SRC" "$TMP"
python3 -m json.tool "$TMP" >/dev/null
mv "$TMP" "$OUT"
chmod 600 "$OUT"
ls -1t "$DEST"/data-*.json 2>/dev/null | tail -n +$((KEEP+1)) | xargs -r rm -f --
echo "$OUT"

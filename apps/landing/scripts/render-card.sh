#!/usr/bin/env bash
# Render social-card.svg to public/social-card.png at exactly 1200x630.
#
# Headless Chrome is the renderer because it is already on every machine that
# develops this site, and because it is the same engine the card will be viewed
# through. No image toolchain to install.
#
# Chrome will happily screenshot an SVG that failed to parse -- you get a mostly
# transparent PNG with a pink error glyph rather than an error exit. So the XML
# is validated first, and the output is checked afterwards.
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="social-card.svg"
OUT="public/social-card.png"

for candidate in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "$(command -v google-chrome || true)" \
  "$(command -v chromium || true)" \
  "$(command -v chromium-browser || true)"; do
  if [ -n "$candidate" ] && [ -x "$candidate" ]; then CHROME="$candidate"; break; fi
done
if [ -z "${CHROME:-}" ]; then
  echo "render-card: no Chrome or Chromium found" >&2
  exit 1
fi

# A double hyphen inside an XML comment is the easy way to break this file.
python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse('$SRC')" \
  || { echo "render-card: $SRC is not well-formed XML" >&2; exit 1; }

mkdir -p public
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --screenshot="$PWD/$OUT" "file://$PWD/$SRC" >/dev/null 2>&1

python3 - "$OUT" <<'PY'
import sys
from PIL import Image

im = Image.open(sys.argv[1])
if im.size != (1200, 630):
    sys.exit(f"render-card: expected 1200x630, got {im.size[0]}x{im.size[1]}")
# A parse failure renders as near-empty, so insist on real content.
colors = im.convert("RGB").getcolors(maxcolors=300000) or []
if len(colors) < 50:
    sys.exit(f"render-card: only {len(colors)} colors; the SVG likely failed to render")
print(f"render-card: {sys.argv[1]} ok ({im.size[0]}x{im.size[1]}, {len(colors)} colors)")
PY

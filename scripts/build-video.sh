#!/usr/bin/env bash
# Builds web-optimised clips + posters from brand-assets/video (Instagram reels of @kare.arte).
set -euo pipefail
SRC="$(cd "$(dirname "$0")/../../../brand-assets/video" && pwd)"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/video"
mkdir -p "$OUT"
# name|source|start|duration|audio(0/1)
CLIPS=(
  "hero-day|reel_DcTIo_summer-garden.mp4|0|10|0"
  "hero-night|reel_DfT47_a-night-in-karearte.mp4|20|12|0"
  "sour|reel_DdWE1_sour-off-menu.mp4|0|5.2|0"
  "cupffee|reel_DgKAX_cupffee-hot-chocolate.mp4|0|4.6|0"
  "reel-blind-cocktails|reel_DdByn_blind-cocktails-2.mp4|0|0|1"
  "reel-favourite-guest|reel_DcbFq_the-man-behind.mp4|0|0|1"
  "reel-summer|reel_DcTIo_summer-garden.mp4|0|0|1"
  "reel-night|reel_DfT47_a-night-in-karearte.mp4|0|0|1"
  "reel-sour|reel_DdWE1_sour-off-menu.mp4|0|0|1"
  "reel-cupffee|reel_DgKAX_cupffee-hot-chocolate.mp4|0|0|1"
)
for c in "${CLIPS[@]}"; do
  IFS='|' read -r name src ss dur audio <<< "$c"
  args=(-v error -y -ss "$ss" -i "$SRC/$src")
  [[ "$dur" != "0" ]] && args+=(-t "$dur")
  vf="scale=540:-2,fps=30"
  if [[ "$audio" == "1" ]]; then a=(-c:a aac -b:a 96k); else a=(-an); fi
  ffmpeg "${args[@]}" -vf "$vf" -c:v libx264 -profile:v high -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart "${a[@]}" "$OUT/$name.mp4"
  ffmpeg -v error -y -ss "$ss" -i "$SRC/$src" -frames:v 1 -vf "scale=540:-2" -q:v 3 "$OUT/$name.jpg"
  cwebp -quiet -q 72 "$OUT/$name.jpg" -o "$OUT/$name.webp" && rm "$OUT/$name.jpg"
  echo "$name $(du -h "$OUT/$name.mp4" | cut -f1)"
done

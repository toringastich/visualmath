#!/usr/bin/env python3
"""
Build every shipped form of the Secant Labs mark from the two generated SVGs.

Run:  python3 build-assets.py     (or `npm run brand -w apps/landing`)

Outputs, all into ../public unless noted:

  favicon.svg              the bold variant -- browsers draw SVG favicons at
                           16-32px, which is exactly where the regular one greys out
  favicon-16/32/48.png     raster fallbacks
  favicon.ico              16+32+48 in one file, for older browsers and Windows
  apple-touch-icon.png     180x180, opaque: iOS composites onto its own tile and
                           renders transparency as black
  logo-512.png             transparent, for slide decks and READMEs
  linkedin-logo-400.png    opaque, padded -- LinkedIn wants >=300x300 square

Small rasters are supersampled from 512px rather than rendered at 16px directly:
Chrome's antialiasing of a 16px viewport is visibly worse than a Lanczos
downsample of a large one.
"""
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image

HERE = Path(__file__).parent
PUBLIC = HERE.parent / "public"
WHITE = (255, 255, 255, 255)

CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    shutil.which("google-chrome"),
    shutil.which("chromium"),
]


def chrome() -> str:
    for c in CHROME_CANDIDATES:
        if c and Path(c).is_file():
            return c
    sys.exit("build-assets: no Chrome or Chromium found")


def render(svg: Path, out: Path, size: int) -> Image.Image:
    subprocess.run(
        [
            chrome(), "--headless", "--disable-gpu", "--hide-scrollbars",
            "--default-background-color=00000000",
            "--force-device-scale-factor=1", f"--window-size={size},{size}",
            f"--screenshot={out}", f"file://{svg}",
        ],
        check=True, capture_output=True,
    )
    im = Image.open(out).convert("RGBA")
    if im.size != (size, size):
        sys.exit(f"build-assets: {out.name} came out {im.size}, expected {size}x{size}")
    # A failed SVG parse still screenshots fine, just nearly empty.
    if len(im.getcolors(maxcolors=300000) or []) < 20:
        sys.exit(f"build-assets: {out.name} is nearly empty; the SVG likely failed")
    return im


def on_background(mark: Image.Image, size: int, inset: float) -> Image.Image:
    """Composite the mark, scaled to `inset` of the canvas, onto opaque white."""
    inner = round(size * inset)
    canvas = Image.new("RGBA", (size, size), WHITE)
    scaled = mark.resize((inner, inner), Image.LANCZOS)
    off = (size - inner) // 2
    canvas.alpha_composite(scaled, (off, off))
    return canvas


def main() -> None:
    subprocess.run([sys.executable, str(HERE / "make-logo.py")], check=True)
    PUBLIC.mkdir(exist_ok=True)
    tmp = HERE / "_render"
    tmp.mkdir(exist_ok=True)

    regular = render(HERE / "logo.svg", tmp / "regular-512.png", 512)
    bold = render(HERE / "logo-bold.svg", tmp / "bold-512.png", 512)
    tiny = render(HERE / "logo-tiny.svg", tmp / "tiny-512.png", 512)

    # SVG favicon: the tiny variant, because browsers draw SVG favicons at 16px.
    shutil.copyfile(HERE / "logo-tiny.svg", PUBLIC / "favicon.svg")

    tiny.resize((16, 16), Image.LANCZOS).save(PUBLIC / "favicon-16.png")
    for px in (32, 48):
        bold.resize((px, px), Image.LANCZOS).save(PUBLIC / f"favicon-{px}.png")
    # Save the .ico from the 48px image, not the 16px one: PIL only emits the
    # requested sizes that are <= the source, so saving from 16 silently produces
    # a single-entry icon and drops 32 and 48 without complaining.
    # One .ico, but the 16px entry comes from `tiny` and the larger two from
    # `bold`, so each embedded size gets art drawn for it.
    ico = bold.resize((48, 48), Image.LANCZOS)
    ico.save(PUBLIC / "favicon.ico", sizes=[(48, 48), (32, 32)],
             append_images=[tiny.resize((16, 16), Image.LANCZOS)])

    regular.save(PUBLIC / "logo-512.png")
    # The regular SVG ships too: the site header draws the mark at 22px CSS but
    # on retina that is 44 real pixels, so vector beats any raster we could pick.
    shutil.copyfile(HERE / "logo.svg", PUBLIC / "logo.svg")
    # iOS draws its own rounded tile, so the art wants a little breathing room.
    on_background(regular, 180, 0.80).convert("RGB").save(PUBLIC / "apple-touch-icon.png")
    on_background(regular, 400, 0.78).convert("RGB").save(PUBLIC / "linkedin-logo-400.png")

    shutil.rmtree(tmp)
    for f in sorted(PUBLIC.glob("favicon*")) + [
        PUBLIC / "apple-touch-icon.png",
        PUBLIC / "logo.svg",
        PUBLIC / "logo-512.png",
        PUBLIC / "linkedin-logo-400.png",
    ]:
        print(f"  {f.name:26} {f.stat().st_size:>7,} bytes")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Rebuild Mindful Scroll collages on cool blue-white canvas.

Preserves original screenshot contrast/color; only the collage canvas
is cool (#F3F7FB). Avoids washing UI interiors toward white.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
MS = ROOT / "public" / "Mindful-Scroll"
ORIG = MS / "originals"
SITE_BG = (243, 247, 251)


def rounded_shadow(img: Image.Image, phone_w: int = 360) -> Image.Image:
    img = ImageEnhance.Contrast(img.convert("RGB")).enhance(1.05).convert("RGBA")
    scale = phone_w / img.width
    nw, nh = phone_w, int(img.height * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    mask = Image.new("L", (nw, nh), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, nw - 1, nh - 1), radius=36, fill=255)
    phone = Image.new("RGBA", (nw, nh), (0, 0, 0, 0))
    phone.paste(img, (0, 0))
    phone.putalpha(mask)
    pad = 32
    canvas = Image.new("RGBA", (nw + pad * 2, nh + pad * 2), (0, 0, 0, 0))
    sh_mask = mask.point(lambda p: int(p * 0.3) if p else 0)
    sh = Image.new("RGBA", (nw, nh), (74, 127, 163, 65))
    sh.putalpha(sh_mask)
    sh = sh.filter(ImageFilter.GaussianBlur(12))
    canvas.paste(sh, (pad + 3, pad + 7), sh)
    canvas.paste(phone, (pad, pad), phone)
    return canvas


def compose(paths: list[Path], out_path: Path, size=(1400, 875)) -> None:
    W, H = size
    canvas = Image.new("RGB", (W, H), SITE_BG)
    phones = [rounded_shadow(Image.open(p).convert("RGBA")) for p in paths]
    gap, top, bottom = 40, 48, 56
    max_h = max(p.height for p in phones)
    scale = min(1.0, (H - top - bottom) / max_h)
    if scale < 1:
        phones = [
            p.resize(
                (int(p.width * scale), int(p.height * scale)),
                Image.Resampling.LANCZOS,
            )
            for p in phones
        ]
    total_w = sum(p.width for p in phones) + gap * (len(phones) - 1)
    x = (W - total_w) // 2
    for p in phones:
        y = top + (H - top - bottom - p.height) // 2
        canvas.paste(p, (x, y), p)
        x += p.width + gap
    canvas.save(out_path, "JPEG", quality=94, optimize=True)
    print(f"wrote {out_path.relative_to(ROOT)}")


def main() -> None:
    compose(
        [
            ORIG / "feed.png",
            ORIG / "startday-diary-daily.png",
            ORIG / "chatbot-juanjuan-conversation.png",
        ],
        MS / "cover.jpg",
    )
    compose(
        [ORIG / "consent.png", ORIG / "ema-diary.png", ORIG / "feed.png"],
        MS / "gallery-study.jpg",
    )
    compose(
        [
            ORIG / "ema-diary.png",
            ORIG / "endday-reflection.png",
            ORIG / "chatbot-juanjuan-conversation.png",
        ],
        MS / "gallery-support.jpg",
    )


if __name__ == "__main__":
    main()

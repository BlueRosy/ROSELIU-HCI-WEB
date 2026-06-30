#!/usr/bin/env python3
"""Align split hero layers to a reference composite (e.g. h5.png)."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image


def paste_layer(base: Image.Image, layer: Image.Image, dx: int, dy: int) -> Image.Image:
    out = base.copy()
    out.paste(layer, (dx, dy), layer)
    return out


def composite_score(ref: np.ndarray, comp: np.ndarray, mask: np.ndarray) -> int:
    diff = np.abs(ref.astype(np.int32) - comp.astype(np.int32))
    return int(diff[mask].sum())


def search_shift(
    ref: np.ndarray,
    layer: Image.Image,
    mask: np.ndarray,
    *,
    radius: int = 24,
    step: int = 2,
) -> tuple[int, int, int]:
    best = (0, 0, 10**18)
    for dx in range(-radius, radius + 1, step):
        for dy in range(-radius, radius + 1, step):
            canvas = Image.new("RGBA", layer.size)
            canvas.paste(layer, (dx, dy), layer)
            score = composite_score(ref, np.array(canvas), mask)
            if score < best[2]:
                best = (dx, dy, score)
    return best


def shift_layer(layer: Image.Image, dx: int, dy: int) -> Image.Image:
    out = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    out.paste(layer, (dx, dy), layer)
    return out


def main() -> None:
    parser = argparse.ArgumentParser(description="Align hero PNG layers to reference composite")
    parser.add_argument("--id", default="h5", help="Asset id prefix (default: h5)")
    parser.add_argument("--write", action="store_true", help="Overwrite vine PNG with aligned version")
    parser.add_argument("--write-meta", action="store_true", help="Write align JSON next to assets")
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1] / "public" / "Rose-PersonalImage"
    ref_path = root / f"{args.id}.png"
    body_path = root / f"{args.id}-wo-vines.png"
    vine_path = root / f"{args.id}-vines.png"

    for path in (ref_path, body_path, vine_path):
        if not path.exists():
            raise SystemExit(f"Missing: {path}")

    ref = np.array(Image.open(ref_path).convert("RGBA"))
    body = Image.open(body_path).convert("RGBA")
    vine = Image.open(vine_path).convert("RGBA")
    mask = ref[:, :, 3] > 10

    body_dx, body_dy, _ = search_shift(ref, body, mask, radius=16, step=2)
    body_on = paste_layer(Image.new("RGBA", body.size), body, body_dx, body_dy)
    vine_dx, vine_dy, _ = search_shift(
        ref,
        vine,
        mask,
        radius=24,
        step=2,
    )

    # refine vine shift with body fixed
    best = (vine_dx, vine_dy, 10**18)
    for dx in range(vine_dx - 4, vine_dx + 5):
        for dy in range(vine_dy - 4, vine_dy + 5):
            comp = paste_layer(body_on, vine, dx, dy)
            score = composite_score(ref, np.array(comp), mask)
            if score < best[2]:
                best = (dx, dy, score)

    vine_dx, vine_dy, score = best
    aligned_vine = shift_layer(vine, vine_dx, vine_dy)

    meta = {
        "id": args.id,
        "refSize": list(ref.shape[1::-1]),
        "body": {"x": body_dx, "y": body_dy},
        "vines": {"x": vine_dx, "y": vine_dy},
        "score": score,
    }
    print(json.dumps(meta, indent=2))

    if args.write_meta:
        meta_path = root / f"{args.id}-layer-align.json"
        meta_path.write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {meta_path}")

    if args.write:
        aligned_vine.save(vine_path, optimize=True)
        print(f"updated {vine_path}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Flood-fill warm ivory background → transparent (matches h9/h10 treatment)."""

from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image


def knockout_ivory(
    path: Path,
    *,
    min_bright: int = 218,
    max_delta: int = 24,
) -> tuple[int, int]:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    total = w * h

    def bright_enough(r: int, g: int, b: int) -> bool:
        return min(r, g, b) >= min_bright

    def similar(a: tuple[int, int, int], b: tuple[int, int, int]) -> bool:
        return all(abs(a[i] - b[i]) <= max_delta for i in range(3))

    visited: set[tuple[int, int]] = set()
    q: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        if (x, y) in visited:
            return
        r, g, b, a = px[x, y]
        if a > 0 and bright_enough(r, g, b):
            visited.add((x, y))
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, _ = px[x, y]
        cur = (r, g, b)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if not (0 <= nx < w and 0 <= ny < h):
                continue
            if (nx, ny) in visited:
                continue
            nr, ng, nb, na = px[nx, ny]
            if na > 0 and bright_enough(nr, ng, nb) and similar(cur, (nr, ng, nb)):
                visited.add((nx, ny))
                q.append((nx, ny))

    for x, y in visited:
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)

    im.save(path, optimize=True)
    return len(visited), total


def main() -> None:
    root = Path(__file__).resolve().parents[1] / "public" / "Rose-PersonalImage"
    files = sys.argv[1:] or ["h5-wo-vines.png", "h5-vines.png"]

    for name in files:
        path = root / name
        if not path.exists():
            print(f"skip (missing): {path}")
            continue
        removed, total = knockout_ivory(path)
        pct = 100 * removed / total
        print(f"{name}: knocked out {removed}/{total} px ({pct:.1f}%)")


if __name__ == "__main__":
    main()

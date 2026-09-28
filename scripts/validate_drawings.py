#!/usr/bin/env python3
"""sniff drawings.json for shape, missing images, and sneaky PII keys."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEBSITE = ROOT / "website"
DATA = WEBSITE / "data" / "drawings.json"
REQUIRED = {"id", "title", "image", "added"}
FORBIDDEN = {"artist", "name", "age", "author", "kid", "child"}


def main() -> int:
    if not DATA.is_file():
        print(f"missing {DATA}", file=sys.stderr)
        return 1
    try:
        rows = json.loads(DATA.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"invalid json: {exc}", file=sys.stderr)
        return 1
    if not isinstance(rows, list) or not rows:
        print("drawings.json must be a non-empty array", file=sys.stderr)
        return 1

    ids: set[str] = set()
    for i, row in enumerate(rows):
        if not isinstance(row, dict):
            print(f"row {i}: not an object", file=sys.stderr)
            return 1
        keys = set(row.keys())
        missing = REQUIRED - keys
        if missing:
            print(f"row {i}: missing {sorted(missing)}", file=sys.stderr)
            return 1
        bad = keys & FORBIDDEN
        if bad:
            print(f"row {i}: forbidden PII-ish keys {sorted(bad)}", file=sys.stderr)
            return 1
        for key in REQUIRED:
            if not isinstance(row[key], str) or not row[key].strip():
                print(f"row {i}: {key} must be a non-empty string", file=sys.stderr)
                return 1
        if row["id"] in ids:
            print(f"row {i}: duplicate id {row['id']!r}", file=sys.stderr)
            return 1
        ids.add(row["id"])
        image_path = WEBSITE / row["image"]
        if not image_path.is_file():
            print(f"row {i}: image not found: {row['image']}", file=sys.stderr)
            return 1

    print(f"ok: {len(rows)} drawing(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

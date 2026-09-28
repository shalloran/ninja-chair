#!/usr/bin/env python3
"""sniff drawings.json + stories.json for shape, missing files, sneaky PII keys."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEBSITE = ROOT / "website"
DRAWINGS = WEBSITE / "data" / "drawings.json"
STORIES = WEBSITE / "data" / "stories.json"
DRAWING_REQUIRED = {"id", "title", "image", "added"}
STORY_REQUIRED = {"id", "title", "blurb", "cover", "href", "added", "pages"}
FORBIDDEN = {"artist", "name", "age", "author", "kid", "child"}


def loadJson(path: Path):
    if not path.is_file():
        print(f"missing {path}", file=sys.stderr)
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"invalid json in {path}: {exc}", file=sys.stderr)
        return None


def rejectPii(keys: set[str], label: str) -> bool:
    bad = keys & FORBIDDEN
    if bad:
        print(f"{label}: forbidden PII-ish keys {sorted(bad)}", file=sys.stderr)
        return False
    return True


def validateDrawings(rows) -> bool:
    if not isinstance(rows, list):
        print("drawings.json must be an array", file=sys.stderr)
        return False
    ids: set[str] = set()
    for i, row in enumerate(rows):
        label = f"drawing {i}"
        if not isinstance(row, dict):
            print(f"{label}: not an object", file=sys.stderr)
            return False
        keys = set(row.keys())
        missing = DRAWING_REQUIRED - keys
        if missing:
            print(f"{label}: missing {sorted(missing)}", file=sys.stderr)
            return False
        if not rejectPii(keys, label):
            return False
        for key in DRAWING_REQUIRED:
            if not isinstance(row[key], str) or not row[key].strip():
                print(f"{label}: {key} must be a non-empty string", file=sys.stderr)
                return False
        if row["id"] in ids:
            print(f"{label}: duplicate id {row['id']!r}", file=sys.stderr)
            return False
        ids.add(row["id"])
        image_path = WEBSITE / row["image"]
        if not image_path.is_file():
            print(f"{label}: image not found: {row['image']}", file=sys.stderr)
            return False
    return True


def validateStories(rows) -> bool:
    if not isinstance(rows, list) or not rows:
        print("stories.json must be a non-empty array", file=sys.stderr)
        return False
    ids: set[str] = set()
    for i, row in enumerate(rows):
        label = f"story {i}"
        if not isinstance(row, dict):
            print(f"{label}: not an object", file=sys.stderr)
            return False
        keys = set(row.keys())
        missing = STORY_REQUIRED - keys
        if missing:
            print(f"{label}: missing {sorted(missing)}", file=sys.stderr)
            return False
        if not rejectPii(keys, label):
            return False
        for key in ("id", "title", "blurb", "cover", "href", "added"):
            if not isinstance(row[key], str) or not row[key].strip():
                print(f"{label}: {key} must be a non-empty string", file=sys.stderr)
                return False
        if row["id"] in ids:
            print(f"{label}: duplicate id {row['id']!r}", file=sys.stderr)
            return False
        ids.add(row["id"])
        cover_path = WEBSITE / row["cover"]
        if not cover_path.is_file():
            print(f"{label}: cover not found: {row['cover']}", file=sys.stderr)
            return False
        pages = row["pages"]
        if not isinstance(pages, list) or not pages:
            print(f"{label}: pages must be a non-empty array", file=sys.stderr)
            return False
        for j, page in enumerate(pages):
            if not isinstance(page, str) or not page.strip():
                print(f"{label}: page {j} must be a non-empty string", file=sys.stderr)
                return False
            page_path = WEBSITE / page
            if not page_path.is_file():
                print(f"{label}: page not found: {page}", file=sys.stderr)
                return False
    return True


def main() -> int:
    drawings = loadJson(DRAWINGS)
    if drawings is None:
        return 1
    stories = loadJson(STORIES)
    if stories is None:
        return 1
    if not validateDrawings(drawings):
        return 1
    if not validateStories(stories):
        return 1
    print(f"ok: {len(drawings)} drawing(s), {len(stories)} stor(y/ies)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

# NinjaChair

Welcome to ninja chair, more to come. Live site: [ninjachair.com](https://ninjachair.com).

Static site in `website/`, served by GitHub Pages (same idea as [LOLVPN](https://github.com/shalloran/LOLVPN)).

## Add a story (mini graphic novel)

1. Put ordered pages in `website/assets/stories/<story-id>/` (`01.jpeg`, `02.jpeg`, …).
2. Add an entry to `website/data/stories.json` (`id`, `title`, `blurb`, `cover`, `href`, `added`, `pages`).
3. Add a reader page at `website/stories/<story-id>/index.html` (copy an existing one and set `data-story-id`).
4. Commit and push when you’re ready (you handle remotes).

Public credits are **titles only** — no kid names.

## Add a drawing

For a single piece (not a multi-page story): drop the image in `website/assets/drawings/`, then add one object to `website/data/drawings.json` with `id`, `title`, `image` (path under `website/`), and `added` (date). Use a drawing title only — no kid names or ages. Commit and push when you’re ready.

## Local preview

```bash
cd website && python3 -m http.server 8080
```

Open http://localhost:8080/

## Validate site data

```bash
python3 scripts/validate_drawings.py
```

## License

GPL-3.0 — see `LICENSE`.

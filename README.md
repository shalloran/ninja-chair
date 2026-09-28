# NinjaChair

Welcome to ninja chair, more to come. Live site: [ninjachair.com](https://ninjachair.com).

Static site in `website/`, served by GitHub Pages (same idea as [LOLVPN](https://github.com/shalloran/LOLVPN)).

## Add a drawing

1. Put the image in `website/assets/drawings/`.
2. Add an entry to `website/data/drawings.json` (`id`, `title`, `image`, `added`).
3. Commit and push when you’re ready (you handle remotes).

Public credits are **titles only** — no kid names.

## Local preview

```bash
cd website && python3 -m http.server 8080
```

Open http://localhost:8080/

## Validate gallery data

```bash
python3 scripts/validate_drawings.py
```

## License

GPL-3.0 — see `LICENSE`.

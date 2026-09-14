---
name: seed
description: Build and serve a local copy of the leave grid with random fake OFF data. Local only, never touches the Sheet or Apps Script. Trigger on "/seed", optionally with a density 0-1, e.g. "/seed 0.5".
---

1. Run `python3 dev/seed.py seed <density>` from the project root. Density is the optional argument, default 0.3.
2. Run `dev/serve.sh`. It starts a static server on port 8731 if one isn't already running and prints the URL.
3. Report the cell count from step 1 and these URLs on separate lines:
   - `http://localhost:8731/#local-1` acts as the first fake person (editable row)
   - `http://localhost:8731/` view-only
   Tokens go `#local-1` to `#local-22`.

The generated `dev/index.html` is a copy of `index.html` with an in-page fetch stub and fake names. It is gitignored. Edits to `index.html` need a re-run of `/seed` to show up. Data lives in memory in the tab and resets on reload.

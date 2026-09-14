# Christmas leave grid

Doodle-style "who's off when" for James's mam's team. Deliberately minimal: no framework, no build, no auth beyond per-person links.

## Architecture

Three pieces, one URL for staff.

- `index.html` — the whole UI. Static, hosted on GitHub Pages from `master` root. Talks to the API with `fetch`.
- `Code.gs` — Google Apps Script bound to the Sheet, deployed as a web app (execute as owner, access Anyone). JSON API only: `GET ?json=1&token=…` returns the grid plus `me`, `POST` with `{token, date, off}` writes one cell. A bare GET redirects to the site.
- The Google Sheet — the database and the admin UI. Tab `Grid`: row 1 dates from B1, column A names from A2, cells `OFF` or blank. Tab `Tokens`: Name, Token, Link; auto-filled by `tokens_()` for any name in `Grid` without one.

Live URLs and the Sheet link are in `README.md`.

## Rules that aren't obvious from the code

- The token decides whose row is written. Never accept a name from the client for writes.
- Token travels as a URL fragment (`#uuid`) so it never hits GitHub's logs. It goes to the API as a query param over HTTPS.
- POST uses `Content-Type: text/plain` on purpose. Apps Script can't answer a CORS preflight; text/plain avoids one.
- Writes send the desired state (`setOff`), not a toggle, so rapid taps converge on the last one. Don't reintroduce a toggle.
- Client paints optimistically and never blocks the next tap. A failed save reverts that one cell. Don't gate clicks on a global busy flag; that was the lag bug.
- Auto-refresh every 30s skips while any save is in flight, otherwise a stale grid would clobber the optimistic state.
- Dates are formatted server-side (`EEE d MMM`, script timezone) and matched back by that label. Keep client and server formats identical.
- `LockService` wraps writes and token minting. Cheap, keeps concurrent taps from clobbering.

## Deploying changes

- `index.html`: push to `master`. Pages rebuilds in about a minute.
- `Code.gs`: paste into the Apps Script editor, save, then Deploy → Manage deployments → pencil → Version: New version → Deploy. Same `/exec` URL every time. A "New deployment" would change the URL and break `API` in `index.html`.
- Apps Script is only reachable through the owner's Google account in Chrome. There's no clasp setup.

## Testing

No test suite. Verify against the real thing:

- Local: `/seed [density]` builds `dev/index.html` (real UI, in-page fetch stub, fake names, random OFF cells) and serves it on http://localhost:8731. `#local-1` … `#local-22` act as each fake person. `/unseed` blanks it. Nothing in `dev/` touches Google.
- Live: load the Pages URL with a token from the `Tokens` tab, toggle a cell, re-fetch `?json=1` and check the cell, then toggle back. Leave the Sheet clean.
- Sanity-check the API directly with `curl -sL --data '…'` (no `-X POST`, curl must switch to GET on the 302 like a browser does).

## Not doing

No login, no half-days, no notifications, no history. Two states per cell. Keep it that way unless asked.

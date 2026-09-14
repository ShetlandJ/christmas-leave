# Christmas leave grid

One static page on GitHub Pages, one Google Sheet, one Apps Script deployed as a JSON API. The Sheet is the database and the admin view; `index.html` is what staff use.

## Set up (once, ~5 minutes)

1. Create a new Google Sheet. Rename the tab (bottom left) to `Grid`.
2. Row 1, from B1 across: type the dates, one per column (e.g. `22/12/2026`, `23/12/2026`, … `04/01/2027`). Type the first two and drag-fill the rest. Leave A1 blank.
3. Column A, from A2 down: paste the staff names, one per row.
4. Menu: Extensions → Apps Script.
5. In the editor, replace the contents of `Code.gs` with the `Code.gs` from this folder.
6. Save (Cmd/Ctrl+S).
7. Deploy → New deployment → gear icon → Web app.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy. Authorise when asked (Advanced → Go to … → Allow).
8. Copy the Web app URL (ends in `/exec`) into the `API` constant at the top of `index.html`, and into `SITE` in `Code.gs` put the GitHub Pages URL.
9. Enable GitHub Pages on the repo (Settings → Pages → branch `master`, folder `/`). Send staff the Pages URL.

## Personal links

Each person gets their own link and can only change their own row. Everyone sees the whole grid.

- Links live in the Sheet's `Tokens` tab (Name, Token, Link). The tab fills itself the first time anyone loads the site after a name is added to `Grid`.
- Send each person their Link from that tab. Opening the site without a link is view-only.
- If someone loses their link, just send it again. To revoke one, clear their row in `Tokens` and reload the site to mint a new one.

## Day to day

- Staff open their own link and tap boxes. Green `OFF` = off that day. Bottom row counts how many are off each day (red when half or more).
- To add or remove someone: edit column A in the Sheet. To change dates: edit row 1. Refresh the page.
- The Sheet cells read `OFF` or blank, so print or filter it however you like.

## Changing the code later

Edit in the Apps Script editor, then Deploy → Manage deployments → pencil icon → Version: **New version** → Deploy. The URL stays the same.

## Live

- Site (send this to staff): https://shetlandj.github.io/christmas-leave/
- API (Apps Script, bounces to the site if opened directly): https://script.google.com/macros/s/AKfycbx4_-6gTRwgYTEq75aAcIQ__dKKYCRfmKKuW2aaPeqkwc2P8z706JujDSSe-0A_s-NMkw/exec
- Sheet (admin, owner account only): https://docs.google.com/spreadsheets/d/1MhyBe4ffz0ODn-UHn4BAo1hx3o58GOEyGIweX0kBh64/edit
- First data load after a quiet spell can take a few seconds while Apps Script warms up.

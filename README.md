# Christmas leave grid

One Google Sheet + one Apps Script web app. The Sheet is the database and the admin view; the web page is what staff use.

## Set up (once, ~5 minutes)

1. Create a new Google Sheet. Rename the tab (bottom left) to `Grid`.
2. Row 1, from B1 across: type the dates, one per column (e.g. `22/12/2026`, `23/12/2026`, … `04/01/2027`). Type the first two and drag-fill the rest. Leave A1 blank.
3. Column A, from A2 down: paste the staff names, one per row.
4. Menu: Extensions → Apps Script.
5. In the editor, replace the contents of `Code.gs` with the `Code.gs` from this folder.
6. Click `+` next to Files → HTML → name it `Index` (exactly). Replace its contents with `Index.html` from this folder.
7. Save (Cmd/Ctrl+S).
8. Deploy → New deployment → gear icon → Web app.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy. Authorise when asked (Advanced → Go to … → Allow).
9. Copy the Web app URL (ends in `/exec`). Send that to staff.

## Day to day

- Staff open the URL and tap boxes. Green `OFF` = off that day. Bottom row counts how many are off each day (red when half or more).
- To add or remove someone: edit column A in the Sheet. To change dates: edit row 1. Refresh the page.
- The Sheet cells read `OFF` or blank, so print or filter it however you like.

## Changing the code later

Edit in the Apps Script editor, then Deploy → Manage deployments → pencil icon → Version: **New version** → Deploy. The URL stays the same.

## Live

- Web app (send this to staff): https://script.google.com/macros/s/AKfycbx4_-6gTRwgYTEq75aAcIQ__dKKYCRfmKKuW2aaPeqkwc2P8z706JujDSSe-0A_s-NMkw/exec
- Sheet (admin, owner account only): https://docs.google.com/spreadsheets/d/1MhyBe4ffz0ODn-UHn4BAo1hx3o58GOEyGIweX0kBh64/edit
- First load after a quiet spell can take ~10s to paint. That's the Apps Script sandbox spinning up, not a bug.

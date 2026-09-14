# Christmas leave grid — how to run it

Two links. Everything else is detail.

- **Send to staff:** https://shetlandj.github.io/christmas-leave/ — but each person gets their *own* version of this link (see below), not this one.
- **Your admin view (the spreadsheet):** https://docs.google.com/spreadsheets/d/1MhyBe4ffz0ODn-UHn4BAo1hx3o58GOEyGIweX0kBh64/edit

The spreadsheet *is* the system. The website just reads and writes it. Anything you change in the sheet shows on the website when someone refreshes.

## Sending everyone their link

Open the spreadsheet and look at the **Tokens** tab at the bottom. One row per person: their name, a long code, and their personal Link.

Send each person the Link from their row. That link only lets them tick their own row; they can see everyone else's but can't change them. Anyone opening the plain website address without a link just gets a read-only view.

To make the messages easy, put this in cell D2 of the Tokens tab and drag it down:

    ="Hi "&A2&", here's your link for marking your Christmas leave: "&C2

Then copy each cell into an email or a text.

## Reading the grid

- Names down the side, dates across the top, months banded above them.
- A green **OFF** box means that person is off that day.
- The **Off that day** row under the dates counts how many people are off. It turns red when half the team or more is off — that's your warning row.
- Weekends are shaded grey. Bank holidays (25 and 28 December, 1 and 4 January) are just ordinary empty columns — the system doesn't know about them, so nobody should be ticking them anyway.
- The same information is in the **Grid** tab of the spreadsheet as plain `OFF` text, so you can print it, colour it, or filter it however you like.

## Changing things

- **Add someone:** type their name in the next empty cell in column A of the **Grid** tab. Load the website once, and their row appears in the Tokens tab with a link to send them.
- **Remove someone:** delete their row in the **Grid** tab.
- **Change the dates:** edit row 1 of the **Grid** tab. Add a column for another day, delete one you don't need.
- **Someone lost their link:** send it again from the Tokens tab. It doesn't expire.
- **Someone needs a fresh link:** delete their row in the Tokens tab, then load the website once. A new link appears. The old one stops working.

## Things that look broken but aren't

- **The first load of the day is slow.** Google puts the script to sleep when nobody's used it. Give it ten seconds.
- **Someone says it's read-only.** They've opened the plain website address instead of their personal link, or the link lost its tail when it was pasted. Send it again.
- **Two people ticked at once and it looked odd for a second.** The page catches up on its own within thirty seconds, or on Refresh.

## Don't

- Don't rename the **Grid** or **Tokens** tabs, and don't delete the Tokens tab.
- Don't rename a person in the Grid tab if you can help it — it reads as a new person and they'll need a new link. Delete and re-add deliberately instead.
- Don't paste anything into the body of the grid except by ticking on the website. The cells are meant to be `OFF` or empty.

If something's genuinely wrong, James built it — the technical notes are in `README.md` and `CLAUDE.md` in the code.

---
name: unseed
description: Reset the local fake leave grid to all blank cells. Local only. Trigger on "/unseed" or "reset the local grid".
---

1. Run `python3 dev/seed.py unseed` from the project root.
2. If a server is running on 8731, say the page at `http://localhost:8731/` just needs a reload. Don't restart it.
3. Report one line confirming the local grid is clear.

To stop the local server entirely: `pkill -f 'http.server 8731'`.

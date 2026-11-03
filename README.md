# Tiger Track · Coastal & Tarot edition (v3)

A free, private-to-your-device iPhone-friendly Progressive Web App, with:

- Soft turquoise, warm orange, cream and tiger-wave aesthetic
- Running, weights, yoga and other workouts, including planned vs actual logs
- Eight-week running challenge (Tue/Wed speed, Sat/Sun long run, independently selectable each week)
- Daily habits, completion history and weekly stats
- Daily tarot: all 78 cards, one-card and three-card mind/body/spirit spreads, upright/reversed meanings, daily reflections and past-reading history
- Export/import backups (JSON) and offline capability after the initial load

## Run locally

1. Extract the ZIP file.
2. Open the **tiger-track-coastal-tarot** folder in VS Code.
3. Install the free **Live Server** extension (Ritwick Dey) and open **index.html** with Live Server.
4. Try the tabs, draw tarot cards and save a reflection.

No Node.js, dependencies, logins or paid services are needed. Avoid opening `index.html` from the file system for PWA testing; use Live Server.

## Update your existing GitHub Pages app

1. **Back up existing data first** from Tiger Track **Settings → Export backup**. Save it to Files or iCloud Drive.
2. Keep the original **GitHub repository**, `Tiger-Tracker`. You do not need a new one.
3. In the GitHub repository, use **Add file → Upload files**. Upload **all files from inside this extracted folder**, including the `icons` directory and the **new `tarot-data.js` file**. Keep `index.html`, `app.js`, `styles.css`, `tarot-data.js`, `service-worker.js`, `manifest.json` and `icons/` at the **repository root**, not inside an extra folder.
4. Commit changes. If GitHub won't accept replacement files from the upload page, use the VS Code Source Control view to commit/push, or open each file on GitHub and edit it directly.
5. Wait for **Actions → pages build and deployment** to finish.
6. Open **https://jprole1894.github.io/Tiger-Tracker/** in iPhone Safari. Refresh once; if old visuals persist, close and relaunch the home-screen app or refresh Safari again.
7. Your original home-screen icon can remain. If the icon does not update, remove the old icon from your Home Screen and add the site again in Safari. Removing the icon is different from clearing website data; **do not clear website data** because it may erase local records.

### Keeping your data

The storage key remains `tiger-track-data-v1` intentionally, so old workouts, habits and running plans are carried forward on the **same device and website URL**, where Safari retained the data. The app adds `tarot` readings into the same record.

Local browser storage does **not** automatically sync between your computer and iPhone. If you entered data on your computer and want it on your phone, export a backup from the computer, then import it in Tiger Track on the iPhone. Importing replaces records on that device, so export first.

Exporting your data produces a JSON file containing workouts, habits, daily habit check-ins and tarot readings. Save backups somewhere you control. Older Tiger Track backups still import; they simply contain no tarot readings.

## About tarot

The deck includes 78 traditional tarot card names, with original short summaries and journal prompts. Each daily draw is random and saved under your local date; you can draw one card or three (mind, body, spirit) and optionally draw again after confirmation. Upright/reversed orientation is random. Tarot is offered for entertainment and personal reflection, not as factual prediction or health, financial or relationship advice.

## Files

- `index.html` — screens, forms, and navigation
- `styles.css` — coastal tiger palette and card illustration styling
- `tarot-data.js` — all 78 card meanings and prompts
- `app.js` — workouts, habits, run schedule, storage, tarot logic
- `manifest.json` — iPhone Home Screen metadata
- `service-worker.js` — basic offline caching
- `icons/` — tiger-wave Home Screen icon

No Pinterest artwork is copied into this app. Its illustrations and graphic shapes are locally coded and original.

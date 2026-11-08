# Tiger Track v5 · Cosmic Rhythms & Period Tracking

A personal, free, iPhone-friendly web app with a coastal tiger aesthetic: warm muted orange, sea-glass turquoise, cream and terracotta.

## What is included

- **Home / Movement:** plan and log runs, weights, yoga or anything else, with planned vs actual notes.
- **8-week running plan:** 16 running sessions to take your long run from 10 to 25 km; speed sessions Tue/Wed, distance sessions Sat/Sun, independently chosen each week.
- **Glute glow:** Monday/Friday workout [video 1](https://www.youtube.com/watch?v=T1cio6MJ7Fs); Tuesday/Saturday workout [video 2](https://www.youtube.com/watch?v=hDkhKi-5_sQ&t=397s). One-tap video links and a log button.
- **Habits:** daily check-ins and weekly progress.
- **Tarot:** a local 78-card deck with upright/reversed interpretations, one- and three-card draws and written reflections.
- **Cosmos → Monthly New-Moon Reset:** real calculated new-moon dates, a short countdown, and saved intention/reflection prompts for each lunar month. Prompts cover wins, what to release, intentions, movement and self-care.
- **Cosmos → My Period Cycle:** record period start/end dates, symptom notes, energy, mood, flow, and a browseable calendar. Average cycle length is calculated from entered period starts. A predicted next start is **an estimate only**, not contraception guidance.
- **Cosmos → Saturn Season:** an optional date-of-birth field showing a broad, age-based Saturn-return reflection window (29th to 31st birthdays). **This is not a natal-chart calculation**; exact natal Saturn returns require an ephemeris and other data.
- **Backups:** JSON export/import includes workouts, habits, tarot, moon resets, optional birth date and cycle records.

## Install or update on GitHub Pages, without creating duplicate folders

1. **Before updating:** in your current Tiger Track app, open **Settings → Export backup** and keep the downloaded JSON somewhere private.
2. Download and **extract** the Tiger Track v5 ZIP. Open the extracted folder.
3. Open your existing GitHub Pages repository (the one currently hosting your app). You do **not** need to delete or create a new repository.
4. Upload the **files and `icons` directory inside the extracted folder**, not the ZIP and not the outer folder. Keep these files at the **top/root level** of your repository:

   ```text
   index.html
   app.js
   cosmos.js        ← NEW; don't forget!
   tarot-data.js
   styles.css
   manifest.json
   service-worker.js
   README.md
   icons/
     icon.svg
     icon-192.png
     icon-512.png
   ```

5. Commit the changes. GitHub Pages must be set to **Settings → Pages → Deploy from a branch → main → /(root)**.
6. Check **Actions** until **pages build and deployment** completes. Then open **Settings → Pages → Visit site**. On a computer use `Ctrl + Shift + R` to refresh; on Safari, reopen the site. Your Settings modal should show `Tiger Track v5 · Moon resets & period cycles`.
7. To add to iPhone Home Screen, open the live URL in **Safari → Share → Add to Home Screen**. No Apple Developer subscription or App Store publishing required.

**Important:** GitHub Pages hosting under a public repository means the **app's source code** is public. Your recorded workouts, period data and journal text are *not* saved to GitHub by this app; they are in the browser's local storage. However, browser storage is **not encrypted**. Someone with access to the unlocked device/browser, other scripts from the same site origin, or an exported JSON backup may be able to read it. Backups are plaintext, so store them privately. Clearing Safari website data or removing an installed web app could delete local records. This is not cloud syncing, and different browsers/devices have independent records.

## Try it locally

With Visual Studio Code, install the free **Live Server** extension and open the folder, then right-click `index.html` → **Open with Live Server**. No Node.js, backend, paid libraries, or astrology API required.

## Moon and period data notes

The app calculates astronomical new-moon times on-device using the standard true-new-moon series, which is generally quite accurate for modern years. Treat calendar times as approximate, not as high-precision ephemerides. Time is displayed in your browser's local timezone.

The menstrual cycle estimate is based on the number of days **between first days** of logged periods (most recent six valid intervals); if only one is recorded, it uses the editable default (28 days). Logged periods can vary, and a date estimate cannot establish fertility or reliably prevent pregnancy. The moon phase and menstruation displays are separate. No biological causal relationship is assumed.

If you experience persistent changes to your usual period pattern, significant pain or unusually heavy bleeding, medical advice is more useful than app-generated estimates.

## Files

- `index.html`: screens and forms
- `styles.css`: coastal tiger visual design
- `app.js`: workouts, habits, tarot, data management
- `cosmos.js`: new moons, journal rituals, cycle tracker and Saturn reflection
- `tarot-data.js`: 78 card descriptions
- `manifest.json`, `service-worker.js`, `icons/`: install and offline support

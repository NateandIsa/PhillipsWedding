# Isabel & Nathan · 12.12.26 · #pushingP

The wedding website. Five pages, zero monthly cost, unlimited RSVPs.

```
index.html          Home — grand reveal, countdown, RSVP nudges
details.html        Date, time, venue, itinerary, map
finer-details.html  Black tie dress code, wedding party, colors, FAQ, hotel
rsvp.html           RSVP form → Google Sheet
registry.html       Honeymoon fund (Venmo) + Amazon registry
css/style.css       All styling
js/config.js        ← THE ONLY FILE YOU EDIT (paste your Apps Script URL here)
js/main.js          Countdown + RSVP nudge logic
js/rsvp.js          Form submission
js/fund.js          Honeymoon thermometer
apps-script/Code.gs Backend code (paste into Google Apps Script)
assets/fonts/       Self-hosted elegant fonts (no external dependency)
```

---

## Section 1 — Preview it locally (optional, 10 seconds)

Just double-click `index.html` — it opens in your browser. Everything works
except the RSVP submit and live fund percentage (those need Section 2).

---

## Section 2 — RSVP backend: Google Sheet + Apps Script (~5 minutes)

This gives you **unlimited free RSVP submissions** landing in a spreadsheet,
plus the private honeymoon-fund tracker.

1. Go to **sheets.google.com** → create a blank spreadsheet.
   Name it something like `Phillips Wedding RSVPs`.
2. In the menu: **Extensions → Apps Script**.
3. Delete whatever is in the editor, and paste in the entire contents of
   `apps-script/Code.gs` from this folder. Click the 💾 save icon.
4. Click **Deploy → New deployment**.
   - Click the ⚙️ gear next to "Select type" → choose **Web app**.
   - Description: `wedding site`
   - Execute as: **Me**
   - Who has access: **Anyone**  ← required so guests can submit
   - Click **Deploy**, then **Authorize access** with your Google account.
     (Google will warn the app is unverified — click *Advanced → Go to
     project*. It's your own code; this is normal.)
5. Copy the **Web app URL** it gives you
   (looks like `https://script.google.com/macros/s/AKfy.../exec`).
6. Open `js/config.js` in this folder and paste that URL into
   `APPS_SCRIPT_URL`, replacing the placeholder. Save.

**Done.** Test it: open `rsvp.html`, submit a fake RSVP, and watch it appear
in an `RSVPs` tab in your sheet within a couple of seconds.

### Updating the honeymoon fund

The first fund request auto-creates a `Fund` tab in your sheet:

| A      | B    |
|--------|------|
| Goal   | 5500 |
| Raised | 0    |

When a Venmo contribution arrives, just update **B2** with the new running
total. The website reads **only the percentage** — dollar amounts never leave
your private sheet. (The site also shows a fallback percentage from
`config.js` if the sheet can't be reached.)

---

## Section 3 — Put it on GitHub (~5 minutes)

1. Go to **github.com** → **New repository** → name it `pushingp-wedding`
   → keep it **Public** (or Private, Netlify works with both) → Create.
2. On the new repo page, click **uploading an existing file**.
3. Drag this entire folder's contents in (all files and the `css`, `js`,
   `apps-script`, `assets` folders).
4. Click **Commit changes**.

(If you're comfortable with git: `git init`, `git add .`, `git commit -m
"wedding site"`, add the remote, push. Same result.)

---

## Section 4 — Deploy on Netlify (~3 minutes)

1. Go to **app.netlify.com** → sign up free (use your GitHub account —
   easiest).
2. **Add new site → Import an existing project → GitHub** → pick
   `pushingp-wedding`.
3. Build settings: leave everything blank/default (it's a plain static
   site — no build command, publish directory is the repo root).
4. Click **Deploy**. In ~30 seconds you'll have a live URL like
   `random-name-1234.netlify.app`.
5. Rename it: **Site settings → Change site name** →
   `pushingp` → your site is now **pushingp.netlify.app**.

From now on, any change you commit to GitHub redeploys automatically.

### Optional: a custom domain

Netlify sells domains, or connect one from Namecheap/GoDaddy
(~$10–15/yr) under **Domain settings**. Something like
`isabelandnathan.com` fits nicely on the invitation details card.

---

## How the RSVP nudges work

Guests see an RSVP prompt in three places: the button under the reveal,
a banner on the home page, and a floating RSVP button on every page.
The moment they submit the form, all three disappear on their device
(stored in the browser) — so they're encouraged until they act, and never
nagged after.

## Editing content later

Everything is plain HTML — open the file, change the words, commit to
GitHub, and Netlify redeploys. Times/dates live in the HTML; the wedding
date for the countdown lives in `js/config.js`.

## Attire illustrations

The four dress-code illustrations live at `assets/attire-him-1.jpg`,
`attire-him-2.jpg`, `attire-her-midi.png`, `attire-her-2.jpg`. To swap any
of them, just replace the file keeping the same name.

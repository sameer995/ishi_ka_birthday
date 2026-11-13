# 🏔🏃📈 Birthday Website (Summit · Marathon · Stock Market theme)

A tiny static site (HTML/CSS/JS, no build step) that works on phones, tablets and desktops.

**Features:** countdown shown as a race bib, an animated mountain sunrise with a summit flag, a stock ticker tape, an altitude + kilometre HUD that tracks your scroll, a candle-blowing cake, a letter, a photo wall with placeholders, a marathon route timeline with a running marker, a live candlestick chart, "portfolio holdings" flip cards, and a cheer wall of race bibs.

## Customise
Edit **`config.js`** only: her name, your name, ticker items, the letter, memories, chart stats, reasons, and photos (put images in an `images/` folder and set the `src` values).

## Preview locally
Open `index.html` in a browser. Before the birthday it shows the countdown; add `?preview` (e.g. `index.html?preview`) to see the celebration page. Add `?edit` to tap photo placeholders and try images from your device. You can also personalise links: `?name=Priya&from=Sameer`.

## Deploy on GitHub Pages
1. Create a new GitHub repo (e.g. `happy-birthday`) and push these files:
   ```bash
   git init
   git add .
   git commit -m "Birthday site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/happy-birthday.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, choose **main** and **/ (root)**, then Save.
3. After a minute your site is live at `https://<your-username>.github.io/happy-birthday/`.

Send her the link on 14 Nov 🎉 (the page switches to the celebration automatically at midnight IST).

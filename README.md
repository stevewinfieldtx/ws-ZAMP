# ZAMP Funds — Website

The website for **ZAMP Funds**, a venture capital firm based in Miami, Florida that
backs founders building across AI, robotics, and autonomy. Built from the Claude
Design handoff bundle as a clean, dependency-free static site — five pages, the full
warm-dark editorial design system, and an elevated interaction layer. No build step,
no framework runtime; it opens instantly and deploys anywhere.

## Pages
- `index.html` — Home (hero, conviction, partnership, sectors, conviction marquee, dual CTA, testimonial, FAQ, contact)
- `portfolio.html` — Portfolio (filterable company grid)
- `about.html` — About (thesis, founder spotlight, leadership team)
- `founders.html` — For Founders (partnership, 4-step process, FAQ, contact)
- `investors.html` — For Investors (approach, track-record stats, contact)

## Enhancements over the prototype
On-brand, respecting `prefers-reduced-motion`: scroll progress bar, condensing
blur-backed sticky nav, staggered scroll-reveals, count-up on the 500x/300x/100x
stats, a looping conviction marquee, hero parallax, magnetic primary buttons, 3D
tilt on portfolio cards, FLIP-style portfolio filtering, single-open FAQ accordion,
animated mobile menu, and a working demo contact form.

## Run locally
```bash
node server.js   # → http://localhost:3000
```
No `npm install` needed — the server uses only Node's standard library.

## Deploy to Railway
1. Push this folder to a GitHub repo (or use the Railway CLI).
2. Railway: **New Project → Deploy from GitHub repo** (or `railway up` from this folder).
3. Railway auto-detects Node via `package.json` and runs `node server.js` (binds to `$PORT`).
4. **Settings → Networking → Generate Domain** for a public URL.

### Railway CLI quickstart
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

## Known placeholders (swap when available)
- Most team & portfolio photography is placeholder imagery (Jimmy Augustine's photo
  and the ZAMP X2 logo are real and wired in).
- Footer social icons are generic Material Symbols stand-ins.
- The contact form is front-end only — wire it to an email/CRM endpoint in
  `js/app.js → contactForm()`.
- Icons use Material Symbols Rounded via Google Fonts CDN (the one external request).
# ws-ZAMP

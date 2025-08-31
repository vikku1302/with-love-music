Sakura Music - Front-end Only (Phase 1)

What this is
- A lightweight static SPA (HTML/CSS/JS) focused on a premium, serene UI
- Landing page with seasonal sakura tree animations and a breeze clear
- Music page with local-only playlists and songs (YouTube links)
- No backend yet; easy to extend later

Getting started
1) Open index.html in a browser
2) Optional: run a static server to avoid file: URL issues

Quick local server
Python 3:
  python3 -m http.server 5173
Then open http://localhost:5173

Deploying
- Any static host works (GitHub Pages, Vercel, Netlify)
- Deploy the three files: index.html, styles.css, app.js

Features
- Landing page
  - Seasons: Spring, Summer, Autumn, Snow, Rainy (background + effects)
  - Breeze button to sweep effects and respawn
  - Glassy date/time widget
- Music page
  - Create/rename/delete playlists
  - Add songs: title + YouTube URL (+ optional cover URL)
  - Reorder songs, edit cover, delete, open on YouTube
  - Heart pop animation on add/create
  - Persists in localStorage

Editing
- Styles: styles.css
- Landing logic: renderLanding() in app.js
- Music logic: renderMusic() and helpers in app.js

Next phases (backend-ready hooks)
- Replace localStorage with API calls (create simple REST)
- Add auth if needed
- Export/import playlists
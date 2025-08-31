/*
  Sakura Music - Static SPA (Front-end only)
  - Hash router
  - Landing page with seasonal sakura tree and effects
  - Music page with playlists, songs, and localStorage persistence
  Keep the code simple and easy to modify later.
*/

(function() {
  'use strict';

  // Router
  const routes = {
    '/': renderLanding,
    '/music': renderMusic,
  };

  function router() {
    const path = location.hash.replace('#', '') || '/';
    const render = routes[path] || routes['/'];
    render();
  }
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);

  // Utilities
  const $app = () => document.getElementById('app');
  const html = (strings, ...values) => strings.reduce((acc, s, i) => acc + s + (values[i] ?? ''), '');
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'style') Object.assign(node.style, v);
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (v !== undefined && v !== null) node.setAttribute(k, v);
    });
    if (!Array.isArray(children)) children = [children];
    children.filter(Boolean).forEach(child => {
      if (typeof child === 'string') node.insertAdjacentHTML('beforeend', child);
      else node.appendChild(child);
    });
    return node;
  }

  function formatDate(d) {
    const day = d.toLocaleDateString(undefined, { weekday: 'long' });
    const date = d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return { day, date, time };
  }

  // Heart pop
  function heartPopAt(x, y) {
    const h = el('div', { class: 'heart-pop' }, '❤');
    h.style.left = x + 'px';
    h.style.top = y + 'px';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 900);
  }

  function heartPopFromEvent(evt) {
    const { clientX, clientY } = evt.touches?.[0] || evt;
    heartPopAt(clientX, clientY);
  }

  // Landing Page
  const Season = {
    SPRING: 'spring',
    SUMMER: 'summer',
    AUTUMN: 'autumn',
    WINTER: 'winter',
    RAINY: 'rainy',
  };

  let currentSeason = Season.SPRING;

  function renderLanding() {
    const app = $app();
    app.className = 'landing season-' + currentSeason;
    app.innerHTML = '';

    const header = el('div', { class: 'landing-header container' }, [
      el('div', { class: 'row' }, [
        el('div', { class: 'brand' }, [
          '<span class="logo"></span>',
          'Sakura Music'
        ]),
        el('div', { style: { marginLeft: 'auto' } }, [
          el('a', { class: 'btn ghost icon', href: '#/music' }, [
            icon('music'), 'Open Music App'
          ])
        ])
      ])
    ]);

    const stage = el('div', { class: 'landing-main container' }, [
      el('div', { class: 'stage glass' }, [
        landingTree(),
        el('div', { class: 'effects', id: 'effects' }),
        el('div', { class: 'date-widget glass' }, [
          el('div', { class: 'day', id: 'wDay' }),
          el('div', { class: 'date', id: 'wDate' }),
          el('div', { class: 'time', id: 'wTime' }),
        ])
      ]),
      controlsPanel()
    ]);

    const cta = el('div', { class: 'cta' }, [
      el('a', { class: 'btn primary icon', href: '#/music' }, [
        icon('arrow-right'), 'Go to Music App'
      ])
    ]);

    app.appendChild(header);
    app.appendChild(stage);
    app.appendChild(cta);

    updateDateWidget();
    setInterval(updateDateWidget, 1000 * 30);
    refreshSeasonEffects();
  }

  function updateDateWidget() {
    const now = new Date();
    const { day, date, time } = formatDate(now);
    const wDay = document.getElementById('wDay');
    if (!wDay) return; // Not on landing
    document.getElementById('wDay').textContent = day;
    document.getElementById('wDate').textContent = date;
    document.getElementById('wTime').textContent = time;
  }

  function controlsPanel() {
    const panelEl = el('div', { class: 'controls panel' });
    const seasons = [
      { key: Season.SPRING, label: 'Spring' },
      { key: Season.SUMMER, label: 'Summer' },
      { key: Season.AUTUMN, label: 'Autumn' },
      { key: Season.WINTER, label: 'Snow' },
      { key: Season.RAINY,  label: 'Rainy' },
    ];

    const seasonButtons = seasons.map(s => el('button', {
      class: 'btn',
      onClick: (e) => {
        currentSeason = s.key;
        heartPopFromEvent(e);
        const app = $app();
        app.classList.remove('season-spring','season-summer','season-autumn','season-winter','season-rainy');
        app.classList.add('season-' + currentSeason);
        refreshSeasonEffects();
      }
    }, s.label));

    const breezeBtn = el('button', {
      class: 'btn ghost icon',
      onClick: (e) => { heartPopFromEvent(e); breezeClear(); }
    }, [icon('wind'), 'Breeze']);

    panelEl.appendChild(el('div', { class: 'row' }, [
      ...seasonButtons,
      breezeBtn
    ]));
    return panelEl;
  }

  function landingTree() {
    // Simple SVG tree to avoid external assets; can be improved later
    const svg = `
      <svg class="tree-svg" viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="bark" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#7c3f23"/>
            <stop offset="100%" stop-color="#4b2e19"/>
          </linearGradient>
          <radialGradient id="canopy" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#fecdd3"/>
            <stop offset="100%" stop-color="#f9a8d4"/>
          </radialGradient>
        </defs>
        <g>
          <path d="M300,460 C270,420 260,360 270,300 C280,240 300,180 300,120 C300,80 300,60 300,60 C300,60 290,110 280,150 C260,220 240,300 240,360 C240,430 265,470 300,500 C335,470 360,430 360,360 C360,300 340,220 320,150 C310,110 300,60 300,60 C300,60 300,80 300,120 C300,180 320,240 330,300 C340,360 330,420 300,460 Z" fill="url(#bark)"/>
          <circle cx="240" cy="130" r="90" fill="url(#canopy)" opacity="0.95"/>
          <circle cx="330" cy="120" r="110" fill="url(#canopy)" opacity="0.92"/>
          <circle cx="380" cy="190" r="90" fill="url(#canopy)" opacity="0.9"/>
          <circle cx="210" cy="200" r="110" fill="url(#canopy)" opacity="0.9"/>
          <circle cx="290" cy="200" r="120" fill="url(#canopy)" opacity="0.92"/>
        </g>
      </svg>
    `;
    return el('div', { class: 'tree-wrap' }, svg);
  }

  function refreshSeasonEffects() {
    const effects = document.getElementById('effects');
    if (!effects) return;
    effects.innerHTML = '';

    // Sunshine for summer
    if (currentSeason === Season.SUMMER) {
      effects.appendChild(el('div', { class: 'sun' }));
    }

    const count = {
      [Season.SPRING]: 60,
      [Season.SUMMER]: 20,
      [Season.AUTUMN]: 60,
      [Season.WINTER]: 80,
      [Season.RAINY]: 120,
    }[currentSeason];

    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100; // vw
      const duration = 8 + Math.random() * 10;
      const delay = Math.random() * 6;
      const drift = (Math.random() * 40 - 20) + 'vw';

      if (currentSeason === Season.SPRING) {
        const petal = el('div', { class: 'effect petal' });
        petal.style.setProperty('--x', x + 'vw');
        petal.style.setProperty('--drift', drift);
        petal.style.animation = `fall-diagonal ${duration}s linear ${delay}s infinite`;
        effects.appendChild(petal);
      } else if (currentSeason === Season.AUTUMN) {
        const leaf = el('div', { class: 'effect leaf' });
        leaf.style.setProperty('--x', x + 'vw');
        leaf.style.setProperty('--drift', drift);
        leaf.style.animation = `fall-diagonal ${duration}s linear ${delay}s infinite`;
        effects.appendChild(leaf);
      } else if (currentSeason === Season.WINTER) {
        const snow = el('div', { class: 'effect snow' });
        snow.style.setProperty('--x', x + 'vw');
        snow.style.animation = `fall-straight ${10 + Math.random()*10}s linear ${delay}s infinite`;
        effects.appendChild(snow);
      } else if (currentSeason === Season.RAINY) {
        const drop = el('div', { class: 'effect raindrop' });
        drop.style.setProperty('--x', x + 'vw');
        drop.style.animation = `fall-straight ${4 + Math.random()*4}s linear ${Math.random()*2}s infinite`;
        effects.appendChild(drop);
      } else if (currentSeason === Season.SUMMER) {
        // occasional petals to suggest a breeze
        const petal = el('div', { class: 'effect petal' });
        petal.style.setProperty('--x', x + 'vw');
        petal.style.setProperty('--drift', drift);
        petal.style.opacity = '0.7';
        petal.style.animation = `fall-diagonal ${duration + 8}s linear ${delay}s infinite`;
        effects.appendChild(petal);
      }
    }
  }

  function breezeClear() {
    const effects = document.getElementById('effects');
    if (!effects) return;
    const nodes = Array.from(effects.children);
    nodes.forEach(n => n.classList.add('breeze-out'));
    setTimeout(() => refreshSeasonEffects(), 900);
  }

  // Icons
  function icon(name) {
    const icons = {
      music: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 18V5l10-2v13"/><circle cx="7" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
      arrow-right: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
      plus: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5v14M5 12h14"/></svg>',
      trash: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
      edit: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 21v-4l11-11 4 4L7 21H3z"/><path d="M14 7l4 4"/></svg>',
      chevron-up: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m18 15-6-6-6 6"/></svg>',
      chevron-down: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m6 9 6 6 6-6"/></svg>',
      external: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v7H3V3h7"/></svg>',
      wind: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12h13a3 3 0 1 0-3-3"/><path d="M3 18h6a3 3 0 1 0 3-3"/></svg>',
      rename: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7h18M3 17h18M8 7v10M16 7v10"/></svg>',
    };
    return icons[name] || '';
  }

  // MUSIC PAGE
  const storageKey = 'sakura-music-data-v1';
  function loadData() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || { playlists: [] }; }
    catch { return { playlists: [] }; }
  }
  function saveData(data) { localStorage.setItem(storageKey, JSON.stringify(data)); }

  function renderMusic() {
    const app = $app();
    app.className = 'music season-' + currentSeason;
    app.innerHTML = '';

    const data = loadData();

    const topbar = el('div', { class: 'topbar container' }, [
      el('div', { class: 'row' }, [
        el('a', { class: 'btn ghost', href: '#/' }, '◀ Back'),
        el('div', { class: 'brand', style: { marginLeft: '12px' } }, [
          '<span class="logo"></span>', 'Sakura Music'
        ])
      ]),
      el('div', { class: 'row' }, [
        el('button', { class: 'btn primary icon', onClick: (e) => { heartPopFromEvent(e); promptNewPlaylist(); } }, [icon('plus'), 'New Playlist'])
      ])
    ]);

    const grid = el('div', { class: 'grid container', id: 'playlistGrid' });
    app.appendChild(topbar);
    app.appendChild(grid);

    renderPlaylists();

    function renderPlaylists() {
      grid.innerHTML = '';
      const d = loadData();
      if (!d.playlists.length) {
        grid.appendChild(el('div', { class: 'card glass tile-new' }, [
          el('div', {}, [
            '<div class="muted">No playlists yet</div>',
            el('button', { class: 'btn primary icon', onClick: (e) => { heartPopFromEvent(e); promptNewPlaylist(); } }, [icon('plus'), 'Create your first playlist'])
          ])
        ]));
      }

      d.playlists.forEach((p, idx) => {
        grid.appendChild(playlistCard(p, idx));
      });
    }

    function promptNewPlaylist() {
      const name = prompt('Playlist name');
      if (!name) return;
      const d = loadData();
      d.playlists.push({ id: cryptoRandomId(), name, songs: [] });
      saveData(d);
      renderPlaylists();
    }

    function playlistCard(playlist, index) {
      const card = el('div', { class: 'card glass' });

      const header = el('div', { class: 'playlist-header' }, [
        el('div', {}, [
          el('div', { class: 'playlist-title', contenteditable: 'true', spellcheck: 'false', onBlur: () => renamePlaylist(playlist.id, titleEl.textContent) }, playlist.name)
        ]),
        el('div', { class: 'row' }, [
          el('span', { class: 'muted' }, `${playlist.songs.length} songs`),
          el('button', { class: 'btn ghost', title: 'Delete playlist', onClick: () => deletePlaylist(playlist.id) }, icon('trash'))
        ])
      ]);
      const titleEl = header.querySelector('.playlist-title');

      const list = el('div', { class: 'song-list' });
      playlist.songs.forEach((s, i) => list.appendChild(songRow(playlist.id, s, i)));

      const addForm = el('div', { class: 'inputs' }, [
        el('input', { type: 'text', placeholder: 'Song title', id: `title-${playlist.id}` }),
        el('input', { type: 'url', placeholder: 'YouTube URL', id: `url-${playlist.id}` }),
        el('input', { type: 'url', placeholder: 'Cover image URL (optional)', id: `cover-${playlist.id}` }),
        el('div', { class: 'row' }, [
          el('button', { class: 'btn primary icon', onClick: (e) => { heartPopFromEvent(e); addSong(playlist.id); } }, [icon('plus'), 'Add song'])
        ])
      ]);

      card.appendChild(header);
      card.appendChild(list);
      card.appendChild(addForm);
      return card;
    }

    function songRow(playlistId, song, idx) {
      const row = el('div', { class: 'song' });
      const cover = el('img', { class: 'cover', alt: '', src: song.coverUrl || fallbackCover(song.url) });
      const main = el('div', {}, [
        el('div', { class: 'title' }, song.title),
        el('div', { class: 'url' }, truncateUrl(song.url))
      ]);
      const actions = el('div', { class: 'actions' }, [
        el('a', { class: 'btn', href: song.url, target: '_blank', rel: 'noopener', title: 'Open on YouTube' }, icon('external')),
        el('button', { class: 'btn', title: 'Move up', onClick: () => moveSong(playlistId, idx, -1) }, icon('chevron-up')),
        el('button', { class: 'btn', title: 'Move down', onClick: () => moveSong(playlistId, idx, +1) }, icon('chevron-down')),
        el('button', { class: 'btn', title: 'Edit cover', onClick: () => editCover(playlistId, song.id) }, icon('edit')),
        el('button', { class: 'btn', title: 'Delete', onClick: () => deleteSong(playlistId, song.id) }, icon('trash')),
      ]);
      row.appendChild(cover);
      row.appendChild(main);
      row.appendChild(actions);
      return row;
    }

    // Data mutations
    function renamePlaylist(id, newName) {
      const d = loadData();
      const p = d.playlists.find(p => p.id === id);
      if (!p) return;
      p.name = (newName || 'Untitled').trim();
      saveData(d);
    }

    function deletePlaylist(id) {
      if (!confirm('Delete this playlist?')) return;
      const d = loadData();
      d.playlists = d.playlists.filter(p => p.id !== id);
      saveData(d);
      renderPlaylists();
    }

    function addSong(playlistId) {
      const title = document.getElementById(`title-${playlistId}`).value.trim();
      const url = document.getElementById(`url-${playlistId}`).value.trim();
      const cover = document.getElementById(`cover-${playlistId}`).value.trim();
      if (!title || !url) return alert('Please provide both a title and a YouTube URL.');
      const d = loadData();
      const p = d.playlists.find(p => p.id === playlistId);
      if (!p) return;
      const song = { id: cryptoRandomId(), title, url, coverUrl: cover || fallbackCover(url) };
      p.songs.push(song);
      saveData(d);
      renderPlaylists();
    }

    function deleteSong(playlistId, songId) {
      const d = loadData();
      const p = d.playlists.find(p => p.id === playlistId);
      if (!p) return;
      p.songs = p.songs.filter(s => s.id !== songId);
      saveData(d);
      renderPlaylists();
    }

    function moveSong(playlistId, index, delta) {
      const d = loadData();
      const p = d.playlists.find(p => p.id === playlistId);
      if (!p) return;
      const newIndex = index + delta;
      if (newIndex < 0 || newIndex >= p.songs.length) return;
      const [item] = p.songs.splice(index, 1);
      p.songs.splice(newIndex, 0, item);
      saveData(d);
      renderPlaylists();
    }

    function editCover(playlistId, songId) {
      const url = prompt('New cover image URL');
      if (!url) return;
      const d = loadData();
      const p = d.playlists.find(p => p.id === playlistId);
      if (!p) return;
      const s = p.songs.find(s => s.id === songId);
      if (!s) return;
      s.coverUrl = url.trim();
      saveData(d);
      renderPlaylists();
    }
  }

  // Helpers
  function cryptoRandomId() {
    try {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    } catch {
      return 'id-' + Math.random().toString(36).slice(2, 10);
    }
  }

  function parseYouTubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
      if (u.searchParams.get('v')) return u.searchParams.get('v');
      const m = u.pathname.match(/\/shorts\/([\w-]+)/);
      if (m) return m[1];
      return '';
    } catch { return ''; }
  }

  function fallbackCover(url) {
    const id = parseYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  }

  function truncateUrl(u) {
    if (u.length <= 44) return u;
    return u.slice(0, 20) + '...' + u.slice(-18);
  }

})();


// Global state
let currentSeason = 'spring';
let playlists = [];
let currentPlaylist = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeDateWidget();
    initializeSeasonControls();
    initializeAppNavigation();
    initializePlaylistManagement();
    
    // Set initial season
    setSeasonTheme('spring');
});

// Date Widget Functions
function initializeDateWidget() {
    updateDateDisplay();
    // Update every minute
    setInterval(updateDateDisplay, 60000);
}

function updateDateDisplay() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('currentDay').textContent = days[now.getDay()];
    document.getElementById('currentDate').textContent = now.getDate();
    document.getElementById('currentMonthYear').textContent = `${months[now.getMonth()]} ${now.getFullYear()}`;
}

// Season Control Functions
function initializeSeasonControls() {
    const seasonBtns = document.querySelectorAll('.season-btn');
    const breezeBtn = document.getElementById('breezeBtn');
    
    seasonBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const season = btn.dataset.season;
            setSeasonTheme(season);
            
            // Update active button
            seasonBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    breezeBtn.addEventListener('click', activateBreeze);
}

function setSeasonTheme(season) {
    currentSeason = season;
    const landingPage = document.getElementById('landingPage');
    
    // Remove all season classes
    landingPage.classList.remove('spring', 'summer', 'autumn', 'winter');
    
    // Add current season class
    landingPage.classList.add(season);
    
    // Hide all seasonal elements
    document.querySelectorAll('.spring-petals, .autumn-leaves, .winter-snow, .rainy-drops').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show current season elements
    switch(season) {
        case 'spring':
            document.querySelector('.spring-petals').style.display = 'block';
            break;
        case 'summer':
            // Summer has sunshine effect via CSS
            break;
        case 'autumn':
            document.querySelector('.autumn-leaves').style.display = 'block';
            break;
        case 'winter':
            document.querySelector('.winter-snow').style.display = 'block';
            break;
    }
    
    showHeartAnimation();
}

function activateBreeze() {
    const landingPage = document.getElementById('landingPage');
    landingPage.classList.add('breeze-active');
    
    setTimeout(() => {
        landingPage.classList.remove('breeze-active');
    }, 3000);
    
    showHeartAnimation();
}

// App Navigation
function initializeAppNavigation() {
    const enterBtn = document.getElementById('enterMusicApp');
    const backBtn = document.getElementById('backToLanding');
    
    enterBtn.addEventListener('click', () => {
        showMusicApp();
        showHeartAnimation();
    });
    
    backBtn.addEventListener('click', () => {
        showLandingPage();
        showHeartAnimation();
    });
}

function showMusicApp() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('musicAppPage').classList.remove('hidden');
    renderPlaylists();
}

function showLandingPage() {
    document.getElementById('musicAppPage').classList.add('hidden');
    setTimeout(() => {
        document.getElementById('landingPage').style.display = 'block';
    }, 500);
}

// Playlist Management
function initializePlaylistManagement() {
    const createBtn = document.getElementById('createPlaylistBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');
    const cancelCreate = document.getElementById('cancelCreate');
    const confirmCreate = document.getElementById('confirmCreate');
    
    // Add song modal
    const addSongModal = document.getElementById('addSongModal');
    const closeSongModal = document.getElementById('closeSongModal');
    const cancelAddSong = document.getElementById('cancelAddSong');
    const confirmAddSong = document.getElementById('confirmAddSong');
    
    createBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('hidden');
        document.getElementById('playlistName').focus();
    });
    
    closeModal.addEventListener('click', () => modalOverlay.classList.add('hidden'));
    cancelCreate.addEventListener('click', () => modalOverlay.classList.add('hidden'));
    
    confirmCreate.addEventListener('click', createPlaylist);
    
    // Add song modal events
    closeSongModal.addEventListener('click', () => addSongModal.classList.add('hidden'));
    cancelAddSong.addEventListener('click', () => addSongModal.classList.add('hidden'));
    confirmAddSong.addEventListener('click', addSongToPlaylist);
    
    // Close modal on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
    });
    
    addSongModal.addEventListener('click', (e) => {
        if (e.target === addSongModal) addSongModal.classList.add('hidden');
    });
}

function createPlaylist() {
    const nameInput = document.getElementById('playlistName');
    const descInput = document.getElementById('playlistDescription');
    
    const name = nameInput.value.trim();
    if (!name) {
        nameInput.focus();
        return;
    }
    
    const newPlaylist = {
        id: Date.now().toString(),
        name: name,
        description: descInput.value.trim() || 'No description',
        songs: [],
        createdAt: new Date()
    };
    
    playlists.push(newPlaylist);
    
    // Clear inputs
    nameInput.value = '';
    descInput.value = '';
    
    // Close modal
    document.getElementById('modalOverlay').classList.add('hidden');
    
    // Re-render playlists
    renderPlaylists();
    
    showHeartAnimation();
}

function renderPlaylists() {
    const grid = document.getElementById('playlistsGrid');
    
    if (playlists.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>No playlists yet</h3>
                <p>Create your first playlist to start your musical journey!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = playlists.map(playlist => `
        <div class="playlist-card" data-playlist-id="${playlist.id}">
            <div class="playlist-header">
                <div class="playlist-info">
                    <h3>${playlist.name}</h3>
                    <p>${playlist.description}</p>
                    <small>${playlist.songs.length} songs</small>
                </div>
                <div class="playlist-actions">
                    <button class="action-btn add" onclick="openAddSongModal('${playlist.id}')" title="Add Song">+</button>
                    <button class="action-btn delete" onclick="deletePlaylist('${playlist.id}')" title="Delete Playlist">🗑️</button>
                </div>
            </div>
            <div class="songs-list">
                ${playlist.songs.length === 0 ? 
                    '<div class="empty-playlist">No songs yet. Add your first song!</div>' :
                    playlist.songs.map((song, index) => `
                        <div class="song-item" onclick="playSong('${song.url}')">
                            <div class="song-cover">
                                ${song.cover ? `<img src="${song.cover}" alt="${song.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` : '🎵'}
                            </div>
                            <div class="song-info">
                                <div class="song-title">${song.title}</div>
                                <div class="song-artist">${song.artist}</div>
                            </div>
                            <div class="song-actions">
                                <button class="song-action-btn" onclick="event.stopPropagation(); moveSong('${playlist.id}', ${index}, 'up')" title="Move Up">↑</button>
                                <button class="song-action-btn" onclick="event.stopPropagation(); moveSong('${playlist.id}', ${index}, 'down')" title="Move Down">↓</button>
                                <button class="song-action-btn" onclick="event.stopPropagation(); editSongCover('${playlist.id}', ${index})" title="Edit Cover">🖼️</button>
                                <button class="song-action-btn" onclick="event.stopPropagation(); deleteSong('${playlist.id}', ${index})" title="Delete">×</button>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `).join('');
}

function openAddSongModal(playlistId) {
    currentPlaylist = playlistId;
    document.getElementById('addSongModal').classList.remove('hidden');
    document.getElementById('songTitle').focus();
}

function addSongToPlaylist() {
    const title = document.getElementById('songTitle').value.trim();
    const artist = document.getElementById('songArtist').value.trim();
    const url = document.getElementById('songUrl').value.trim();
    const cover = document.getElementById('songCover').value.trim();
    
    if (!title || !artist || !url) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Validate YouTube URL
    if (!isValidYouTubeUrl(url)) {
        alert('Please enter a valid YouTube URL');
        return;
    }
    
    const playlist = playlists.find(p => p.id === currentPlaylist);
    if (playlist) {
        const newSong = {
            id: Date.now().toString(),
            title: title,
            artist: artist,
            url: url,
            cover: cover || null,
            addedAt: new Date()
        };
        
        playlist.songs.push(newSong);
        
        // Clear inputs
        document.getElementById('songTitle').value = '';
        document.getElementById('songArtist').value = '';
        document.getElementById('songUrl').value = '';
        document.getElementById('songCover').value = '';
        
        // Close modal
        document.getElementById('addSongModal').classList.add('hidden');
        
        // Re-render
        renderPlaylists();
        
        showHeartAnimation();
    }
}

function isValidYouTubeUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
}

function playSong(url) {
    window.open(url, '_blank');
    showHeartAnimation();
}

function moveSong(playlistId, songIndex, direction) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    const songs = playlist.songs;
    const newIndex = direction === 'up' ? songIndex - 1 : songIndex + 1;
    
    if (newIndex < 0 || newIndex >= songs.length) return;
    
    // Swap songs
    [songs[songIndex], songs[newIndex]] = [songs[newIndex], songs[songIndex]];
    
    renderPlaylists();
    showHeartAnimation();
}

function editSongCover(playlistId, songIndex) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    const song = playlist.songs[songIndex];
    const newCover = prompt('Enter new cover image URL:', song.cover || '');
    
    if (newCover !== null) {
        song.cover = newCover.trim() || null;
        renderPlaylists();
        showHeartAnimation();
    }
}

function deleteSong(playlistId, songIndex) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    if (confirm('Are you sure you want to delete this song?')) {
        playlist.songs.splice(songIndex, 1);
        renderPlaylists();
        showHeartAnimation();
    }
}

function deletePlaylist(playlistId) {
    if (confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
        playlists = playlists.filter(p => p.id !== playlistId);
        renderPlaylists();
        showHeartAnimation();
    }
}

// Heart Animation
function showHeartAnimation() {
    const heart = document.getElementById('heartAnimation');
    
    // Position heart at random location
    const x = Math.random() * (window.innerWidth - 100) + 50;
    const y = Math.random() * (window.innerHeight - 100) + 50;
    
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.opacity = '1';
    
    // Trigger animation
    heart.style.animation = 'none';
    setTimeout(() => {
        heart.style.animation = 'heartPop 1s ease-out';
    }, 10);
    
    // Hide after animation
    setTimeout(() => {
        heart.style.opacity = '0';
    }, 1000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        document.getElementById('modalOverlay').classList.add('hidden');
        document.getElementById('addSongModal').classList.add('hidden');
    }
    
    // Enter to submit forms
    if (e.key === 'Enter') {
        const activeModal = document.querySelector('.modal-overlay:not(.hidden)');
        if (activeModal) {
            if (activeModal.id === 'modalOverlay') {
                createPlaylist();
            } else if (activeModal.id === 'addSongModal') {
                addSongToPlaylist();
            }
        }
    }
});

// Sample data for demonstration
function loadSampleData() {
    playlists = [
        {
            id: 'sample1',
            name: 'Chill Vibes',
            description: 'Perfect for relaxing moments',
            songs: [
                {
                    id: 'song1',
                    title: 'Lofi Hip Hop',
                    artist: 'Chillhop Music',
                    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
                    cover: null
                }
            ],
            createdAt: new Date()
        }
    ];
}

// Auto-save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('sakuraMusicPlaylists', JSON.stringify(playlists));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('sakuraMusicPlaylists');
    if (saved) {
        playlists = JSON.parse(saved);
    }
}

// Load saved data on startup
window.addEventListener('load', () => {
    loadFromLocalStorage();
    if (playlists.length === 0) {
        loadSampleData();
    }
});

// Save data when leaving page
window.addEventListener('beforeunload', saveToLocalStorage);

// Auto-save every 30 seconds
setInterval(saveToLocalStorage, 30000);
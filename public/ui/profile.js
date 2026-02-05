// =======================
// Profile Data
// =======================
const profileData = {
    username: "user_name",
    playerId: "PLAYER001",
    level: 7,
    rank: "bronze", // bronze, silver, gold
    avatarSrc: "avatar.png" // default avatar image
};

// Rank colors and emoji
const rankData = {
    bronze: {
        emoji: "🥉",
        text: "BRONZE",
        color: "#cd7f32"
    },
    silver: {
        emoji: "🥈",
        text: "SILVER",
        color: "#c0c0c0"
    },
    gold: {
        emoji: "🥇",
        text: "GOLD",
        color: "#ffd700"
    }
};

// =======================
// Initialize Profile
// =======================
window.addEventListener('DOMContentLoaded', () => {
    loadProfile();

    // Optional: Load from localStorage if available
    loadFromStorage();

    // Attach avatar upload listener
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
});

// =======================
// Load Profile Data into UI
// =======================
function loadProfile() {
    // Username
    const usernameEl = document.querySelector('.username');
    if (usernameEl) usernameEl.textContent = profileData.username;

    // Player ID
    const playerIdEl = document.querySelector('.player-id');
    if (playerIdEl) playerIdEl.textContent = profileData.playerId;

    // Level
    const levelEl = document.querySelector('.stat-value');
    if (levelEl) levelEl.textContent = profileData.level;

    // Rank
    updateRank(profileData.rank);

    // Avatar
    setAvatarImage(profileData.avatarSrc);
}

// =======================
// Update Rank Display
// =======================
function updateRank(rank) {
    const rankInfo = rankData[rank] || rankData.bronze;

    const rankBadge = document.getElementById('rankBadge');
    const rankText = document.getElementById('rankText');

    if (rankBadge) {
        // Using emoji as badge
        rankBadge.innerHTML = `<div style="font-size: 40px;">${rankInfo.emoji}</div>`;
    }

    if (rankText) {
        rankText.textContent = rankInfo.text;
        rankText.style.color = rankInfo.color;
    }
}

// =======================
// Avatar Functions
// =======================
function setAvatarImage(src) {
    const avatarImage = document.getElementById('avatarImage');
    if (avatarImage) avatarImage.src = src;
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        profileData.avatarSrc = url;
        setAvatarImage(url);
        // Save avatar in localStorage
        saveProfileToStorage();
    }
}

// =======================
// Button Functions
// =======================
function editProfile() {
    console.log('Edit Profile clicked');
    alert('Edit Profile functionality coming soon!');
    // Example: open modal or navigate to edit page
    // window.location.href = 'edit-profile.html';
}

function backToMenu() {
    console.log('Back to Menu clicked');
    alert('Returning to main menu...');
    // window.location.href = 'index.html';
}

// =======================
// Profile Storage (Optional)
// =======================
function saveProfileToStorage() {
    localStorage.setItem('playerProfile', JSON.stringify(profileData));
}

function loadFromStorage() {
    const saved = localStorage.getItem('playerProfile');
    if (saved) {
        Object.assign(profileData, JSON.parse(saved));
        loadProfile();
    }
}

// =======================
// Optional: Update Profile Dynamically
// =======================
function updateProfile(newData) {
    Object.assign(profileData, newData);
    loadProfile();
    saveProfileToStorage();
}

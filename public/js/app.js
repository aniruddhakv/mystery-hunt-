// API Configuration
// For Railway backend + Vercel frontend setup
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://your-railway-app.railway.app/api'; // Replace with your Railway URL

// State Management
let currentUser = null;
let token = null;
let timerInterval = null;
let gameStartTime = null;
let html5QrCode = null;

// DOM Elements
const screens = {
    login: document.getElementById('loginScreen'),
    game: document.getElementById('gameScreen'),
    completion: document.getElementById('completionScreen'),
    admin: document.getElementById('adminScreen')
};

const modals = {
    scanner: document.getElementById('scannerModal'),
    createUser: document.getElementById('createUserModal')
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// Check if user is already logged in
function checkAuth() {
    token = localStorage.getItem('token');
    if (token) {
        fetchCurrentUser();
    } else {
        showScreen('login');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Login Form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Game Screen
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('scanBtn').addEventListener('click', openScannerModal);

    // Scanner Modal
    document.getElementById('closeScannerBtn').addEventListener('click', closeScannerModal);
    document.getElementById('submitManualQR').addEventListener('click', handleManualQR);

    // Completion Screen
    document.getElementById('backToLoginBtn').addEventListener('click', handleLogout);

    // Admin Screen
    document.getElementById('adminLogoutBtn').addEventListener('click', handleLogout);
    document.getElementById('createUserBtn').addEventListener('click', openCreateUserModal);
    document.getElementById('createUserForm').addEventListener('submit', handleCreateUser);
    document.getElementById('refreshUsersBtn').addEventListener('click', loadUsers);

    // Create User Modal
    document.getElementById('closeCreateUserBtn').addEventListener('click', closeCreateUserModal);
    document.getElementById('cancelCreateUserBtn').addEventListener('click', closeCreateUserModal);

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showError('loginError', 'Please enter username and password');
        return;
    }
    
    showLoading(true);
    
    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        token = data.token;
        currentUser = data.user;
        localStorage.setItem('token', token);
        
        if (currentUser.isAdmin) {
            showScreen('admin');
            loadUsers();
        } else {
            if (currentUser.isGameCompleted) {
                showCompletionScreen(currentUser.totalTime);
            } else {
                showScreen('game');
                loadGameData();
            }
        }
        
        document.getElementById('loginForm').reset();
    } catch (error) {
        showError('loginError', error.message);
    } finally {
        showLoading(false);
    }
}

async function fetchCurrentUser() {
    try {
        const data = await apiCall('/auth/me');
        currentUser = data;
        
        if (currentUser.isAdmin) {
            showScreen('admin');
            loadUsers();
        } else {
            if (currentUser.isGameCompleted) {
                showCompletionScreen(currentUser.totalTime);
            } else {
                showScreen('game');
                loadGameData();
            }
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
    }
}

function handleLogout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    stopTimer();
    showScreen('login');
}

// Game Functions
async function loadGameData() {
    showLoading(true);
    
    try {
        const data = await apiCall('/game/clue');
        
        if (data.completed) {
            showCompletionScreen(data.totalTime);
            return;
        }
        
        // Update UI
        document.getElementById('currentLevel').textContent = data.level;
        document.getElementById('totalLevels').textContent = data.totalLevels;
        document.getElementById('locationName').textContent = data.location;
        document.getElementById('clueText').textContent = data.clue;
        document.getElementById('hintText').textContent = `💡 Hint: ${data.hint}`;
        
        // Update progress
        const progress = ((data.level - 1) / data.totalLevels) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressPercent').textContent = Math.round(progress);
        
        // Generate levels grid
        generateLevelsGrid(data.level, data.totalLevels);
        
        // Start timer
        if (data.gameStartTime) {
            gameStartTime = new Date(data.gameStartTime);
            startTimer();
        }
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function generateLevelsGrid(currentLevel, totalLevels) {
    const grid = document.getElementById('levelsGrid');
    grid.innerHTML = '';
    
    for (let i = 1; i <= totalLevels; i++) {
        const item = document.createElement('div');
        item.className = 'level-item';
        item.textContent = i;
        
        if (i < currentLevel) {
            item.classList.add('completed');
            item.textContent = '✓';
        } else if (i === currentLevel) {
            item.classList.add('current');
        } else {
            item.classList.add('locked');
            item.textContent = '🔒';
        }
        
        grid.appendChild(item);
    }
}

function startTimer() {
    stopTimer();
    
    timerInterval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - gameStartTime) / 1000);
        document.getElementById('timer').textContent = formatTime(elapsed);
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Modal Functions
function openModal(modalName) {
    const modal = modals[modalName];
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalName) {
    const modal = modals[modalName];
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeAllModals() {
    Object.values(modals).forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
    stopQRScanner();
}

// QR Scanner Functions
function openScannerModal() {
    openModal('scanner');
    setTimeout(() => startQRScanner(), 300);
}

function closeScannerModal() {
    stopQRScanner();
    closeModal('scanner');
    document.getElementById('manualQRInput').value = '';
}

async function startQRScanner() {
    const statusEl = document.getElementById('scannerStatus');

    try {
        statusEl.textContent = 'Starting camera...';
        statusEl.style.color = 'var(--warning-color)';

        html5QrCode = new Html5QrcodeScanner("qrReader", {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true
        });

        html5QrCode.render(onScanSuccess, onScanError);

        statusEl.textContent = 'Camera ready! Position QR code in the frame';
        statusEl.style.color = 'var(--success-color)';
    } catch (error) {
        console.error('Scanner error:', error);
        statusEl.textContent = 'Camera not available. Use manual entry below.';
        statusEl.style.color = 'var(--danger-color)';
        showToast('Camera access denied. Please use manual entry.', 'warning');
    }
}

function stopQRScanner() {
    if (html5QrCode) {
        try {
            html5QrCode.clear();
        } catch (err) {
            console.error('Stop scanner error:', err);
        }
        html5QrCode = null;
    }
}

async function onScanSuccess(decodedText) {
    stopQRScanner();
    closeScannerModal();
    await submitQRCode(decodedText);
}

function onScanError(error) {
    // Ignore scan errors (they happen frequently during scanning)
}

async function handleManualQR() {
    const qrCode = document.getElementById('manualQRInput').value.trim();

    if (!qrCode) {
        showToast('Please enter a QR code', 'error');
        return;
    }

    stopQRScanner();
    closeScannerModal();
    await submitQRCode(qrCode);
}

async function submitQRCode(qrCode) {
    showLoading(true);

    try {
        const data = await apiCall('/game/scan', {
            method: 'POST',
            body: JSON.stringify({ qrCode })
        });

        if (data.completed) {
            stopTimer();
            showCompletionScreen(data.totalTime);
            showToast(data.message, 'success');
        } else {
            showToast(data.message, 'success');
            await loadGameData();
        }

        document.getElementById('manualQRInput').value = '';
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function showCompletionScreen(totalTimeSeconds) {
    stopTimer();
    document.getElementById('finalTime').textContent = formatTime(totalTimeSeconds);
    showScreen('completion');
}

// Admin Functions
function openCreateUserModal() {
    openModal('createUser');
    document.getElementById('createUserForm').reset();
    hideError('createUserError');
    hideSuccess('createUserSuccess');
}

function closeCreateUserModal() {
    closeModal('createUser');
    document.getElementById('createUserForm').reset();
    hideError('createUserError');
    hideSuccess('createUserSuccess');
}

async function handleCreateUser(e) {
    e.preventDefault();

    const username = document.getElementById('newUsername').value.trim();
    const password = document.getElementById('newPassword').value;

    if (!username || !password) {
        showError('createUserError', 'Username and password required');
        return;
    }

    if (password.length < 4) {
        showError('createUserError', 'Password must be at least 4 characters');
        return;
    }

    showLoading(true);
    hideError('createUserError');
    hideSuccess('createUserSuccess');

    try {
        await apiCall('/admin/users', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });

        showSuccess('createUserSuccess', `User "${username}" created successfully!`);

        setTimeout(() => {
            closeCreateUserModal();
            loadUsers();
        }, 1500);

    } catch (error) {
        showError('createUserError', error.message);
    } finally {
        showLoading(false);
    }
}

async function loadUsers() {
    showLoading(true);

    try {
        const users = await apiCall('/admin/users');
        updateAdminStats(users);
        displayUsers(users);
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function updateAdminStats(users) {
    const totalUsers = users.filter(u => !u.isAdmin).length;
    const activeUsers = users.filter(u => !u.isAdmin && u.gameStartTime && !u.isGameCompleted).length;
    const completedUsers = users.filter(u => !u.isAdmin && u.isGameCompleted).length;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('completedUsers').textContent = completedUsers;
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');

    const playerUsers = users.filter(u => !u.isAdmin);

    if (playerUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No players yet. Create your first player!</td></tr>';
        return;
    }

    tbody.innerHTML = playerUsers.map(user => `
        <tr>
            <td><strong>${user.username}</strong></td>
            <td><span class="level-badge">${user.currentLevel}/12</span></td>
            <td>
                <span class="status-badge ${getStatusClass(user)}">
                    ${getStatusText(user)}
                </span>
            </td>
            <td>${user.totalTime ? formatTime(user.totalTime) : '-'}</td>
            <td>
                <label class="toggle-switch">
                    <input type="checkbox" ${user.isActive ? 'checked' : ''}
                           onchange="toggleUserActive('${user._id}', this.checked)">
                    <span class="toggle-slider"></span>
                </label>
            </td>
            <td class="action-buttons">
                <button class="btn btn-secondary btn-small" onclick="resetUser('${user._id}')" title="Reset Progress">
                    🔄 Reset
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteUser('${user._id}')" title="Delete User">
                    🗑️ Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusClass(user) {
    if (user.isGameCompleted) return 'status-completed';
    if (user.gameStartTime) return 'status-playing';
    return 'status-not-started';
}

function getStatusText(user) {
    if (user.isGameCompleted) return 'Completed';
    if (user.gameStartTime) return 'Playing';
    return 'Not Started';
}

async function toggleUserActive(userId, isActive) {
    try {
        await apiCall(`/admin/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ isActive })
        });
        
        showToast(`User ${isActive ? 'activated' : 'deactivated'}`, 'success');
    } catch (error) {
        showToast(error.message, 'error');
        loadUsers();
    }
}

async function resetUser(userId) {
    if (!confirm('Are you sure you want to reset this user\'s progress?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        await apiCall(`/admin/users/${userId}/reset`, {
            method: 'POST'
        });
        
        showToast('User progress reset successfully', 'success');
        loadUsers();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    showLoading(true);
    
    try {
        await apiCall(`/admin/users/${userId}`, {
            method: 'DELETE'
        });
        
        showToast('User deleted successfully', 'success');
        loadUsers();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// UI Helper Functions
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.add('show');
}

function hideError(elementId) {
    const element = document.getElementById(elementId);
    element.classList.remove('show');
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.add('show');
}

function hideSuccess(elementId) {
    const element = document.getElementById(elementId);
    element.classList.remove('show');
}

// Make admin functions global for onclick handlers
window.toggleUserActive = toggleUserActive;
window.resetUser = resetUser;
window.deleteUser = deleteUser;


// State Management
let appState = {
    isOnline: true,
    currentUser: null,
    currentLanguage: 'en',
    screenings: [],
    rightEyePhoto: null,
    leftEyePhoto: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    }

    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('chw_user');
    if (savedUser) {
        appState.currentUser = JSON.parse(savedUser);
        showScreen('homeScreen');
    }

    // Load saved language
    const savedLang = localStorage.getItem('chw_language') || 'en';
    changeLanguage(savedLang);

    // Update sync status periodically
    setInterval(updateSyncStatus, 30000);
});

// Screen Management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show selected screen
    document.getElementById(screenId).classList.add('active');

    // Update bottom nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Reset workflow if showing new screening
    if (screenId === 'newScreeningScreen') {
        resetScreeningWorkflow();
    }
}

// Login Function
function login() {
    const phone = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;

    if (!phone || !password) {
        alert('Please enter phone number and password');
        return;
    }

    // Simulate login (in real app, this would hit an API)
    const user = {
        name: 'Grace Adamu',
        phone: phone,
        lga: 'Kano North',
        state: 'Kano'
    };

    appState.currentUser = user;
    localStorage.setItem('chw_user', JSON.stringify(user));

    // Update UI
    document.getElementById('userName').textContent = user.name;

    // Navigate to home screen
    showScreen('homeScreen');
}

// Language Management
function changeLanguage(lang) {
    appState.currentLanguage = lang;
    localStorage.setItem('chw_language', lang);

    // Update body class for CSS language switching
    document.body.classList.remove('lang-en', 'lang-ha');
    document.body.classList.add(`lang-${lang}`);

    // Update select dropdown
    document.getElementById('language').value = lang;
}

// Screening Workflow
function resetScreeningWorkflow() {
    // Reset to step 1
    document.querySelectorAll('.workflow-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');

    // Clear form data
    document.getElementById('patientName').value = '';
    document.getElementById('patientAge').value = '';
    document.getElementById('patientGender').value = '';
    document.getElementById('patientPhone').value = '';
    document.getElementById('screeningNotes').value = '';

    // Reset photos
    appState.rightEyePhoto = null;
    appState.leftEyePhoto = null;

    document.getElementById('rightEyeBox').classList.remove('captured');
    document.getElementById('leftEyeBox').classList.remove('captured');

    const rightPlaceholder = document.querySelector('#rightEyeBox .photo-placeholder');
    const leftPlaceholder = document.querySelector('#leftEyeBox .photo-placeholder');

    if (rightPlaceholder) {
        rightPlaceholder.innerHTML = '<span class="text-en">Right Eye<br>Tap to Capture</span><span class="text-ha" style="display:none;">Ido Na Dama<br>Danna don Ɗauka</span>';
    }
    if (leftPlaceholder) {
        leftPlaceholder.innerHTML = '<span class="text-en">Left Eye<br>Tap to Capture</span><span class="text-ha" style="display:none;">Ido Na Hagu<br>Danna don Ɗauka</span>';
    }

    document.getElementById('analyzeBtn').disabled = true;
}

function nextStep(stepNumber) {
    // Validate current step before advancing
    if (stepNumber === 2) {
        const name = document.getElementById('patientName').value;
        const age = document.getElementById('patientAge').value;
        const gender = document.getElementById('patientGender').value;

        if (!name || !age || !gender) {
            alert(appState.currentLanguage === 'en'
                ? 'Please fill in all required fields'
                : 'Da fatan a cika duk wuraren da ake buƙata');
            return;
        }
    }

    if (stepNumber === 3) {
        if (!appState.rightEyePhoto || !appState.leftEyePhoto) {
            alert(appState.currentLanguage === 'en'
                ? 'Please capture photos of both eyes'
                : 'Da fatan a ɗauki hotunan idanu biyu');
            return;
        }

        // Show analysis progress
        document.getElementById('analysisProgress').style.display = 'block';
        document.getElementById('analysisResults').style.display = 'none';

        // Simulate AI analysis (2-3 seconds)
        setTimeout(() => {
            document.getElementById('analysisProgress').style.display = 'none';
            document.getElementById('analysisResults').style.display = 'block';
        }, 2500);
    }

    // Hide all steps
    document.querySelectorAll('.workflow-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show target step
    document.getElementById(`step${stepNumber}`).classList.add('active');

    // Scroll to top
    window.scrollTo(0, 0);
}

// Photo Capture
function handlePhotoCapture(eye, input) {
    const file = input.files[0];
    if (!file) return;

    // In real app, this would compress and store the image
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageData = e.target.result;

        if (eye === 'right') {
            appState.rightEyePhoto = imageData;
            document.getElementById('rightEyeBox').classList.add('captured');
            document.querySelector('#rightEyeBox .photo-placeholder').innerHTML =
                `<img src="${imageData}" class="photo-preview" alt="Right Eye">`;
        } else {
            appState.leftEyePhoto = imageData;
            document.getElementById('leftEyeBox').classList.add('captured');
            document.querySelector('#leftEyeBox .photo-placeholder').innerHTML =
                `<img src="${imageData}" class="photo-preview" alt="Left Eye">`;
        }

        // Enable analyze button if both photos captured
        if (appState.rightEyePhoto && appState.leftEyePhoto) {
            document.getElementById('analyzeBtn').disabled = false;
        }

        // Simulate quality check
        setTimeout(() => {
            const message = appState.currentLanguage === 'en'
                ? '✓ Good quality image'
                : '✓ Hoto mai inganci';
            showToast(message);
        }, 500);
    };
    reader.readAsDataURL(file);
}

// Submit Screening
function submitScreening() {
    const screening = {
        id: Date.now(),
        patientName: document.getElementById('patientName').value,
        patientAge: document.getElementById('patientAge').value,
        patientGender: document.getElementById('patientGender').value,
        patientPhone: document.getElementById('patientPhone').value,
        notes: document.getElementById('screeningNotes').value,
        rightEyePhoto: appState.rightEyePhoto,
        leftEyePhoto: appState.leftEyePhoto,
        result: 'Possible Cataract - Right Eye',
        confidence: 87,
        date: new Date().toISOString(),
        synced: appState.isOnline
    };

    // Store in localStorage (in real app, this would sync to server)
    appState.screenings.push(screening);
    localStorage.setItem('chw_screenings', JSON.stringify(appState.screenings));

    // Update stats
    updateStats();

    // Show success message
    const message = appState.currentLanguage === 'en'
        ? '✓ Screening submitted successfully!'
        : '✓ An tura bincike cikin nasara!';
    showToast(message);

    // Return to home screen
    setTimeout(() => {
        showScreen('homeScreen');
    }, 1500);
}

// Update Stats
function updateStats() {
    const screenings = JSON.parse(localStorage.getItem('chw_screenings') || '[]');
    const total = screenings.length;

    // Calculate this week (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = screenings.filter(s => new Date(s.date) > weekAgo).length;

    // Update demo values (in real app, these would come from API)
    document.getElementById('totalScreenings').textContent = 47 + total;
    document.getElementById('thisWeek').textContent = 12 + thisWeek;
}

// Online/Offline Toggle (Demo)
function toggleOnline() {
    appState.isOnline = !appState.isOnline;

    const statusDot = document.getElementById('syncStatus');
    const syncText = document.getElementById('syncText');
    const toggleBtn = document.getElementById('connectToggleText');

    if (appState.isOnline) {
        statusDot.classList.remove('offline');
        statusDot.title = 'Online';

        if (appState.currentLanguage === 'en') {
            syncText.innerHTML = '<span class="text-en">✓ Synced just now</span>';
            toggleBtn.textContent = 'Go Offline (Demo)';
        } else {
            syncText.innerHTML = '<span class="text-ha">✓ An aika bayanai yanzu</span>';
            toggleBtn.textContent = 'Kashe hanyar sadarwa (Demo)';
        }

        showToast(appState.currentLanguage === 'en'
            ? 'Back online - syncing data...'
            : 'An dawo kan layi - ana aika bayanai...');

        // Simulate sync
        setTimeout(() => {
            showToast(appState.currentLanguage === 'en'
                ? '✓ All data synced'
                : '✓ An aika duk bayanai');
        }, 2000);

    } else {
        statusDot.classList.add('offline');
        statusDot.title = 'Offline';

        if (appState.currentLanguage === 'en') {
            syncText.innerHTML = '<span class="text-en">⚠ Offline - will sync when connected</span>';
            toggleBtn.textContent = 'Go Online (Demo)';
        } else {
            syncText.innerHTML = '<span class="text-ha">⚠ Babu hanyar sadarwa - za a aika idan an samu hanyar sadarwa</span>';
            toggleBtn.textContent = 'Kunna hanyar sadarwa (Demo)';
        }

        showToast(appState.currentLanguage === 'en'
            ? 'Working offline - data will sync when connected'
            : 'Ana aiki ba tare da hanyar sadarwa ba - za a aika bayanai idan an samu hanyar sadarwa');
    }
}

// Update Sync Status
function updateSyncStatus() {
    if (!appState.isOnline) return;

    const now = new Date();
    const syncText = document.getElementById('syncText');

    if (appState.currentLanguage === 'en') {
        syncText.innerHTML = '<span class="text-en">✓ Synced ' + getTimeAgo(now) + '</span>';
    } else {
        syncText.innerHTML = '<span class="text-ha">✓ An aika bayanai ' + getTimeAgo(now) + '</span>';
    }
}

// Helper: Time Ago
function getTimeAgo(date) {
    const minutes = Math.floor((Date.now() - date) / 60000);

    if (appState.currentLanguage === 'en') {
        if (minutes < 1) return 'just now';
        if (minutes === 1) return '1 min ago';
        if (minutes < 60) return `${minutes} mins ago`;
        const hours = Math.floor(minutes / 60);
        if (hours === 1) return '1 hour ago';
        return `${hours} hours ago`;
    } else {
        if (minutes < 1) return 'yanzu';
        if (minutes === 1) return 'minti 1 da suka wuce';
        if (minutes < 60) return `minti ${minutes} da suka wuce`;
        const hours = Math.floor(minutes / 60);
        if (hours === 1) return 'awa 1 da suka wuce';
        return `awa ${hours} da suka wuce`;
    }
}

// Toast Notifications
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #2C3E50;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease;
        max-width: 80%;
        text-align: center;
    `;

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Initialize stats on load
updateStats();
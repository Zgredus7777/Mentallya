// ======================
// GŁÓWNE FUNKCJE APLIKACJI
// ======================

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    console.log('Inicjalizacja aplikacji...');
    initNavigation();
    initModals();
    initForms();
    checkAuthStatus();
    
    // Inicjalizacja specyficzna dla stron
    if (document.getElementById('tests-grid')) {
        initTestFilters();
        loadTests();
    }
    
    if (document.getElementById('premium-cards')) {
        initPremiumButtons();
    }
    
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
      // Inicjalizacja Emotion Tracker
    if (document.getElementById('emotion-section')) {
        initEmotionTracker();
  }
}


// ======================
// SYSTEM NAWIGACJI
// ======================

function initNavigation() {
    console.log('Inicjalizacja nawigacji...');
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
    
    // Zamknij menu po kliknięciu linku (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            const hamburger = document.querySelector('.hamburger');
            if (hamburger) hamburger.classList.remove('active');
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) navLinks.classList.remove('active');
        });
    });
}
// ======================
// EMOTION TRACKER MODULE
// ======================
const EMOTIONS = ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];
let emotionInterval;
let emotionData = [];
let isTracking = false;

function initEmotionTracker() {
  if (!document.getElementById('emotion-section')) return;
  
  console.log('Inicjalizacja modułu Emotion Tracker...');
  
  // Elementy UI
  const consentBtn = document.getElementById('consentBtn');
  const startBtn = document.getElementById('startEmotionBtn');
  const stopBtn = document.getElementById('stopEmotionBtn');
  
  // Obsługa zdarzeń
  consentBtn.addEventListener('click', handleConsent);
  startBtn.addEventListener('click', startTracking);
  stopBtn.addEventListener('click', stopTracking);
}

async function handleConsent() {
  try {
    // Ukryj banner zgody
    document.querySelector('.consent-banner').style.display = 'none';
    
    // Włącz przyciski
    document.getElementById('startEmotionBtn').disabled = false;
    
    // Załaduj modele AI
    await loadModels();
    
    // Przygotuj wideo
    const video = document.getElementById('videoEl');
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
    
  } catch (error) {
    console.error('Błąd inicjalizacji tracker emocji:', error);
    showAlert('Nie udało się uzyskać dostępu do kamery', 'error');
  }
}

async function loadModels() {
  try {
    // Ścieżki względne do folderu models
    const modelPath = '/models';
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
      faceapi.nets.faceExpressionNet.loadFromUri(modelPath)
    ]);
    
    console.log('Modele AI załadowane!');
    return true;
  } catch (error) {
    console.error('Błąd ładowania modeli:', error);
    showAlert('Błąd ładowania modułu analizy emocji', 'error');
    return false;
  }
}

async function startTracking() {
  if (isTracking) return;
  
  const video = document.getElementById('videoEl');
  const startBtn = document.getElementById('startEmotionBtn');
  const stopBtn = document.getElementById('stopEmotionBtn');
  
  // Reset danych
  emotionData = [];
  isTracking = true;
  startBtn.disabled = true;
  stopBtn.disabled = false;
  
  // Ukryj wyniki (jeśli były widoczne)
  document.getElementById('emotionResults').classList.add('hidden');
  
  console.log('Rozpoczęto śledzenie emocji...');
  
  // Główna pętla analizy
  emotionInterval = setInterval(async () => {
    if (!isTracking) return;
    
    try {
      const detections = await faceapi.detectSingleFace(
        video, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceExpressions();
      
      if (detections) {
        processEmotions(detections.expressions);
      }
    } catch (error) {
      console.error('Błąd detekcji emocji:', error);
    }
  }, 1000); // Analiza co 1 sekundę
}

function processEmotions(expressions) {
  const timestamp = Date.now();
  const dataPoint = { timestamp, expressions };
  
  // Zapisz dane
  emotionData.push(dataPoint);
  
  // Aktualizuj UI
  updateEmotionChart(expressions);
}

function updateEmotionChart(expressions) {
  const chart = document.getElementById('emotionChart');
  chart.innerHTML = '';
  
  EMOTIONS.forEach(emotion => {
    const value = expressions[emotion] * 100;
    const bar = document.createElement('div');
    bar.className = 'emotion-bar';
    bar.style.background = getEmotionColor(emotion);
    bar.style.width = `${value}%`;
    bar.innerHTML = `<span>${emotion}: ${value.toFixed(1)}%</span>`;
    chart.appendChild(bar);
  });
}

function stopTracking() {
  if (!isTracking) return;
  
  isTracking = false;
  clearInterval(emotionInterval);
  
  // Wyłącz kamerę
  const video = document.getElementById('videoEl');
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }
  
  // Aktualizuj przyciski
  document.getElementById('startEmotionBtn').disabled = false;
  document.getElementById('stopEmotionBtn').disabled = true;
  
  // Wygeneruj raport
  generateEmotionReport();
  
  console.log('Zatrzymano śledzenie emocji. Zebrano punktów danych:', emotionData.length);
}

function generateEmotionReport() {
  const resultsContainer = document.getElementById('emotionResults');
  const summaryElement = document.getElementById('emotionSummary');
  
  // Oblicz średnie emocje
  const avgEmotions = {};
  EMOTIONS.forEach(e => avgEmotions[e] = 0);
  
  emotionData.forEach(data => {
    EMOTIONS.forEach(e => {
      avgEmotions[e] += data.expressions[e];
    });
  });
  
  EMOTIONS.forEach(e => {
    avgEmotions[e] = (avgEmotions[e] / emotionData.length * 100).toFixed(1);
  });
  
  // Znajdź dominującą emocję
  const dominantEmotion = Object.entries(avgEmotions)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // Wyświetl wyniki
  summaryElement.innerHTML = `
    <p>Twoje dominujące emocje podczas testu:</p>
    <div class="dominant-emotion">
      <span class="emotion-badge" style="background:${getEmotionColor(dominantEmotion)}">
        ${dominantEmotion} (${avgEmotions[dominantEmotion]}%)
      </span>
    </div>
    <div class="emotion-stats">
      ${EMOTIONS.map(e => `
        <div class="stat-item">
          <span class="emotion-label">${e}:</span>
          <span class="emotion-value">${avgEmotions[e]}%</span>
        </div>
      `).join('')}
    </div>
  `;
  
  // Pokaż sekcję wyników
  resultsContainer.classList.remove('hidden');
  
  // TODO: Tutaj dodaj kod do rysowania wykresu czasowego
  // na elemencie <canvas id="emotionTimeline">
}

function getEmotionColor(emotion) {
  const colors = {
    happy: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
    neutral: 'linear-gradient(90deg, #9E9E9E, #BDBDBD)',
    sad: 'linear-gradient(90deg, #2196F3, #03A9F4)',
    angry: 'linear-gradient(90deg, #F44336, #FF5722)',
    fearful: 'linear-gradient(90deg, #673AB7, #9C27B0)',
    disgusted: 'linear-gradient(90deg, #795548, #5D4037)',
    surprised: 'linear-gradient(90deg, #FF9800, #FFC107)'
  };
  return colors[emotion] || '#000';
}

// ======================
// SYSTEM AUTENTYKACJI
// ======================

function checkAuthStatus() {
    console.log('Sprawdzanie statusu autentykacji...');
    const authSection = document.querySelector('.auth-section');
    if (!authSection) {
        console.warn('Element auth-section nie znaleziony');
        return;
    }
    
    const user = getCurrentUser();
    
    if (user) {
        console.log('Użytkownik zalogowany:', user.email);
        authSection.innerHTML = `
            <button id="accountBtn" class="btn-outline">Moje Konto</button>
            <button id="logoutBtnHeader" class="btn-outline">Wyloguj</button>
        `;
        
        document.getElementById('accountBtn').addEventListener('click', () => {
            console.log('Przejdź do konta');
            window.location.href = 'account.html';
        });
        
        document.getElementById('logoutBtnHeader').addEventListener('click', handleLogout);
    } else {
        console.log('Brak zalogowanego użytkownika');
        authSection.innerHTML = `
            <button id="loginBtn" class="btn-outline">Zaloguj</button>
            <button id="registerBtn" class="btn">Rejestracja</button>
        `;
        
        // Inicjalizacja przycisków logowania/rejestracji
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        
        if (loginBtn) loginBtn.addEventListener('click', () => openModal('loginModal'));
        if (registerBtn) registerBtn.addEventListener('click', () => openModal('registerModal'));
    }
}

function handleLogin() {
    console.log('Próba logowania...');
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!email || !password) {
        showAlert('Proszę wypełnić wszystkie pola', 'error');
        return;
    }
    
    try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        console.log('Zarejestrowani użytkownicy:', users);
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            console.log('Logowanie udane:', email);
            localStorage.setItem('currentUser', JSON.stringify(user));
            closeModal('loginModal');
            checkAuthStatus();
            showAlert(`Witaj ponownie, ${user.name}!`, 'success');
            
            // Przekieruj na account.html jeśli jesteś na stronie logowania
            if (window.location.pathname.includes('login.html') || 
                window.location.pathname.includes('index.html')) {
                setTimeout(() => window.location.href = 'account.html', 1500);
            }
        } else {
            console.log('Nieprawidłowe dane logowania dla:', email);
            showAlert('Nieprawidłowy email lub hasło', 'error');
        }
    } catch (error) {
        console.error('Błąd podczas logowania:', error);
        showAlert('Wystąpił błąd podczas logowania', 'error');
    }
}

function handleRegistration() {
    console.log('Próba rejestracji...');
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('regConfirmPassword').value.trim();
    
    // Walidacja
    if (!name || !email || !password || !confirmPassword) {
        showAlert('Proszę wypełnić wszystkie pola', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Hasła nie są identyczne', 'error');
        return;
    }
    
    if (password.length < 8) {
        showAlert('Hasło musi mieć co najmniej 8 znaków', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showAlert('Proszę podać poprawny adres email', 'error');
        return;
    }
    
    try {
        // Pobierz istniejących użytkowników lub utwórz nową tablicę
        const users = JSON.parse(localStorage.getItem('users')) || [];
        console.log('Obecni użytkownicy:', users);
        
        // Sprawdź czy użytkownik już istnieje
        const userExists = users.some(u => u.email === email);
        if (userExists) {
            showAlert('Użytkownik o podanym emailu już istnieje', 'error');
            return;
        }
        
        // Utwórz nowego użytkownika
        const newUser = {
            name,
            email,
            password,
            isPremium: false,
            premiumExpiry: null,
            premiumPlan: null,
            joinDate: new Date().toISOString()
        };
        
        // Dodaj użytkownika i zapisz
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        console.log('Zarejestrowano nowego użytkownika:', newUser);
        showAlert(`Dziękujemy za rejestrację, ${name}!`, 'success');
        
        // Zamknij modal rejestracji
        closeModal('registerModal');
        
        // Przekieruj po krótkim opóźnieniu
        setTimeout(() => {
            if (window.location.pathname.includes('register.html') || 
                window.location.pathname.includes('index.html')) {
                window.location.href = 'account.html';
            }
        }, 1000);
        
    } catch (error) {
        console.error('Błąd podczas rejestracji:', error);
        showAlert('Wystąpił błąd podczas rejestracji', 'error');
    }
}

function handleLogout() {
    const user = getCurrentUser();
    if (user) {
        console.log('Wylogowywanie użytkownika:', user.email);
    }
    localStorage.removeItem('currentUser');
    checkAuthStatus();
    showAlert('Zostałeś wylogowany', 'success');
    
    // Jeśli jesteś na stronie konta, przekieruj na główną
    if (window.location.pathname.includes('account.html')) {
        setTimeout(() => window.location.href = 'index.html', 1000);
    }
}

function getCurrentUser() {
    try {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Błąd podczas pobierania aktualnego użytkownika:', error);
        return null;
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ======================
// SYSTEM MODALI
// ======================

function initModals() {
    console.log('Inicjalizacja modalów...');
    // Inicjalizacja podstawowych modalów
    const modals = ['loginModal', 'registerModal', 'privacyModal', 'termsModal', 
                   'testModal', 'userPanelModal', 'paymentModal', 
                   'changePasswordModal', 'deleteAccountModal'];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Zamknij przyciskiem X
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modalId));
        }
    });
    
    // Zamknij kliknięciem poza modalem
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Przełączanie między loginem a rejestracją
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (showRegister) showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('loginModal');
        openModal('registerModal');
    });
    
    if (showLogin) showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('registerModal');
        openModal('loginModal');
    });
    
    // Linki do polityki prywatności i regulaminu
    const privacyLink = document.getElementById('privacyLink');
    const termsLink = document.getElementById('termsLink');
    
    if (privacyLink) privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('privacyModal');
    });
    
    if (termsLink) termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('termsModal');
    });
}

function openModal(modalId) {
    console.log('Otwieranie modala:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        console.warn('Modal nie znaleziony:', modalId);
    }
}

function closeModal(modalId) {
    console.log('Zamykanie modala:', modalId);
    const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ======================
// SYSTEM FORMULARZY
// ======================

function initForms() {
    console.log('Inicjalizacja formularzy...');
    // Formularz logowania
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Formularz rejestracji
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistration();
        });
    }
    
    // Formularz kontaktowy
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            if (!name || !email || !message) {
                showAlert('Proszę wypełnić wszystkie pola formularza', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showAlert('Proszę podać poprawny adres email', 'error');
                return;
            }
            
            showAlert('Dziękujemy za wiadomość! Odezwiemy się najszybciej jak to możliwe.', 'success');
            contactForm.reset();
        });
    }
}
// ======================
// FUNKCJE POMOCNICZE
// ======================

function showAlert(message, type = 'info') {
    console.log(`Alert [${type}]: ${message}`);
    // Tworzymy element alertu jeśli nie istnieje
    let alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alertContainer';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '20px';
        alertContainer.style.right = '20px';
        alertContainer.style.zIndex = '9999';
        document.body.appendChild(alertContainer);
    }
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.innerHTML = `
        <p>${message}</p>
        <span class="close-alert">&times;</span>
    `;
    
    alertContainer.appendChild(alertElement);
    
    // Auto-ukrywanie po 5 sekundach
    setTimeout(() => {
        alertElement.style.opacity = '0';
        setTimeout(() => alertElement.remove(), 300);
    }, 5000);
    
    // Możliwość ręcznego zamknięcia
    alertElement.querySelector('.close-alert').addEventListener('click', () => {
        alertElement.remove();
    });
}

function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'none';
}

// ======================
// EKSPORTUJ FUNKCJE DLA INNYCH PLIKÓW
// ======================

window.openModal = openModal;
window.closeModal = closeModal;
window.getCurrentUser = getCurrentUser;
window.checkAuthStatus = checkAuthStatus;
window.showAlert = showAlert;
window.showLoading = showLoading;
window.hideLoading = hideLoading;

console.log('Aplikacja zainicjalizowana');
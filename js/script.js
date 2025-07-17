document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja aplikacji
    initApp();
});

function initApp() {
    // Sprawdzenie preferowanego trybu kolorów
    checkColorSchemePreference();
    
    // Inicjalizacja komponentów
    initNavigation();
    initModals();
    initTestFilters();
    loadTests();
    initForms();
    checkAuthStatus();
    
    // Symulacja ładowania
    simulateLoading();
}

// Funkcje zarządzania interfejsem użytkownika
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Zamknij menu po kliknięciu linku (na mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

function initModals() {
    // Modal logowania
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const showRegister = document.getElementById('showRegister');
    
    // Modal rejestracji
    const registerBtn = document.getElementById('registerBtn');
    const registerModal = document.getElementById('registerModal');
    const showLogin = document.getElementById('showLogin');
    
    // Inne modale
    const privacyLink = document.getElementById('privacyLink');
    const privacyModal = document.getElementById('privacyModal');
    const termsLink = document.getElementById('termsLink');
    const termsModal = document.getElementById('termsModal');
    
    // Funkcja pomocnicza do otwierania modalów
    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Funkcja pomocnicza do zamykania modalów
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Obsługa kliknięć przycisków
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal(loginModal));
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => openModal(registerModal));
    }
    
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            openModal(loginModal);
        });
    }
    
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(privacyModal);
        });
    }
    
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(termsModal);
        });
    }
    
    // Zamknij modal po kliknięciu na X
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Zamknij modal po kliknięciu poza nim
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
}

function initTestFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Usuń aktywną klasę ze wszystkich przycisków
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Dodaj aktywną klasę do klikniętego przycisku
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterTests(filter);
        });
    });
}

function filterTests(filter) {
    const testCards = document.querySelectorAll('.test-card');
    
    testCards.forEach(card => {
        switch(filter) {
            case 'all':
                card.style.display = 'block';
                break;
            case 'free':
                if (card.classList.contains('premium')) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'block';
                }
                break;
            case 'premium':
                if (card.classList.contains('premium')) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                break;
        }
    });
}

// Funkcje zarządzania testami
function loadTests() {
    const testsGrid = document.querySelector('.tests-grid');
    
    // Dane testów
    const tests = [
        {
            id: 'phq9',
            title: 'Test depresji (PHQ-9)',
            description: '9-punktowy kwestionariusz zdrowia pacjenta do oceny objawów depresji.',
            questions: 9,
            time: '5 min',
            premium: false,
            questionsData: [
                {
                    question: "Jak często w ciągu ostatnich 2 tygodni odczuwałeś/aś małą przyjemność lub zainteresowanie wykonywaniem różnych czynności?",
                    options: [
                        { text: "Wcale", value: 0 },
                        { text: "Kilka dni", value: 1 },
                        { text: "Ponad połowę dni", value: 2 },
                        { text: "Prawie codziennie", value: 3 }
                    ]
                },
                {
                    question: "Jak często w ciągu ostatnich 2 tygodni odczuwałeś/aś przygnębienie, depresję lub beznadziejność?",
                    options: [
                        { text: "Wcale", value: 0 },
                        { text: "Kilka dni", value: 1 },
                        { text: "Ponad połowę dni", value: 2 },
                        { text: "Prawie codziennie", value: 3 }
                    ]
                },
                // Pozostałe pytania...
            ],
            scoring: {
                ranges: [
                    { min: 0, max: 4, result: "Brak lub minimalne objawy depresji" },
                    { min: 5, max: 9, result: "Łagodna depresja" },
                    { min: 10, max: 14, result: "Umiarkowana depresja" },
                    { min: 15, max: 19, result: "Umiarkowanie ciężka depresja" },
                    { min: 20, max: 27, result: "Ciężka depresja" }
                ],
                description: "PHQ-9 jest narzędziem przesiewowym i nie stanowi diagnozy. Wynik wskazujący na depresję wymaga konsultacji ze specjalistą."
            }
        },
        {
            id: 'gad7',
            title: 'Test lęku (GAD-7)',
            description: '7-punktowa skala uogólnionego zaburzenia lękowego do oceny poziomu lęku.',
            questions: 7,
            time: '3 min',
            premium: false
        },
        {
            id: 'pss10',
            title: 'Test stresu (PSS-10)',
            description: '10-punktowa skala odczuwanego stresu, mierząca subiektywne odczucie stresu.',
            questions: 10,
            time: '5 min',
            premium: false
        },
        {
            id: 'audit',
            title: 'Test uzależnienia od alkoholu (AUDIT)',
            description: 'Narzędzie przesiewowe do identyfikacji ryzykownych i szkodliwych wzorców picia alkoholu.',
            questions: 10,
            time: '5 min',
            premium: false
        },
        {
            id: 'bigfive',
            title: 'Test osobowości (Big Five)',
            description: 'Ocena pięciu głównych wymiarów osobowości: otwartość, sumienność, ekstrawersja, ugodowość, neurotyczność.',
            questions: 50,
            time: '15 min',
            premium: true
        },
        {
            id: 'adhd',
            title: 'Test ADHD u dorosłych',
            description: 'Skala samooceny objawów ADHD u dorosłych (ASRS v1.1) w skróconej wersji.',
            questions: 6,
            time: '3 min',
            premium: true
        },
        {
            id: 'mmse',
            title: 'Mini-Mental State Examination (MMSE)',
            description: 'Badanie przesiewowe funkcji poznawczych, stosowane w ocenie otępienia.',
            questions: 11,
            time: '10 min',
            premium: true
        }
    ];
    
    // Wyczyść siatkę testów
    testsGrid.innerHTML = '';
    
    // Dodaj testy do siatki
    tests.forEach(test => {
        const testCard = document.createElement('div');
        testCard.className = `test-card ${test.premium ? 'premium' : ''}`;
        testCard.innerHTML = `
            <div class="test-image">🧠</div>
            <div class="test-content">
                <h3>${test.title}</h3>
                <p>${test.description}</p>
                <div class="test-meta">
                    <span>${test.questions} pytania</span>
                    <span>${test.time}</span>
                </div>
                <button class="btn start-test" data-test="${test.id}">Rozpocznij test</button>
            </div>
        `;
        testsGrid.appendChild(testCard);
    });
    
    // Dodaj obsługę kliknięć przycisków startowych
    document.querySelectorAll('.start-test').forEach(button => {
        button.addEventListener('click', function() {
            const testId = this.getAttribute('data-test');
            startTest(testId);
        });
    });
}

function startTest(testId) {
    // Symulacja różnych testów
    const testModal = document.getElementById('testModal');
    const testContent = document.getElementById('testContent');
    
    // Pokaż modal ładowania
    showLoading();
    
    // Symulacja ładowania testu
    setTimeout(() => {
        // W zależności od testu załaduj odpowiednie pytania
        switch(testId) {
            case 'phq9':
                loadPHQ9Test();
                break;
            case 'gad7':
                loadGAD7Test();
                break;
            case 'bigfive':
                checkPremiumAccess(() => loadBigFiveTest());
                break;
            default:
                loadGenericTest(testId);
        }
        
        // Pokaż modal testu
        openModal(testModal);
        hideLoading();
    }, 1000);
}

function loadPHQ9Test() {
    const testContent = document.getElementById('testContent');
    
    testContent.innerHTML = `
        <h3>Test depresji (PHQ-9)</h3>
        <p>Proszę odpowiedzieć na poniższe pytania dotyczące Twojego samopoczucia w ciągu ostatnich 2 tygodni.</p>
        <div class="test-progress">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <form id="testForm">
            <div class="question">
                <p class="question-text">1. Jak często w ciągu ostatnich 2 tygodni odczuwałeś/aś małą przyjemność lub zainteresowanie wykonywaniem różnych czynności?</p>
                <div class="options">
                    <label class="option">
                        <input type="radio" name="q1" value="0" required> Wcale
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="1"> Kilka dni
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="2"> Ponad połowę dni
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="3"> Prawie codziennie
                    </label>
                </div>
            </div>
            <!-- Dodatkowe pytania... -->
            <div class="test-nav">
                <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
                <button type="submit" class="btn">Zakończ test</button>
            </div>
        </form>
    `;
    
    // Obsługa anulowania testu
    document.getElementById('cancelTest').addEventListener('click', function() {
        if (confirm('Czy na pewno chcesz przerwać test? Twoje odpowiedzi nie zostaną zapisane.')) {
            closeModal(document.getElementById('testModal'));
        }
    });
    
    // Obsługa wysłania formularza
    document.getElementById('testForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Oblicz wynik
        let score = 0;
        for (let i = 1; i <= 9; i++) {
            const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
            if (selectedOption) {
                score += parseInt(selectedOption.value);
            }
        }
        
        // Wyświetl wynik
        showTestResult('phq9', score);
    });
}

function showTestResult(testId, score) {
    const testContent = document.getElementById('testContent');
    let resultText = '';
    let description = '';
    
    // W zależności od testu przygotuj odpowiedni wynik
    switch(testId) {
        case 'phq9':
            if (score >= 0 && score <= 4) {
                resultText = 'Brak lub minimalne objawy depresji';
            } else if (score >= 5 && score <= 9) {
                resultText = 'Łagodna depresja';
            } else if (score >= 10 && score <= 14) {
                resultText = 'Umiarkowana depresja';
            } else if (score >= 15 && score <= 19) {
                resultText = 'Umiarkowanie ciężka depresja';
            } else {
                resultText = 'Ciężka depresja';
            }
            
            description = 'PHQ-9 jest narzędziem przesiewowym i nie stanowi diagnozy. Wynik wskazujący na depresję wymaga konsultacji ze specjalistą.';
            break;
        case 'gad7':
            // Analogicznie dla innych testów...
            break;
        default:
            resultText = `Twój wynik: ${score} pkt`;
            description = 'Dziękujemy za wypełnienie testu. Pamiętaj, że wyniki testów internetowych mają charakter informacyjny i nie zastępują konsultacji ze specjalistą.';
    }
    
    testContent.innerHTML = `
        <div class="test-result">
            <h3>Wynik testu</h3>
            <div class="result-score">${score} pkt</div>
            <div class="result-description">
                <p><strong>Interpretacja:</strong> ${resultText}</p>
                <p>${description}</p>
            </div>
            <div class="result-actions">
                <button class="btn-outline" id="saveResult">Zapisz wynik</button>
                <button class="btn" id="closeTest">Zamknij</button>
            </div>
        </div>
    `;
    
    // Obsługa przycisków wyniku
    document.getElementById('saveResult').addEventListener('click', function() {
        saveTestResult(testId, score, resultText);
    });
    
    document.getElementById('closeTest').addEventListener('click', function() {
        closeModal(document.getElementById('testModal'));
    });
}

function saveTestResult(testId, score, resultText) {
    const user = getCurrentUser();
    
    if (!user) {
        alert('Aby zapisać wyniki, musisz być zalogowany.');
        openModal(document.getElementById('loginModal'));
        return;
    }
    
    // Pobierz historię testów z localStorage
    let testHistory = JSON.parse(localStorage.getItem('testHistory')) || {};
    
    // Jeśli użytkownik nie ma jeszcze historii, utwórz ją
    if (!testHistory[user.email]) {
        testHistory[user.email] = [];
    }
    
    // Dodaj nowy wynik
    const testResult = {
        testId,
        testName: getTestName(testId),
        score,
        resultText,
        date: new Date().toISOString()
    };
    
    testHistory[user.email].push(testResult);
    
    // Zapisz zaktualizowaną historię
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
    
    alert('Wynik został zapisany w Twojej historii.');
}

function getTestName(testId) {
    // Mapowanie ID testów na ich nazwy
    const testNames = {
        'phq9': 'Test depresji (PHQ-9)',
        'gad7': 'Test lęku (GAD-7)',
        'pss10': 'Test stresu (PSS-10)',
        'audit': 'Test uzależnienia od alkoholu (AUDIT)',
        'bigfive': 'Test osobowości (Big Five)',
        'adhd': 'Test ADHD u dorosłych',
        'mmse': 'Mini-Mental State Examination (MMSE)'
    };
    
    return testNames[testId] || 'Test psychologiczny';
}

// Funkcje zarządzania użytkownikami
function initForms() {
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
            handleContactForm();
        });
    }
    
    // Przycisk wylogowania
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Walidacja
    if (!email || !password) {
        alert('Proszę wypełnić wszystkie pola.');
        return;
    }
    
    // Pobierz zarejestrowanych użytkowników
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Znajdź użytkownika
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Zaloguj użytkownika
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Zamknij modal i odśwież interfejs
        closeModal(document.getElementById('loginModal'));
        checkAuthStatus();
        
        alert(`Witaj ponownie, ${user.name}!`);
    } else {
        alert('Nieprawidłowy email lub hasło.');
    }
}

function handleRegistration() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Walidacja
    if (!name || !email || !password || !confirmPassword) {
        alert('Proszę wypełnić wszystkie pola.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Hasła nie są identyczne.');
        return;
    }
    
    if (password.length < 8) {
        alert('Hasło musi mieć co najmniej 8 znaków.');
        return;
    }
    
    // Sprawdź czy użytkownik już istnieje
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.email === email);
    
    if (userExists) {
        alert('Użytkownik o podanym emailu już istnieje.');
        return;
    }
    
    // Zarejestruj nowego użytkownika
    const newUser = {
        name,
        email,
        password,
        isPremium: false,
        premiumExpiry: null
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Zaloguj nowego użytkownika
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Zamknij modal i odśwież interfejs
    closeModal(document.getElementById('registerModal'));
    checkAuthStatus();
    
    alert(`Dziękujemy za rejestrację, ${name}!`);
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    checkAuthStatus();
    closeModal(document.getElementById('userPanelModal'));
    alert('Zostałeś wylogowany.');
}

function handleContactForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !message) {
        alert('Proszę wypełnić wszystkie pola formularza.');
        return;
    }
    
    // Symulacja wysłania formularza
    alert('Dziękujemy za wiadomość! Odezwiemy się najszybciej jak to możliwe.');
    document.getElementById('contactForm').reset();
}

function checkAuthStatus() {
    const authSection = document.querySelector('.auth-section');
    const user = getCurrentUser();
    
    if (user) {
        authSection.innerHTML = `
            <button id="userPanelBtn" class="btn-outline">Moje konto</button>
            <button id="logoutBtnHeader" class="btn-outline">Wyloguj</button>
        `;
        
        document.getElementById('userPanelBtn').addEventListener('click', () => {
            openUserPanel();
        });
        
        document.getElementById('logoutBtnHeader').addEventListener('click', handleLogout);
    } else {
        authSection.innerHTML = `
            <button id="loginBtn" class="btn-outline">Zaloguj</button>
            <button id="registerBtn" class="btn">Rejestracja</button>
        `;
        
        // Ponowna inicjalizacja przycisków logowania/rejestracji
        document.getElementById('loginBtn').addEventListener('click', () => {
            openModal(document.getElementById('loginModal'));
        });
        
        document.getElementById('registerBtn').addEventListener('click', () => {
            openModal(document.getElementById('registerModal'));
        });
    }
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function openUserPanel() {
    const user = getCurrentUser();
    const userPanelModal = document.getElementById('userPanelModal');
    const userInfo = document.getElementById('userInfo');
    const testHistory = document.getElementById('testHistory');
    
    if (!user) {
        alert('Musisz być zalogowany, aby wyświetlić panel użytkownika.');
        openModal(document.getElementById('loginModal'));
        return;
    }
    
    // Wyświetl informacje o użytkowniku
    userInfo.innerHTML = `
        <p><strong>Imię i nazwisko:</strong> ${user.name}</p>
        <p><strong>E-mail:</strong> ${user.email}</p>
        <p><strong>Konto Premium:</strong> ${user.isPremium ? 'Tak' : 'Nie'}</p>
    `;
    
    // Wyświetl historię testów
    const allTestHistory = JSON.parse(localStorage.getItem('testHistory')) || {};
    const userTestHistory = allTestHistory[user.email] || [];
    
    if (userTestHistory.length > 0) {
        testHistory.innerHTML = '';
        userTestHistory.forEach((test, index) => {
            const testItem = document.createElement('div');
            testItem.className = 'test-history-item';
            testItem.innerHTML = `
                <div>
                    <h4>${test.testName}</h4>
                    <p class="test-history-meta">${new Date(test.date).toLocaleDateString()}</p>
                </div>
                <div class="test-history-score">${test.score} pkt</div>
            `;
            testHistory.appendChild(testItem);
        });
    } else {
        testHistory.innerHTML = '<p>Brak zapisanych wyników testów.</p>';
    }
    
    // Otwórz modal
    openModal(userPanelModal);
}

// Funkcje Premium
function checkPremiumAccess(callback) {
    const user = getCurrentUser();
    
    if (!user) {
        alert('Aby uzyskać dostęp do testów Premium, musisz być zalogowany.');
        openModal(document.getElementById('loginModal'));
        return;
    }
    
    if (!user.isPremium) {
        if (confirm('Ten test jest dostępny tylko dla użytkowników Premium. Czy chcesz przejść do zakupu?')) {
            openModal(document.getElementById('paymentModal'));
            setupPaymentModal();
        }
    } else {
        callback();
    }
}

function setupPaymentModal() {
    const paymentContent = document.getElementById('paymentContent');
    
    paymentContent.innerHTML = `
        <p>Wybierz metodę płatności:</p>
        <div class="payment-methods">
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="card" checked>
                Karta kredytowa
            </label>
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="paypal">
                PayPal
            </label>
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="transfer">
                Przelew bankowy
            </label>
        </div>
        <button id="simulatePayment" class="btn">Symuluj płatność</button>
        <p class="payment-note">Uwaga: To jest demonstracja frontendowa. Żadna prawdziwa płatność nie zostanie wykonana.</p>
    `;
    
    document.getElementById('simulatePayment').addEventListener('click', function() {
        simulatePayment();
    });
}

function simulatePayment() {
    showLoading();
    
    // Symulacja procesu płatności
    setTimeout(() => {
        const user = getCurrentUser();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Znajdź i zaktualizuj użytkownika
        const updatedUsers = users.map(u => {
            if (u.email === user.email) {
                return {
                    ...u,
                    isPremium: true,
                    premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dni od teraz
                };
            }
            return u;
        });
        
        // Zapisz zaktualizowanych użytkowników
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Zaktualizuj obecnego użytkownika
        const updatedUser = updatedUsers.find(u => u.email === user.email);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        hideLoading();
        closeModal(document.getElementById('paymentModal'));
        checkAuthStatus();
        
        alert('Dziękujemy za zakup konta Premium! Teraz masz dostęp do wszystkich testów i funkcji.');
    }, 2000);
}

// Funkcje zarządzania motywem
function checkColorSchemePreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggle(savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeToggle('dark');
    }
}

function toggleColorScheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Inicjalizacja przycisku zmiany motywu
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleColorScheme);
}

// Funkcje pomocnicze
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function simulateLoading() {
    showLoading();
    setTimeout(hideLoading, 1000);
}

function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Inicjalizacja innych testów (symulacja)
function loadGAD7Test() {
    const testContent = document.getElementById('testContent');
    
    testContent.innerHTML = `
        <h3>Test lęku (GAD-7)</h3>
        <p>Proszę odpowiedzieć na poniższe pytania dotyczące Twojego samopoczucia w ciągu ostatnich 2 tygodni.</p>
        <div class="test-progress">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <form id="testForm">
            <div class="question">
                <p class="question-text">1. Jak często w ciągu ostatnich 2 tygodni odczuwałeś/aś nerwowość, niepokój lub zdenerwowanie?</p>
                <div class="options">
                    <label class="option">
                        <input type="radio" name="q1" value="0" required> Wcale
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="1"> Kilka dni
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="2"> Ponad połowę dni
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="3"> Prawie codziennie
                    </label>
                </div>
            </div>
            <!-- Dodatkowe pytania... -->
            <div class="test-nav">
                <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
                <button type="submit" class="btn">Zakończ test</button>
            </div>
        </form>
    `;
    
    // Obsługa formularza (analogicznie jak w PHQ-9)
    document.getElementById('testForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const score = Math.floor(Math.random() * 21); // Symulacja wyniku
        showTestResult('gad7', score);
    });
}

function loadBigFiveTest() {
    const testContent = document.getElementById('testContent');
    
    testContent.innerHTML = `
        <h3>Test osobowości (Big Five)</h3>
        <p>Proszę odpowiedzieć na poniższe pytania dotyczące Twoich typowych zachowań i preferencji.</p>
        <div class="test-progress">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <form id="testForm">
            <div class="question">
                <p class="question-text">1. Jestem osobą towarzyską.</p>
                <div class="options">
                    <label class="option">
                        <input type="radio" name="q1" value="1" required> Zdecydowanie nie zgadzam się
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="2"> Raczej nie zgadzam się
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="3"> Ani się zgadzam, ani nie
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="4"> Raczej zgadzam się
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="5"> Zdecydowanie zgadzam się
                    </label>
                </div>
            </div>
            <!-- Dodatkowe pytania... -->
            <div class="test-nav">
                <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
                <button type="submit" class="btn">Zakończ test</button>
            </div>
        </form>
    `;
    
    // Obsługa formularza
    document.getElementById('testForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Symulacja wyników dla 5 cech
        const results = {
            extraversion: Math.floor(Math.random() * 40) + 10,
            agreeableness: Math.floor(Math.random() * 40) + 10,
            conscientiousness: Math.floor(Math.random() * 40) + 10,
            neuroticism: Math.floor(Math.random() * 40) + 10,
            openness: Math.floor(Math.random() * 40) + 10
        };
        
        showBigFiveResult(results);
    });
}

function showBigFiveResult(results) {
    const testContent = document.getElementById('testContent');
    
    testContent.innerHTML = `
        <div class="test-result">
            <h3>Twój profil osobowości</h3>
            <div class="big-five-results">
                <div class="big-five-trait">
                    <h4>Ekstrawersja</h4>
                    <div class="trait-score">${results.extraversion}/50</div>
                    <div class="trait-bar">
                        <div class="trait-progress" style="width: ${results.extraversion * 2}%"></div>
                    </div>
                </div>
                <div class="big-five-trait">
                    <h4>Ugodowość</h4>
                    <div class="trait-score">${results.agreeableness}/50</div>
                    <div class="trait-bar">
                        <div class="trait-progress" style="width: ${results.agreeableness * 2}%"></div>
                    </div>
                </div>
                <div class="big-five-trait">
                    <h4>Sumienność</h4>
                    <div class="trait-score">${results.conscientiousness}/50</div>
                    <div class="trait-bar">
                        <div class="trait-progress" style="width: ${results.conscientiousness * 2}%"></div>
                    </div>
                </div>
                <div class="big-five-trait">
                    <h4>Neurotyczność</h4>
                    <div class="trait-score">${results.neuroticism}/50</div>
                    <div class="trait-bar">
                        <div class="trait-progress" style="width: ${results.neuroticism * 2}%"></div>
                    </div>
                </div>
                <div class="big-five-trait">
                    <h4>Otwartość</h4>
                    <div class="trait-score">${results.openness}/50</div>
                    <div class="trait-bar">
                        <div class="trait-progress" style="width: ${results.openness * 2}%"></div>
                    </div>
                </div>
            </div>
            <div class="result-description">
                <p>Model Wielkiej Piątki (Big Five) to jedna z najbardziej uznanych teorii osobowości w psychologii. Składa się z pięciu podstawowych wymiarów osobowości, które opisują różnice indywidualne między ludźmi.</p>
            </div>
            <div class="result-actions">
                <button class="btn-outline" id="saveResult">Zapisz wynik</button>
                <button class="btn" id="closeTest">Zamknij</button>
            </div>
        </div>
    `;
    
    // Obsługa przycisków
    document.getElementById('saveResult').addEventListener('click', function() {
        saveTestResult('bigfive', Object.values(results).reduce((a, b) => a + b, 0), 'Test osobowości Big Five');
    });
    
    document.getElementById('closeTest').addEventListener('click', function() {
        closeModal(document.getElementById('testModal'));
    });
}

function loadGenericTest(testId) {
    const testContent = document.getElementById('testContent');
    const testName = getTestName(testId);
    
    testContent.innerHTML = `
        <h3>${testName}</h3>
        <p>Proszę odpowiedzieć na poniższe pytania zgodnie z instrukcjami.</p>
        <div class="test-progress">
            <div class="progress-bar" style="width: 0%"></div>
        </div>
        <form id="testForm">
            <div class="question">
                <p class="question-text">Przykładowe pytanie testowe 1</p>
                <div class="options">
                    <label class="option">
                        <input type="radio" name="q1" value="0" required> Opcja 1
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="1"> Opcja 2
                    </label>
                    <label class="option">
                        <input type="radio" name="q1" value="2"> Opcja 3
                    </label>
                </div>
            </div>
            <div class="question">
                <p class="question-text">Przykładowe pytanie testowe 2</p>
                <div class="options">
                    <label class="option">
                        <input type="radio" name="q2" value="0" required> Opcja 1
                    </label>
                    <label class="option">
                        <input type="radio" name="q2" value="1"> Opcja 2
                    </label>
                    <label class="option">
                        <input type="radio" name="q2" value="2"> Opcja 3
                    </label>
                </div>
            </div>
            <div class="test-nav">
                <button type="button" class="btn-outline" id="cancelTest">Anuluj</button>
                <button type="submit" class="btn">Zakończ test</button>
            </div>
        </form>
    `;
    
    // Obsługa formularza
    document.getElementById('testForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const score = Math.floor(Math.random() * 100); // Symulacja wyniku
        showTestResult(testId, score);
    });
}
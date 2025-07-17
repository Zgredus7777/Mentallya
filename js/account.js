document.addEventListener('DOMContentLoaded', function() {
    // Sprawdź czy użytkownik jest zalogowany
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Załaduj dane konta
    loadAccountData();
    
    // Inicjalizacja przycisków
    initButtons();
    
    // Załaduj historię testów
    loadTestHistory();
});

function loadAccountData() {
    const user = getCurrentUser();
    if (!user) return;

    // Wypełnij dane użytkownika
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    
    // Status Premium
    const statusElement = document.getElementById('userStatus');
    if (user.isPremium) {
        statusElement.innerHTML = `<span class="premium-badge">Premium (${user.premiumPlan || 'Zaawansowany'})</span>`;
        document.getElementById('upgradePremiumBtn').textContent = 'Zarządzaj Premium';
    } else {
        statusElement.textContent = 'Standardowe';
        document.getElementById('upgradePremiumBtn').textContent = 'Ulepsz do Premium';
    }

    // Data wygaśnięcia
    const expiryElement = document.getElementById('userExpiry');
    if (user.premiumExpiry) {
        expiryElement.textContent = new Date(user.premiumExpiry).toLocaleDateString();
    } else {
        expiryElement.textContent = 'Brak aktywnego Premium';
    }
}

function initButtons() {
    // Przycisk zmiany hasła
    document.getElementById('changePasswordBtn').addEventListener('click', function() {
        openModal(document.getElementById('changePasswordModal'));
    });

    // Przycisk ulepszenia do Premium
    document.getElementById('upgradePremiumBtn').addEventListener('click', function() {
        window.location.href = 'premium.html';
    });

    // Przycisk usuwania konta
    document.getElementById('deleteAccountBtn').addEventListener('click', function() {
        openModal(document.getElementById('deleteAccountModal'));
    });

    // Formularz zmiany hasła
    document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        changePassword();
    });

    // Formularz usuwania konta
    document.getElementById('confirmDeleteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        deleteAccount();
    });

    // Anuluj usuwanie konta
    document.getElementById('cancelDeleteBtn').addEventListener('click', function() {
        closeModal(document.getElementById('deleteAccountModal'));
    });

    // Filtry historii testów
    document.querySelectorAll('.history-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.history-filters .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterTestHistory(this.getAttribute('data-filter'));
        });
    });
}

function loadTestHistory() {
    const user = getCurrentUser();
    if (!user) return;

    const historyContainer = document.getElementById('testHistory');
    historyContainer.innerHTML = '<div class="loading-history"><p>Ładowanie historii...</p></div>';

    // Symulacja opóźnienia ładowania
    setTimeout(() => {
        const allHistory = JSON.parse(localStorage.getItem('testHistory')) || {};
        const userHistory = allHistory[user.email] || [];

        if (userHistory.length === 0) {
            historyContainer.innerHTML = '<div class="empty-history"><p>Brak zapisanych wyników testów.</p></div>';
            return;
        }

        // Sortuj od najnowszych
        const sortedHistory = userHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Wygeneruj HTML
        historyContainer.innerHTML = '';
        sortedHistory.forEach(test => {
            const testElement = document.createElement('div');
            testElement.className = 'history-item';
            testElement.innerHTML = `
                <div class="test-info">
                    <h3>${test.testName}</h3>
                    <div class="test-meta">
                        <span class="test-date">${new Date(test.date).toLocaleDateString()}</span>
                        <span class="test-score">Wynik: ${test.score} pkt</span>
                    </div>
                </div>
                <div class="test-result">
                    <p>${test.resultText}</p>
                </div>
                <button class="btn-outline view-details" data-test="${test.testId}">Szczegóły</button>
            `;
            historyContainer.appendChild(testElement);
        });

        // Dodaj obsługę przycisków "Szczegóły"
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const testId = this.getAttribute('data-test');
                viewTestDetails(testId);
            });
        });

    }, 800);
}

function filterTestHistory(filter) {
    const items = document.querySelectorAll('.history-item');
    
    items.forEach(item => {
        const isPremium = item.querySelector('.test-info h3').textContent.includes('Premium');
        
        switch(filter) {
            case 'all':
                item.style.display = 'flex';
                break;
            case 'last-month':
                const testDate = new Date(item.querySelector('.test-date').textContent);
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                item.style.display = testDate >= oneMonthAgo ? 'flex' : 'none';
                break;
            case 'premium':
                item.style.display = isPremium ? 'flex' : 'none';
                break;
        }
    });
}

function changePassword() {
    const form = document.getElementById('changePasswordForm');
    const statusElement = document.getElementById('passwordChangeStatus');
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    // Walidacja
    if (newPassword !== confirmPassword) {
        statusElement.innerHTML = '<p class="error">Nowe hasła nie są identyczne!</p>';
        return;
    }

    if (newPassword.length < 8) {
        statusElement.innerHTML = '<p class="error">Nowe hasło musi mieć minimum 8 znaków!</p>';
        return;
    }

    const user = getCurrentUser();
    if (!user) {
        statusElement.innerHTML = '<p class="error">Sesja wygasła. Zaloguj się ponownie.</p>';
        return;
    }

    // Sprawdź obecne hasło (w rzeczywistej aplikacji powinno być hashowane)
    if (currentPassword !== user.password) {
        statusElement.innerHTML = '<p class="error">Obecne hasło jest nieprawidłowe!</p>';
        return;
    }

    // Aktualizuj hasło
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Aktualizuj currentUser
        user.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        statusElement.innerHTML = '<p class="success">Hasło zostało zmienione pomyślnie!</p>';
        form.reset();
        
        setTimeout(() => {
            closeModal(document.getElementById('changePasswordModal'));
        }, 1500);
    } else {
        statusElement.innerHTML = '<p class="error">Wystąpił błąd podczas aktualizacji.</p>';
    }
}

function deleteAccount() {
    const password = document.getElementById('confirmPassword').value;
    const statusElement = document.getElementById('deleteAccountStatus');
    const user = getCurrentUser();

    if (!user) {
        statusElement.innerHTML = '<p class="error">Sesja wygasła. Zaloguj się ponownie.</p>';
        return;
    }

    // Sprawdź hasło
    if (password !== user.password) {
        statusElement.innerHTML = '<p class="error">Nieprawidłowe hasło!</p>';
        return;
    }

    // Usuń konto
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u.email !== user.email);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Usuń historię testów
    const testHistory = JSON.parse(localStorage.getItem('testHistory')) || {};
    delete testHistory[user.email];
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
    
    // Wyloguj
    localStorage.removeItem('currentUser');
    
    statusElement.innerHTML = '<p class="success">Konto zostało usunięte. Przekierowywanie...</p>';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

function viewTestDetails(testId) {
    // Tutaj można dodać szczegóły testu
    alert(`Szczegóły testu: ${testId}\nW pełnej wersji tutaj byłby szczegółowy raport.`);
}

// Funkcje pomocnicze
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}
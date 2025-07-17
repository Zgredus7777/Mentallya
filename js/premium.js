document.addEventListener('DOMContentLoaded', function() {
    initPremiumButtons();
});

function initPremiumButtons() {
    const premiumButtons = document.querySelectorAll('.premium-btn');
    
    premiumButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const plan = this.getAttribute('data-plan');
            openPaymentModal(plan);
        });
    });
}

function openPaymentModal(plan) {
    const modal = document.getElementById('paymentModal');
    if (!modal) return;

    const paymentContent = document.getElementById('paymentContent');
    paymentContent.innerHTML = `
        <h3>Aktywacja: ${getPlanName(plan)}</h3>
        <p>Wybierz metodę płatności:</p>
        <div class="payment-methods">
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="card" checked>
                <span>Karta kredytowa</span>
            </label>
            <label class="payment-method">
                <input type="radio" name="paymentMethod" value="paypal">
                <span>PayPal</span>
            </label>
        </div>
        <button id="simulatePayment" class="btn">Symuluj płatność</button>
        <div id="paymentStatus"></div>
        <p class="payment-note">Demo: Żadna rzeczywista płatność nie zostanie wykonana.</p>
    `;

    document.getElementById('simulatePayment').addEventListener('click', function() {
        simulatePayment(plan);
    });

    openModal(modal);
}

function getPlanName(planId) {
    const plans = {
        'basic': 'Podstawowy',
        'advanced': 'Zaawansowany',
        'family': 'Rodzinny'
    };
    return plans[planId] || 'Premium';
}

function simulatePayment(plan) {
    const statusElement = document.getElementById('paymentStatus');
    const paymentBtn = document.getElementById('simulatePayment');
    
    // Zabezpieczenie przed wielokrotnym kliknięciem
    if (paymentBtn.disabled) return;
    
    paymentBtn.disabled = true;
    statusElement.innerHTML = '<div class="status-loading">Przetwarzanie...</div>';
    statusElement.style.color = 'inherit';

    // Symulacja opóźnienia płatności
    setTimeout(() => {
        try {
            // 1. Pobierz aktualnego użytkownika
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (!user || !user.email) {
                throw new Error("Sesja wygasła. Zaloguj się ponownie.");
            }

            // 2. Pobierz wszystkich użytkowników
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === user.email);
            
            if (userIndex === -1) {
                throw new Error("Nie znaleziono konta.");
            }

            // 3. Przygotuj zaktualizowane dane
            const updatedUser = {
                ...users[userIndex],
                isPremium: true,
                premiumPlan: plan,
                premiumExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };

            // 4. Zapisz zmiany
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            // 5. Wyświetl potwierdzenie
            statusElement.innerHTML = `
                <div class="status-success">
                    <p>✅ Aktywowano pakiet ${getPlanName(plan)}!</p>
                    <p>Teraz masz dostęp do wszystkich testów.</p>
                </div>
            `;

            // 6. Zamknij modal i odśwież UI
            setTimeout(() => {
                closeModal(document.getElementById('paymentModal'));
                checkAuthStatus();
                
                // Jeśli jesteś na stronie testów - odśwież listę
                if (typeof loadTests === 'function') {
                    loadTests();
                }
            }, 2000);

        } catch (error) {
            console.error("Błąd płatności:", error);
            statusElement.innerHTML = `
                <div class="status-error">
                    <p>❌ Błąd: ${error.message}</p>
                    <p>Spróbuj ponownie lub skontaktuj się z supportem.</p>
                </div>
            `;
            paymentBtn.disabled = false;
        }
    }, 1500);
}

// Funkcje pomocnicze (jeśli nie są w main.js)
function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function checkAuthStatus() {
    // Ta funkcja powinna być zdefiniowana w main.js
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactForm();
    });
});

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
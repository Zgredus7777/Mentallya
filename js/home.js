document.addEventListener('DOMContentLoaded', function() {
    // Inicjalizacja specyficzna dla strony głównej
    // Można dodać np. animacje czy inne efekty
    
    // Przykładowa funkcja dla strony głównej
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.addEventListener('mousemove', function(e) {
            const circles = this.querySelectorAll('.circle');
            circles.forEach((circle, index) => {
                const moveValue = index === 0 ? 10 : 5;
                const x = (e.clientX * moveValue) / 100;
                const y = (e.clientY * moveValue) / 100;
                circle.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
});
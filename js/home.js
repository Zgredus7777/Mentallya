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
// ======================
// EMOTION TRACKER MODULE
// ======================
const EMOTIONS = ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];
let emotionInterval;
let emotionData = [];
let isTracking = false;

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('emotion-demo')) return;
    
    // Elementy UI
    const consentBtn = document.getElementById('consentBtn');
    const startBtn = document.getElementById('startEmotionBtn');
    const stopBtn = document.getElementById('stopEmotionBtn');
    
    // Obsługa zdarzeń
    consentBtn?.addEventListener('click', handleConsent);
    startBtn?.addEventListener('click', startTracking);
    stopBtn?.addEventListener('click', stopTracking);
});

async function handleConsent() {
    try {
        // Ukryj banner zgody
        document.getElementById('consentBanner').style.display = 'none';
        
        // Włącz przyciski
        document.getElementById('startEmotionBtn').disabled = false;
        
        // Załaduj modele AI
        await loadModels();
        
        // Przygotuj wideo
        const video = document.getElementById('videoEl');
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        video.srcObject = stream;
        
    } catch (error) {
        console.error('Błąd inicjalizacji tracker emocji:', error);
        showAlert('Nie udało się uzyskać dostępu do kamery', 'error');
    }
}

async function loadModels() {
    try {
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
    const chart = document.querySelector('.chart-bars');
    chart.innerHTML = '';
    
    let dominantEmotion = 'neutral';
    let maxValue = 0;
    
    EMOTIONS.forEach(emotion => {
        const value = expressions[emotion];
        if (value > maxValue) {
            maxValue = value;
            dominantEmotion = emotion;
        }
        
        const percentage = Math.round(value * 100);
        const bar = document.createElement('div');
        bar.className = 'emotion-bar';
        
        const fill = document.createElement('div');
        fill.className = 'emotion-fill';
        fill.style.background = getEmotionGradient(emotion);
        fill.style.width = `${percentage}%`;
        fill.textContent = `${emotion}: ${percentage}%`;
        
        bar.appendChild(fill);
        chart.appendChild(bar);
    });
    
    // Aktualizuj dominującą emocję
    document.getElementById('dominantEmotionLabel').textContent = dominantEmotion;
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
    
    // Pokazuj ponownie banner zgody
    document.getElementById('consentBanner').style.display = 'block';
    
    console.log('Zatrzymano śledzenie emocji. Zebrano punktów danych:', emotionData.length);
}

function getEmotionGradient(emotion) {
    const gradients = {
        happy: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
        neutral: 'linear-gradient(90deg, #9E9E9E, #BDBDBD)',
        sad: 'linear-gradient(90deg, #2196F3, #03A9F4)',
        angry: 'linear-gradient(90deg, #F44336, #FF5722)',
        fearful: 'linear-gradient(90deg, #673AB7, #9C27B0)',
        disgusted: 'linear-gradient(90deg, #795548, #5D4037)',
        surprised: 'linear-gradient(90deg, #FF9800, #FFC107)'
    };
    return gradients[emotion] || '#000';
}
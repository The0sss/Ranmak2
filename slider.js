// Используем объект для хранения всех элементов (удобно для поддержки)
const ui = {
    track: document.getElementById('sliderTrack'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    dotsContainer: document.getElementById('sliderDots'),
    videoBtns: document.querySelectorAll('.video-btn'),
    rutubePlayer: document.getElementById('rutubePlayer')
};

let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Данные видео выносим в константу
const VIDEO_DATA = {
    1: 'https://rutube.ru/play/embed/e014b48727df4e39b19e78b6b5ad0186',
    2: 'https://rutube.ru/play/embed/90944ec18b8099f9c993e87ff91181cd'
};

/* --- Логика Слайдера --- */

function goToSlide(index) {
    // Ограничиваем индекс
    const newIndex = Math.max(0, Math.min(index, totalSlides - 1));
    
    // Если индекс не изменился (нажали "вперед" на последнем слайде) - выходим
    if (newIndex === currentIndex && index !== 0) return; 

    currentIndex = newIndex;
    
    // Плавное перемещение
    ui.track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    updateSliderUI();
}

function updateSliderUI() {
    // Обновляем точки через один проход по контейнеру
    const dots = ui.dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));

    // Опционально: отключаем кнопки на границах
    if (ui.prevBtn) ui.prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
    if (ui.nextBtn) ui.nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.3' : '1';
}

function initSlider() {
    if (!ui.track || !ui.dotsContainer) return;

    // Создаем все точки разом через DocumentFragment (быстрее для DOM)
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.dataset.index = i; // Сохраняем индекс в data-атрибут
        fragment.appendChild(dot);
    }
    ui.dotsContainer.appendChild(fragment);

    // Делегирование кликов на точки
    ui.dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            goToSlide(parseInt(e.target.dataset.index));
        }
    });

    // Обработчики стрелок
    ui.prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
    ui.nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Клавиатура
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });
}

/* --- Логика Видео --- */

function initVideoSwitcher() {
    if (!ui.rutubePlayer) return;

    ui.videoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.video;
            
            // 1. Меняем видео
            ui.rutubePlayer.src = VIDEO_DATA[id];
            
            // 2. Сбрасываем активный класс у всех и ставим текущей
            ui.videoBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initVideoSwitcher();
});
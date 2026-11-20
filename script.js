// script.js

document.addEventListener('DOMContentLoaded', function() {
    ajustarAnclaje();
    inicializarCarruseles();
    inicializarVideos();
});

// Mide la barra fija para que los anclajes (#contacto, etc.) aterricen justo debajo de ella
function ajustarAnclaje() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;
    const medir = () => document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    medir();
    window.addEventListener('resize', medir);
    window.addEventListener('load', medir);
}

function inicializarCarruseles() {
    document.querySelectorAll('[data-carrusel]').forEach((container) => {
        const carousel = container.querySelector('.carousel');
        const slides = container.querySelectorAll('.carousel-slide');
        const prevButton = container.querySelector('.carousel-prev');
        const nextButton = container.querySelector('.carousel-next');
        if (!carousel || !slides.length || !prevButton || !nextButton) return;

        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoPlayInterval;
        let visible = false;   // el carrusel está en pantalla
        let hovering = false;  // el ratón está encima

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        // Solo avanza solo si está visible, sin ratón encima y con la pestaña activa
        function startAutoPlay() {
            stopAutoPlay();
            if (visible && !hovering && !document.hidden) {
                autoPlayInterval = setInterval(nextSlide, 5000);
            }
        }

        nextButton.addEventListener('click', function() {
            nextSlide();
            startAutoPlay();
        });
        prevButton.addEventListener('click', function() {
            prevSlide();
            startAutoPlay();
        });

        // Pausar/reanudar con el ratón (los toques en móvil no cuentan)
        container.addEventListener('pointerenter', (e) => {
            if (e.pointerType === 'mouse') { hovering = true; stopAutoPlay(); }
        });
        container.addEventListener('pointerleave', (e) => {
            if (e.pointerType === 'mouse') { hovering = false; startAutoPlay(); }
        });
        document.addEventListener('visibilitychange', startAutoPlay);

        updateCarousel();

        // Solo se mueve mientras está en pantalla
        if ('IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                visible = entries[0].isIntersecting;
                startAutoPlay();
            }, { threshold: 0.5 }).observe(container);
        } else {
            visible = true;
            startAutoPlay();
        }
    });
}

// Los vídeos solo se reproducen cuando están en pantalla
function inicializarVideos() {
    const videos = document.querySelectorAll('video[data-autoplay]');
    if (!('IntersectionObserver' in window)) {
        videos.forEach((v) => v.play().catch(() => {}));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.play().catch(() => {});
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.4 });
    videos.forEach((v) => observer.observe(v));
}
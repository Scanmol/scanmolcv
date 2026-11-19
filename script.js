// script.js

document.addEventListener('DOMContentLoaded', function() {
    inicializarCarruseles();
    inicializarVideos();
});

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
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        nextButton.addEventListener('click', function() {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });
        prevButton.addEventListener('click', function() {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        });

        // Pausar/reanudar al hacer hover
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);

        updateCarousel();
        startAutoPlay();
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

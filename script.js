// script.js

document.addEventListener('DOMContentLoaded', function() {
    inicializarCarruseles();
    inicializarSmoothScroll();
    inicializarBackToTop();
    // Más funciones...
});

function inicializarCarruseles() {
    const carruseles = document.querySelectorAll('[data-carrusel]');
    
    carruseles.forEach((container) => {
        const carousel = container.querySelector('.carousel');
        const slides = container.querySelectorAll('.carousel-slide');
        const prevButton = container.querySelector('.carousel-prev');
        const nextButton = container.querySelector('.carousel-next');
        
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
        
        // Event listeners
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
        
        // Iniciar
        updateCarousel();
        startAutoPlay();
    });
}

// Otras funciones que puedas necesitar
function inicializarSmoothScroll() {
    // Tu código para scroll suave
}

function inicializarBackToTop() {
    // Tu código para botón "volver arriba"
}
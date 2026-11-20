// script.js

document.addEventListener('DOMContentLoaded', function() {
    inicializarTema();
    ajustarAnclaje();
    inicializarCarruseles();
    inicializarVideos();
});

// Modo oscuro (por defecto) / claro, con la elección guardada en el navegador
function inicializarTema() {
    const root = document.documentElement;
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    const aplicar = (tema) => {
        root.setAttribute('data-theme', tema);
        const destino = tema === 'dark' ? 'claro' : 'oscuro';
        btn.textContent = tema === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label', 'Cambiar a modo ' + destino);
        btn.title = 'Cambiar a modo ' + destino;
    };
    aplicar(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    btn.addEventListener('click', () => {
        const nuevo = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        aplicar(nuevo);
        try { localStorage.setItem('tema', nuevo); } catch (e) {}
    });
}

// Mide la barra fija para que los anclajes (#contacto, etc.) aterricen justo debajo de ella
function ajustarAnclaje() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;
    const medir = () => document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    medir();
    window.addEventListener('resize', medir);
    window.addEventListener('load', medir);
}

// ---- Carruseles ----
const PERIODO = 5000;   // ms entre diapositivas
const DESFASE = 1700;   // ms de retraso extra por cada carrusel, para que no se muevan a la vez

function inicializarCarruseles() {
    document.querySelectorAll('[data-carrusel]').forEach((container, indice) => {
        const carousel = container.querySelector('.carousel');
        const slides = container.querySelectorAll('.carousel-slide');
        const prevButton = container.querySelector('.carousel-prev');
        const nextButton = container.querySelector('.carousel-next');
        if (!carousel || !slides.length || !prevButton || !nextButton) return;

        let currentSlide = 0;
        const totalSlides = slides.length;
        const desfase = indice * DESFASE;
        let timer;
        let visible = false;   // el carrusel está en pantalla
        let hovering = false;  // el ratón está encima

        // Las imágenes son lazy, pero las de slides ocultos no llegarían a cargarse
        // hasta el momento de moverse (se vería vacío). Se piden de una en una por adelantado.
        function cargarSlide(n) {
            slides[(n + totalSlides) % totalSlides]
                .querySelectorAll('img[loading="lazy"]')
                .forEach((img) => { img.loading = 'eager'; });
        }
        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
            cargarSlide(currentSlide + 1);
        }
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            cargarSlide(currentSlide - 1);
            updateCarousel();
        }
        function stopAutoPlay() {
            clearTimeout(timer);
            clearInterval(timer);
        }
        // Solo avanza solo si está visible, sin ratón encima y con la pestaña activa.
        // El primer cambio espera PERIODO + desfase; después, cada PERIODO.
        function startAutoPlay() {
            stopAutoPlay();
            if (!visible || hovering || document.hidden) return;
            timer = setTimeout(() => {
                nextSlide();
                timer = setInterval(nextSlide, PERIODO);
            }, PERIODO + desfase);
        }

        nextButton.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
        prevButton.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

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
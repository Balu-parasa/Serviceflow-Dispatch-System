import './bootstrap';
import Alpine from 'alpinejs';
import gsap from 'gsap';
import Lenis from 'lenis';
import * as THREE from 'three';
import lottie from 'lottie-web';
import * as lucide from 'lucide';

window.Alpine = Alpine;
window.gsap = gsap;
window.Lenis = Lenis;
window.THREE = THREE;
window.lottie = lottie;
window.lucide = lucide;

// Global Smooth Scrolling (Lenis)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.lenis = lenis;

    // 2. Initialize Lucide Icons globally for dynamically added items
    lucide.createIcons();

    // 3. Simple global toast messaging component helper
    window.toast = (message, type = 'success') => {
        window.dispatchEvent(new CustomEvent('toast', {
            detail: { message, type }
        }));
    };
});

// Start Alpine.js
Alpine.start();

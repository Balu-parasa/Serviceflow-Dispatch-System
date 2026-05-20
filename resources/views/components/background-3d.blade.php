<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden perspective-2000">
    <div id="three-d-bg" class="relative w-[140vw] h-[140vh] origin-center -left-[20vw] -top-[20vh] opacity-35 dark:opacity-20 transition-opacity duration-700">
        <div class="absolute inset-0 isometric-road-grid"></div>
        <div class="absolute inset-0 blend-transparent-vehicles opacity-80 dark:opacity-60"
             style="background-image: url('{{ asset('vehicles-topdown.png') }}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
        </div>
    </div>
    <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-background/10 to-[#0b0f19]"></div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const bg = document.getElementById('three-d-bg');
        if (!bg) return;

        // Smooth scroll parallax using window scrolling
        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
            
            // Subtle premium 3D rotation shifts and scales based on scroll position
            const translateY = -30 * scrollPercent; // translate up to -30%
            const rotateX = 55 - (10 * scrollPercent); // rotateX from 55deg to 45deg
            const rotateZ = -45 + (10 * scrollPercent); // rotateZ from -45deg to -35deg
            const scale = 1.05 + (0.15 * scrollPercent); // scale from 1.05 to 1.2

            gsap.to(bg, {
                yPercent: translateY,
                rotateX: rotateX,
                rotateZ: rotateZ,
                scale: scale,
                duration: 0.8,
                ease: 'power1.out',
                overwrite: 'auto'
            });
        });
    });
</script>

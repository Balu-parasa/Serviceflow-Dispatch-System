<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Schneider CRM - AI-Powered Dispatch & Fleet Hub</title>

    <!-- Tailwind CSS v4 -->
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Premium Interactive Visual Modules (GSAP, Three.js, Lenis) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>

    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #04080F;
            color: #E2E8F0;
            overflow: hidden;
            margin: 0;
            padding: 0;
        }
        h1, h2, h3, span.brand {
            font-family: 'Outfit', sans-serif;
        }
        .glow-cyan {
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.2);
        }
        .glassmorphism {
            background: rgba(15, 23, 42, 0.65);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px border-solid rgba(255, 255, 255, 0.08);
        }
        /* Custom scrollbar for frame viewport */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #04080F;
        }
        ::-webkit-scrollbar-thumb {
            background: #1E293B;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #334155;
        }
    </style>
</head>
<body class="antialiased min-h-screen relative flex flex-col justify-between">

    <!-- Dynamic Three.js 3D Background Canvas -->
    <canvas id="three-bg-canvas" class="absolute inset-0 w-full h-full z-0 pointer-events-none"></canvas>

    <!-- Main Viewport Interface Bridge -->
    <div id="app-container" class="absolute inset-0 w-full h-full z-10 flex flex-col opacity-0">
        <iframe 
            src="http://localhost:3000" 
            class="w-full h-full border-none outline-none z-10" 
            title="Schneider CRM Portal"
            allow="geolocation; microphone; camera; midi; encrypted-media;"
        ></iframe>
    </div>

    <!-- Premium Splitting Page Entrance Loading State -->
    <div id="loader-panel" class="absolute inset-0 w-full h-full z-50 flex items-center justify-center bg-[#04080F]">
        <div class="text-center z-10 px-4">
            <!-- Glassmorphic Glowing Logo Ring -->
            <div class="relative mx-auto mb-8 w-20 h-20 flex items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 glow-cyan animate-pulse">
                <svg class="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
            </div>

            <!-- Loading Headers -->
            <h2 class="text-2xl font-bold tracking-tight text-white mb-2">SCHNEIDER INDUSTRY</h2>
            <p class="text-sm text-cyan-400/80 font-mono tracking-widest uppercase mb-6">Initializing AI CRM & 3D Fleet Hub</p>
            
            <!-- Progress Status -->
            <div class="w-48 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden">
                <div id="loader-bar" class="w-0 h-full bg-cyan-500 transition-all duration-300"></div>
            </div>
            <p id="loader-status" class="text-xs text-slate-500 mt-3 font-mono">Loading dynamic assets...</p>
        </div>
    </div>

    <!-- Core Interactive Animations (Lenis, Three.js, GSAP) -->
    <script>
        // 1. Initialize Lenis Smooth Scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // 2. Initialize Three.js Dynamic Neon Starfield/Particles
        const canvas = document.getElementById('three-bg-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create Particles Geometry
        const particlesCount = 400;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        for(let i=0; i<particlesCount * 3; i+=3) {
            // Position
            positions[i] = (Math.random() - 0.5) * 15;
            positions[i+1] = (Math.random() - 0.5) * 15;
            positions[i+2] = (Math.random() - 0.5) * 15;

            // Color gradient (cyans/blues/slate)
            colors[i] = 0.0 + Math.random() * 0.2; // R
            colors[i+1] = 0.6 + Math.random() * 0.4; // G
            colors[i+2] = 0.8 + Math.random() * 0.2; // B
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Premium Soft Particle Material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleSystem);

        camera.position.z = 5;

        // Mouse Move Interactive Shift
        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
        });

        // Frame Render Loop
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            
            const elapsedTime = clock.getElapsedTime();

            // Auto-rotate particle system
            particleSystem.rotation.y = elapsedTime * 0.02;
            particleSystem.rotation.x = elapsedTime * 0.01;

            // Interactive mouse follow damping
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }
        animate();

        // Responsive Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 3. Loading Orchestration & GSAP entrance transitions
        const loaderBar = document.getElementById('loader-bar');
        const loaderStatus = document.getElementById('loader-status');
        const loaderPanel = document.getElementById('loader-panel');
        const appContainer = document.getElementById('app-container');

        const loadingPhases = [
            { progress: 20, status: "Establishing secure DB connection..." },
            { progress: 45, status: "Compiling Tailwind CSS v4 assets..." },
            { progress: 70, status: "Loading GSAP, Three.js & Lenis viewports..." },
            { progress: 100, status: "Mounting AI dispatch dashboard..." }
        ];

        let phaseIndex = 0;
        function updateProgress() {
            if (phaseIndex < loadingPhases.length) {
                const phase = loadingPhases[phaseIndex];
                loaderBar.style.width = `${phase.progress}%`;
                loaderStatus.textContent = phase.status;
                phaseIndex++;
                setTimeout(updateProgress, 600);
            } else {
                // Reveal main React platform using premium GSAP transition
                gsap.timeline()
                    .to(loaderPanel, {
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        onComplete: () => {
                            loaderPanel.style.display = 'none';
                        }
                    })
                    .to(appContainer, {
                        opacity: 1,
                        duration: 1.0,
                        ease: "power2.inOut"
                    }, "-=0.4");
            }
        }

        // Trigger loader animation
        setTimeout(updateProgress, 300);
    </script>
</body>
</html>

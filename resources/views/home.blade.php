@extends('layouts.app')

@section('title', 'Schneider - Realtime Smart Dispatch & CRM Monolith')

@section('content')
<!-- Hero Section -->
<section class="relative min-h-[85vh] flex items-center pt-24 pb-12 overflow-hidden">
    <!-- Ambient Blur Orbs -->
    <div class="absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div class="grid items-center gap-12 lg:grid-cols-2">
            
            <!-- Left content -->
            <div id="hero-left-content" class="text-center lg:text-left">
                <!-- Online stats indicator -->
                <div class="mb-6 inline-flex">
                    <div class="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
                        <span class="relative flex h-2 w-2">
                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                            <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        </span>
                        <span class="text-xs font-semibold text-emerald-400">
                            2,847 technicians online now
                        </span>
                    </div>
                </div>

                <h1 class="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Realtime Smart Service <br>
                    <span class="animated-gradient-text font-extrabold">
                        Dispatch Platform
                    </span>
                </h1>

                <p class="mt-6 text-base text-slate-300 sm:text-lg max-w-xl mx-auto lg:mx-0">
                    Book background-checked technicians for home, commercial, and industrial services with instant AI matching and live GPS updates.
                </p>

                <!-- Small Stats Row -->
                <div class="mt-8 flex flex-wrap justify-center lg:justify-start gap-8">
                    <div>
                        <div class="text-2xl sm:text-3xl font-extrabold text-white">50K+</div>
                        <div class="text-xs text-slate-400 font-medium">Jobs Completed</div>
                    </div>
                    <div>
                        <div class="text-2xl sm:text-3xl font-extrabold text-white">4.9</div>
                        <div class="text-xs text-slate-400 font-medium">Average Rating</div>
                    </div>
                    <div>
                        <div class="text-2xl sm:text-3xl font-extrabold text-white">&lt;15m</div>
                        <div class="text-xs text-slate-400 font-medium">Response Time</div>
                    </div>
                </div>

                <!-- CTA buttons -->
                <div class="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
                    <a href="{{ route('booking.create') }}" class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-lg shadow-emerald-950/20 glow-blue flex items-center gap-2">
                        Book Service
                        <i data-lucide="arrow-right" class="h-4 w-4"></i>
                    </a>
                    <a href="#services" class="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10">
                        Explore Services
                    </a>
                </div>
            </div>

            <!-- Right content (Dashboard Preview) -->
            <div id="hero-right-dashboard" class="relative">
                <div class="glass-card rounded-2xl p-1 border-white/10 shadow-2xl">
                    <div class="rounded-xl bg-[#0f1422]/90 p-6">
                        
                        <!-- Header -->
                        <div class="mb-4 flex items-center justify-between">
                            <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Dispatch Feed</h3>
                            <div class="flex items-center gap-2">
                                <span class="relative flex h-2 w-2">
                                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                    <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                                </span>
                                <span class="text-xs text-emerald-400 font-semibold uppercase">Active</span>
                            </div>
                        </div>

                        <!-- Feed items -->
                        <div class="space-y-3">
                            <div class="flex items-center gap-3 rounded-lg bg-white/5 p-3 border border-white/5">
                                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                                    <i data-lucide="thermometer" class="h-5 w-5"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-semibold text-slate-200">John D.</span>
                                        <span class="text-[10px] text-slate-500 font-mono">2 min</span>
                                    </div>
                                    <div class="flex items-center justify-between mt-1">
                                        <span class="text-xs text-slate-400">HVAC Tuning</span>
                                        <span class="text-xs font-semibold text-orange-400">En Route</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 rounded-lg bg-white/5 p-3 border border-white/5">
                                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <i data-lucide="droplets" class="h-5 w-5"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-semibold text-slate-200">Sarah M.</span>
                                        <span class="text-[10px] text-slate-500 font-mono">12 min</span>
                                    </div>
                                    <div class="flex items-center justify-between mt-1">
                                        <span class="text-xs text-slate-400">Plumbing Repair</span>
                                        <span class="text-xs font-semibold text-emerald-400">On Site</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 rounded-lg bg-white/5 p-3 border border-white/5">
                                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <i data-lucide="plug" class="h-5 w-5"></i>
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-semibold text-slate-200">Mike R.</span>
                                        <span class="text-[10px] text-slate-500 font-mono">Just now</span>
                                    </div>
                                    <div class="flex items-center justify-between mt-1">
                                        <span class="text-xs text-slate-400">Electrical Setup</span>
                                        <span class="text-xs font-semibold text-indigo-400 font-mono uppercase">Done</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- mini stats -->
                        <div class="mt-4 grid grid-cols-3 gap-3">
                            <div class="rounded-lg bg-white/5 p-3 text-center border border-white/5">
                                <div class="text-base font-bold text-white">128</div>
                                <div class="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Active</div>
                            </div>
                            <div class="rounded-lg bg-white/5 p-3 text-center border border-white/5">
                                <div class="text-base font-bold text-white">47</div>
                                <div class="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Pending</div>
                            </div>
                            <div class="rounded-lg bg-white/5 p-3 text-center border border-white/5">
                                <div class="text-base font-bold text-white">892</div>
                                <div class="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Today</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Floating animations card -->
                <div class="floating absolute -left-8 top-1/4 rounded-xl bg-[#0f1422]/95 p-3 shadow-2xl border border-white/10 z-20">
                    <div class="flex items-center gap-2">
                        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                            <i data-lucide="check" class="h-4 w-4"></i>
                        </div>
                        <div>
                            <div class="text-xs font-semibold text-slate-200">Job Complete</div>
                            <div class="text-[9px] text-slate-400 font-mono">AC Tuning - $285</div>
                        </div>
                    </div>
                </div>

                <div class="floating absolute -right-4 bottom-1/4 rounded-xl bg-[#0f1422]/95 p-3 shadow-2xl border border-white/10 z-20" style="animation-delay: 1.5s;">
                    <div class="flex items-center gap-2">
                        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                            <i data-lucide="map-pin" class="h-4 w-4"></i>
                        </div>
                        <div>
                            <div class="text-xs font-semibold text-slate-200">Tech Arriving</div>
                            <div class="text-[9px] text-slate-400 font-mono">ETA: 8 minutes</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>

<!-- Express Dispatch Runway Simulator Section -->
<section class="relative h-[40vh] w-full overflow-hidden pointer-events-none z-20 flex items-center justify-center">
    <div id="lottie-scooter-container" 
         x-data="{ 
            initLottie() {
                lottie.loadAnimation({
                    container: this.$el,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: '{{ asset('Man_riding_a_red_scooter.json') }}'
                });
            }
         }"
         x-init="initLottie()"
         class="absolute w-[280px] sm:w-[350px] aspect-square flex items-center justify-center">
        <!-- Ambient Shadow Glow -->
        <div class="absolute bottom-[10%] w-[70%] h-3.5 bg-emerald-500/10 rounded-full blur-md -skew-x-12 animate-pulse"></div>
    </div>
</section>

<!-- Services Grid Section -->
<section id="services" class="relative py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div class="text-center">
            <h2 class="text-3xl font-extrabold text-white sm:text-4xl">Our Services</h2>
            <p class="mx-auto mt-4 max-w-xl text-slate-400 text-sm">
                Comprehensive technical dispatches for your residential, business, or complex industrial infrastructure.
            </p>
        </div>

        <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Service 1 -->
            <div class="group glass-card cursor-pointer rounded-2xl p-6 transition-all hover:border-emerald-500/30 hover:scale-[1.02]">
                <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                    <i data-lucide="thermometer" class="h-6 w-6"></i>
                </div>
                <h3 class="mb-2 text-lg font-bold text-white">HVAC Maintenance</h3>
                <p class="text-sm text-slate-400">
                    Heating, cooling, ventilation tuning, and regular environment diagnostics.
                </p>
                <div class="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Book Dispatch</span>
                    <i data-lucide="arrow-right" class="h-3 w-3"></i>
                </div>
            </div>

            <!-- Service 2 -->
            <div class="group glass-card cursor-pointer rounded-2xl p-6 transition-all hover:border-emerald-500/30 hover:scale-[1.02]">
                <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <i data-lucide="droplets" class="h-6 w-6"></i>
                </div>
                <h3 class="mb-2 text-lg font-bold text-white">Advanced Plumbing</h3>
                <p class="text-sm text-slate-400">
                    Leak repair, residential pipeline inspection, and heavy high-capacity installations.
                </p>
                <div class="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Book Dispatch</span>
                    <i data-lucide="arrow-right" class="h-3 w-3"></i>
                </div>
            </div>

            <!-- Service 3 -->
            <div class="group glass-card cursor-pointer rounded-2xl p-6 transition-all hover:border-emerald-500/30 hover:scale-[1.02]">
                <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <i data-lucide="plug" class="h-6 w-6"></i>
                </div>
                <h3 class="mb-2 text-lg font-bold text-white">Electrical Dispatch</h3>
                <p class="text-sm text-slate-400">
                    Power outages, wiring updates, and smart grid automation integrations.
                </p>
                <div class="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Book Dispatch</span>
                    <i data-lucide="arrow-right" class="h-3 w-3"></i>
                </div>
            </div>
        </div>

    </div>
</section>

<!-- Why Choose Us Features Section -->
<section id="features" class="relative py-24 border-t border-white/5 bg-[#0b0f19]/40">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid items-center gap-16 lg:grid-cols-2">
            
            <div>
                <h2 class="text-3xl font-extrabold text-white sm:text-4xl">Platform Capabilities</h2>
                <p class="mt-4 text-slate-400 text-sm">
                    Leveraging native real-time WebSockets and smart queue algorithms to connect you to high-performing technicians instantly.
                </p>

                <div class="mt-10 space-y-6">
                    <div class="flex gap-4">
                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                            <i data-lucide="activity" class="h-6 w-6"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-white text-base">Realtime Navigation Tracking</h3>
                            <p class="mt-1 text-xs text-slate-400 leading-relaxed">
                                Live location sharing powered by native Laravel Reverb WebSocket frames.
                            </p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                            <i data-lucide="zap" class="h-6 w-6"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-white text-base">Smart AI Dispatcher</h3>
                            <p class="mt-1 text-xs text-slate-400 leading-relaxed">
                                Automated queue matching evaluates technician ratings, skillsets, and distance in real time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dashboard Mockup Image with glass overlays -->
            <div class="glass-card rounded-2xl p-2 border-white/5 shadow-2xl">
                <img src="{{ asset('vehicles-perspective.png') }}" class="rounded-xl opacity-90 object-cover w-full h-auto shadow-inner blend-transparent-vehicles" alt="Platform Overview">
            </div>

        </div>
    </div>
</section>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // Use GSAP for simple cinematic entrance animations on landing elements
        gsap.from('#hero-left-content', {
            x: -80,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('#hero-right-dashboard', {
            x: 80,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.2
        });

        // Simple scroll responsive driving scooter animation
        const scooter = document.getElementById('lottie-scooter-container');
        window.addEventListener('scroll', () => {
            const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
            
            // Replicate scooter driving across the runway
            const translatePercent = -40 + (180 * progress); // from -40% to 140%
            gsap.to(scooter, {
                left: `${translatePercent}%`,
                duration: 0.6,
                ease: 'power1.out'
            });
        });
    });
</script>
@endpush

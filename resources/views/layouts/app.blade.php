<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title', 'Schneider - Realtime Smart Dispatch Platform')</title>

    <!-- Google Fonts: Outfit -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">

    <!-- Tailwind & Custom CSS Compiled via Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- inline script to guard against dark mode flashes -->
    <script>
        if (localStorage.getItem('theme') === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    </script>
</head>
<body class="bg-[#0b0f19] text-[#f8fafc] font-sans antialiased overflow-x-hidden relative selection:bg-primary selection:text-white">

    <!-- 3D Scroll Grid Parallax Canvas / Background -->
    @include('components.background-3d')

    <!-- Common Glassmorphic Header / Navbar -->
    @include('components.navbar')

    <!-- Dynamic Session/Toast Notification using Alpine -->
    <div x-data="{ 
            toasts: [],
            add(e) {
                const id = Date.now();
                this.toasts.push({ id, message: e.detail.message, type: e.detail.type || 'success' });
                setTimeout(() => {
                    this.toasts = this.toasts.filter(t => t.id !== id);
                }, 4000);
            }
         }" 
         @toast.window="add($event)" 
         class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        <template x-for="toast in toasts" :key="toast.id">
            <div x-transition:enter="transition ease-out duration-300 transform translate-y-2 opacity-0"
                 x-transition:enter-start="transform translate-y-2 opacity-0"
                 x-transition:enter-end="transform translate-y-0 opacity-100"
                 x-transition:leave="transition ease-in duration-200 transform translate-y-2 opacity-0"
                 class="pointer-events-auto flex items-center gap-3 p-4 rounded-xl border border-white/10 dark:border-white/5 bg-[#151c2c]/80 backdrop-blur-md shadow-2xl min-w-[280px]">
                <div class="h-2 w-2 rounded-full animate-pulse" :class="toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'"></div>
                <p x-text="toast.message" class="text-xs font-semibold text-slate-200"></p>
            </div>
        </template>
    </div>

    <!-- Main Dynamic Content Wrap -->
    <div class="relative z-10">
        @yield('content')
    </div>

    <!-- Footer or script slots -->
    @stack('scripts')
</body>
</html>

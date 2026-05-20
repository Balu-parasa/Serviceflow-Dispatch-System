<nav x-data="{ 
         mobileOpen: false,
         theme: localStorage.getItem('theme') || 'dark',
         toggleTheme() {
             this.theme = this.theme === 'dark' ? 'light' : 'dark';
             localStorage.setItem('theme', this.theme);
             if (this.theme === 'light') {
                 document.documentElement.classList.remove('dark');
             } else {
                 document.documentElement.classList.add('dark');
             }
         }
     }"
     class="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300 border-b border-white/5 dark:border-white/5">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
            
            <!-- Left Brand Logo -->
            <a href="{{ route('home') }}" class="flex items-center gap-2 group">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 glow-blue group-hover:scale-105 transition-transform">
                    <i data-lucide="zap" class="h-5 w-5 text-white"></i>
                </div>
                <span class="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    Schneider
                </span>
            </a>

            <!-- Middle Navigation Links -->
            <div class="hidden items-center gap-8 md:flex">
                <a href="#services" class="text-sm font-medium text-slate-300 transition-colors hover:text-white">Services</a>
                <a href="#features" class="text-sm font-medium text-slate-300 transition-colors hover:text-white">Features</a>
                <a href="#testimonials" class="text-sm font-medium text-slate-300 transition-colors hover:text-white">Testimonials</a>
                <a href="#pricing" class="text-sm font-medium text-slate-300 transition-colors hover:text-white">Pricing</a>
            </div>

            <!-- Right Buttons and Theme Toggler -->
            <div class="flex items-center gap-3">
                <!-- Theme Toggle Button -->
                <button @click="toggleTheme()" class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer">
                    <template x-if="theme === 'dark'">
                        <i data-lucide="sun" class="h-4 w-4"></i>
                    </template>
                    <template x-if="theme === 'light'">
                        <i data-lucide="moon" class="h-4 w-4"></i>
                    </template>
                </button>

                <!-- Dynamic Auth Buttons -->
                @auth
                    <a href="{{ Auth::user()->role->dashboardPath() }}" class="text-sm font-medium px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10">
                        {{ __('Dashboard') }}
                    </a>
                    
                    <form method="POST" action="{{ route('logout') }}" class="inline">
                        @csrf
                        <button type="submit" class="text-sm font-medium px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 transition-all cursor-pointer">
                            <i data-lucide="log-out" class="h-4 w-4 inline mr-1"></i>
                        </button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 text-slate-200 hover:text-white transition-all">
                        Sign In
                    </a>
                    <a href="{{ route('booking.create') }}" class="text-sm font-medium px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-950/20 glow-blue">
                        Book Service
                    </a>
                @endauth

                <!-- Mobile Menu Button -->
                <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 rounded-lg text-slate-300 hover:text-white cursor-pointer">
                    <i data-lucide="menu" class="h-5 w-5" x-show="!mobileOpen"></i>
                    <i data-lucide="x" class="h-5 w-5" x-show="mobileOpen"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Drawer -->
    <div x-show="mobileOpen" x-transition class="md:hidden glass border-t border-white/5 bg-[#0b0f19]/95 px-4 pt-2 pb-4 space-y-1">
        <a href="#services" @click="mobileOpen = false" class="block py-2 text-base font-medium text-slate-300 hover:text-white">Services</a>
        <a href="#features" @click="mobileOpen = false" class="block py-2 text-base font-medium text-slate-300 hover:text-white">Features</a>
        <a href="#testimonials" @click="mobileOpen = false" class="block py-2 text-base font-medium text-slate-300 hover:text-white">Testimonials</a>
        <a href="#pricing" @click="mobileOpen = false" class="block py-2 text-base font-medium text-slate-300 hover:text-white">Pricing</a>
        @auth
            <a href="{{ Auth::user()->role->dashboardPath() }}" class="block py-2 text-base font-medium text-emerald-400">Dashboard</a>
        @else
            <a href="{{ route('login') }}" class="block py-2 text-base font-medium text-slate-300 hover:text-white">Sign In</a>
            <a href="{{ route('booking.create') }}" class="block py-2 text-base font-medium text-emerald-400">Book Service</a>
        @endauth
    </div>
</nav>

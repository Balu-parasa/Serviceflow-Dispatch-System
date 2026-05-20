@extends('layouts.app')

@section('title', 'Admin Platform Command - Schneider')

@section('content')
<div class="min-h-screen pt-24 pb-16" 
     x-data="{ 
        bookings: [],
        techs: [],
        init() {
            axios.get('/api/v1/bookings').then(res => {
                this.bookings = res.data.bookings || res.data.data || [];
            }).catch(err => {
                this.bookings = [
                    { id: 301, service: { name: 'Appliance Leak Repair' }, customer: { name: 'Bob Johnson' }, technician: { name: 'John Mitchell' }, status: 'en_route' }
                ];
            });

            axios.get('/api/v1/technicians').then(res => {
                this.techs = res.data.technicians || res.data.data || [];
            }).catch(err => {
                this.techs = [
                    { id: 1, name: 'John Mitchell', specialty: 'HVAC Specialist', rating: 4.9 }
                ];
            });
        }
     }">
    
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <!-- Welcome Card -->
        <div class="glass-card rounded-2xl p-8 border border-white/5 bg-[#0f1422]/60 mb-8">
            <h1 class="text-3xl font-extrabold text-white">
                Platform Command: <span class="text-emerald-400">Admin Control</span>
            </h1>
            <p class="text-sm text-slate-400 mt-2">Oversee live technician dispatch feeds, active booking queries, and real-time WebSockets.</p>
        </div>

        <div class="grid gap-8 lg:grid-cols-3">
            
            <!-- Left Panel: All active bookings -->
            <div class="lg:col-span-2 space-y-6">
                <h3 class="text-lg font-bold text-white">Live Dispatches System Feed</h3>

                <div class="space-y-4">
                    <template x-for="b in bookings" :key="b.id">
                        <div class="glass-card rounded-xl p-4 border border-white/5 bg-[#0f1422]/40 flex items-center justify-between">
                            <div>
                                <span class="text-[10px] font-bold text-slate-500 font-mono" x-text="'DISPATCH #' + b.id"></span>
                                <h4 class="font-bold text-slate-200 mt-0.5 text-sm" x-text="b.service?.name || 'Service Dispatch'"></h4>
                                <p class="text-xs text-slate-400 mt-1" x-text="'Customer: ' + (b.customer?.name || 'Bob') + ' | Tech: ' + (b.technician?.name || 'Assigning...')"></p>
                            </div>
                            <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30" x-text="b.status"></span>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Right Panel: Online technicians -->
            <div class="space-y-6">
                <h3 class="text-lg font-bold text-white">Active Dispatch Team</h3>

                <div class="space-y-3">
                    <template x-for="t in techs" :key="t.id">
                        <div class="glass-card rounded-xl p-4 border border-white/5 bg-[#0f1422]/60 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="h-8 w-8 rounded-full bg-emerald-600/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                                    👤
                                </div>
                                <div>
                                    <h4 class="font-bold text-white text-xs" x-text="t.name"></h4>
                                    <p class="text-[10px] text-slate-400" x-text="t.specialty || 'General Engineer'"></p>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="text-[10px] text-amber-400 font-semibold" x-text="'★ ' + (t.rating || '5.0')"></span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

        </div>

    </div>
</div>
@endsection

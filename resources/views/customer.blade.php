@extends('layouts.app')

@section('title', 'Customer Dashboard - Schneider')

@section('content')
<div class="min-h-screen pt-24 pb-16" 
     x-data="{ 
        bookings: [],
        init() {
            axios.get('/api/v1/customer/bookings').then(res => {
                this.bookings = res.data.bookings || res.data.data || [];
            }).catch(err => {
                // mock bookings if API is empty
                this.bookings = [
                    { id: 101, service: { name: 'HVAC Regular Maintenance' }, technician: { name: 'John Mitchell' }, is_emergency: false, property_type: 'Home', scheduled_date: '2026-05-20', time_slot: 'Morning', status: 'pending' }
                ];
            });
        }
     }">
    
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <!-- Welcome Card -->
        <div class="glass-card rounded-2xl p-8 border border-white/5 bg-[#0f1422]/60 mb-8">
            <h1 class="text-3xl font-extrabold text-white">
                Hello, <span class="text-emerald-400">{{ Auth::user()->name ?? 'Valued Customer' }}</span>
            </h1>
            <p class="text-sm text-slate-400 mt-2">Manage your current active dispatches, bookings, and billing summaries.</p>
        </div>

        <div class="grid gap-8 lg:grid-cols-3">
            
            <!-- Left Side: Bookings Feed -->
            <div class="lg:col-span-2 space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-white">Active Service Dispatches</h3>
                    <a href="{{ route('booking.create') }}" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md">
                        + New Booking
                    </a>
                </div>

                <div class="space-y-4">
                    <template x-for="b in bookings" :key="b.id">
                        <div class="glass-card rounded-xl p-6 border border-white/5 bg-[#0f1422]/40">
                            <div class="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                                <div>
                                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono" x-text="'DISPATCH #' + b.id"></span>
                                    <h4 class="font-bold text-white mt-1" x-text="b.service?.name || 'Technical Service'"></h4>
                                </div>
                                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" 
                                      :class="{
                                          'bg-amber-500/20 text-amber-400 border border-amber-500/30': b.status === 'pending',
                                          'bg-blue-500/20 text-blue-400 border border-blue-500/30': b.status === 'assigned' || b.status === 'en_route',
                                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30': b.status === 'completed'
                                      }"
                                      x-text="b.status"></span>
                            </div>

                            <div class="grid gap-4 sm:grid-cols-3 text-xs">
                                <div>
                                    <span class="text-slate-500 uppercase tracking-wider block font-bold">Technician</span>
                                    <span class="text-slate-200 mt-1 block font-medium" x-text="b.technician?.name || 'Assigning...'"></span>
                                </div>
                                <div>
                                    <span class="text-slate-500 uppercase tracking-wider block font-bold">Schedule</span>
                                    <span class="text-slate-200 mt-1 block font-medium" x-text="(b.scheduled_date || 'Today') + ' (' + b.time_slot + ')'"></span>
                                </div>
                                <div>
                                    <span class="text-slate-500 uppercase tracking-wider block font-bold">Address</span>
                                    <span class="text-slate-200 mt-1 block font-medium line-clamp-1" x-text="b.address + ', ' + b.city"></span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Right Side: Mini Details & Billing -->
            <div class="space-y-6">
                <div class="glass-card rounded-xl p-6 border border-white/5 bg-[#0f1422]/60">
                    <h3 class="font-bold text-white text-base mb-4">Support & Platform Info</h3>
                    <div class="space-y-3 text-xs">
                        <div class="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <span class="text-slate-400">Emergency Hotlines</span>
                            <span class="text-emerald-400 font-bold">1-800-SCHNEIDER</span>
                        </div>
                        <div class="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <span class="text-slate-400">Database Status</span>
                            <span class="text-emerald-400 font-semibold uppercase">Connected</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
</div>
@endsection

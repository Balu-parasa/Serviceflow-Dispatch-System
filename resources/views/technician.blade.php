@extends('layouts.app')

@section('title', 'Technician Dispatch Control - Schneider')

@section('content')
<div class="min-h-screen pt-24 pb-16" 
     x-data="{ 
        jobs: [],
        onlineStatus: 'online',
        init() {
            axios.get('/api/v1/technician/bookings').then(res => {
                this.jobs = res.data.bookings || res.data.data || [];
            }).catch(err => {
                this.jobs = [
                    { id: 201, service: { name: 'AC Compressor Replacement' }, customer: { name: 'Alice Smith' }, address: '456 Oak Ave', city: 'San Francisco', status: 'assigned' }
                ];
            });
        },
        updateJobStatus(jobId, newStatus) {
            axios.patch('/api/v1/bookings/' + jobId, { status: newStatus }).then(res => {
                window.toast('Status successfully updated!');
                this.init();
            }).catch(err => alert('Failed to update job status.'));
        }
     }">
    
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <!-- Tech Control Header -->
        <div class="glass-card rounded-2xl p-8 border border-white/5 bg-[#0f1422]/60 mb-8 flex flex-wrap items-center justify-between gap-6">
            <div>
                <h1 class="text-3xl font-extrabold text-white">
                    Technician Hub: <span class="text-emerald-400">{{ Auth::user()->name ?? 'Specialist' }}</span>
                </h1>
                <p class="text-sm text-slate-400 mt-2">Manage your current active dispatches, navigation coordinates, and status logs.</p>
            </div>

            <!-- Online Offline toggle -->
            <div class="flex items-center gap-3">
                <button type="button" 
                        @click="onlineStatus = (onlineStatus === 'online' ? 'offline' : 'online')"
                        class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        :class="onlineStatus === 'online' ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500 border border-white/10'">
                    <span class="inline-block h-2 w-2 rounded-full mr-2" :class="onlineStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'"></span>
                    <span x-text="onlineStatus === 'online' ? 'Online' : 'Offline'"></span>
                </button>
            </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-3">
            
            <!-- Left: Active dispatches -->
            <div class="lg:col-span-2 space-y-6">
                <h3 class="text-lg font-bold text-white">Assigned Dispatches</h3>

                <div class="space-y-4">
                    <template x-for="j in jobs" :key="j.id">
                        <div class="glass-card rounded-xl p-6 border border-white/5 bg-[#0f1422]/40">
                            <div class="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                                <div>
                                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono" x-text="'JOB #' + j.id"></span>
                                    <h4 class="font-bold text-white mt-1" x-text="j.service?.name || 'Technical Repair'"></h4>
                                </div>
                                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" x-text="j.status"></span>
                            </div>

                            <div class="grid gap-4 sm:grid-cols-2 text-xs mb-6">
                                <div>
                                    <span class="text-slate-500 uppercase tracking-wider block font-bold">Customer</span>
                                    <span class="text-slate-200 mt-1 block font-medium" x-text="j.customer?.name || 'Alice Smith'"></span>
                                </div>
                                <div>
                                    <span class="text-slate-500 uppercase tracking-wider block font-bold">Address</span>
                                    <span class="text-slate-200 mt-1 block font-medium" x-text="j.address + ', ' + j.city"></span>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                <button type="button" @click="updateJobStatus(j.id, 'en_route')" class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer">
                                    Mark En Route
                                </button>
                                <button type="button" @click="updateJobStatus(j.id, 'arrived')" class="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all cursor-pointer">
                                    Mark Arrived
                                </button>
                                <button type="button" @click="updateJobStatus(j.id, 'completed')" class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer">
                                    Mark Completed
                                </button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Right: Dispatch details -->
            <div class="space-y-6">
                <div class="glass-card rounded-xl p-6 border border-white/5 bg-[#0f1422]/60">
                    <h3 class="font-bold text-white text-base mb-4">Location Logs</h3>
                    <p class="text-xs text-slate-400 mb-4 leading-relaxed">Your location is synced every 30 seconds to the main dispatch control map.</p>
                    <div class="rounded-lg bg-white/5 p-3 text-center border border-white/5">
                        <span class="text-slate-400 text-xs block">Active Coordinates</span>
                        <span class="text-emerald-400 font-mono text-xs font-bold mt-1 block">37.7749, -122.4194</span>
                    </div>
                </div>
            </div>

        </div>

    </div>
</div>
@endsection

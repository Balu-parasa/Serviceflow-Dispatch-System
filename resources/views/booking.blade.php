@extends('layouts.app')

@section('title', 'Book a Service - Schneider Monolith')

@section('content')
<div class="min-h-screen pt-24 pb-16" 
     x-data="{ 
        step: 1,
        isEmergency: false,
        propertyType: 'home',
        selectedService: '',
        selectedTech: '',
        address: '',
        city: '',
        zipCode: '',
        notes: '',
        scheduledDate: '',
        timeSlot: 'morning',
        specificTime: '',
        services: [],
        technicians: [],
        isSubmitting: false,

        init() {
            // Load live services and techs from endpoints
            axios.get('/api/v1/services').then(res => {
                this.services = res.data.services || res.data.data || [];
            }).catch(e => {
                this.services = [
                    { id: 1, name: 'HVAC Repair', base_price: 89, description: 'Heating, AC and ventilation tuning' },
                    { id: 2, name: 'Plumbing Service', base_price: 75, description: 'Leak repairs and diagnostics' },
                    { id: 3, name: 'Electrical Dispatch', base_price: 85, description: 'Wiring and emergency repairs' }
                ];
            });

            axios.get('/api/v1/technicians').then(res => {
                this.technicians = res.data.technicians || res.data.data || [];
            }).catch(e => {
                this.technicians = [
                    { id: 1, name: 'John Mitchell', specialty: 'HVAC Specialist', rating: '4.9', eta: '15 min' }
                ];
            });
        },

        submitBooking() {
            this.isSubmitting = true;
            axios.post('/api/v1/bookings', {
                service_id: this.selectedService,
                technician_id: this.selectedTech || null,
                is_emergency: this.isEmergency,
                property_type: this.propertyType,
                address: this.address,
                city: this.city,
                zip_code: this.zipCode,
                scheduled_date: this.scheduledDate || null,
                time_slot: this.timeSlot,
                specific_time: this.specificTime,
                notes: this.notes
            }).then(res => {
                window.toast('Booking created successfully!');
                setTimeout(() => {
                    window.location.href = '/customer/dashboard';
                }, 1500);
            }).catch(err => {
                this.isSubmitting = false;
                alert(err.response?.data?.message || 'Failed to submit booking. Check all fields.');
            });
        }
     }">

    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <!-- Step Indicators -->
        <div class="mb-12">
            <div class="flex items-center justify-between">
                <template x-for="s in [1, 2, 3, 4]" :key="s">
                    <div class="flex items-center flex-1 last:flex-initial">
                        <div class="flex flex-col items-center">
                            <div class="flex h-10 w-10 items-center justify-center rounded-full border transition-all text-xs font-bold font-mono"
                                 :class="step >= s ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 border-white/10 text-slate-500'">
                                <span x-text="s"></span>
                            </div>
                        </div>
                        <div class="flex-grow mx-4 h-[2px]" 
                             :class="step > s ? 'bg-emerald-600' : 'bg-white/5'"></div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Wizard Box -->
        <div class="glass-card rounded-2xl p-8 border border-white/5 bg-[#0f1422]/60 backdrop-blur-md">
            
            <!-- STEP 1: SERVICE & EMERGENCY -->
            <div x-show="step === 1" x-transition>
                <div class="mb-8 text-center">
                    <h2 class="text-2xl font-extrabold text-white">Select a Service</h2>
                    <p class="text-sm text-slate-400 mt-2">What kind of maintenance task do you need assistance with today?</p>
                </div>

                <!-- Emergency Switcher -->
                <div class="mb-8 flex justify-center">
                    <button type="button" 
                            @click="isEmergency = !isEmergency" 
                            class="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                            :class="isEmergency ? 'bg-red-600 hover:bg-red-500 text-white glow-red shadow-lg shadow-red-600/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'">
                        <i data-lucide="alert-triangle" class="h-4 w-4 inline mr-1"></i>
                        <span x-text="isEmergency ? 'Priority Emergency Active' : 'Activate 24/7 Priority Emergency'"></span>
                    </button>
                </div>

                <!-- Services List -->
                <div class="grid gap-4 sm:grid-cols-3">
                    <template x-for="item in services" :key="item.id">
                        <button type="button" 
                                @click="selectedService = item.id"
                                class="relative p-6 text-left rounded-xl border transition-all cursor-pointer"
                                :class="selectedService == item.id ? 'bg-emerald-600/25 border-emerald-500 ring-2 ring-emerald-500/50 scale-[1.02]' : 'bg-white/5 border-white/5 hover:border-white/15'">
                            
                            <!-- selection checkmark -->
                            <div class="absolute top-3 right-3 h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]" x-show="selectedService == item.id">
                                ✓
                            </div>

                            <h4 x-text="item.name" class="font-bold text-white text-base"></h4>
                            <p x-text="item.description" class="text-xs text-slate-400 mt-2 line-clamp-2"></p>
                            <span class="text-xs font-semibold text-emerald-400 mt-4 block" x-text="'From $' + (item.base_price || 89)"></span>
                        </button>
                    </template>
                </div>
            </div>

            <!-- STEP 2: LOCATION & PROPERTY -->
            <div x-show="step === 2" x-transition>
                <div class="mb-8 text-center">
                    <h2 class="text-2xl font-extrabold text-white">Service Location</h2>
                    <p class="text-sm text-slate-400 mt-2">Specify your physical address and type of property.</p>
                </div>

                <!-- Property selector -->
                <div class="grid gap-4 sm:grid-cols-3 mb-8">
                    <button type="button" @click="propertyType = 'home'" class="p-4 rounded-xl border flex items-center gap-3 cursor-pointer" :class="propertyType === 'home' ? 'bg-emerald-600/20 border-emerald-500' : 'bg-white/5 border-white/5'">
                        <i data-lucide="home" class="h-5 w-5 text-emerald-400"></i>
                        <span class="text-sm font-semibold text-slate-200">Residential</span>
                    </button>
                    <button type="button" @click="propertyType = 'commercial'" class="p-4 rounded-xl border flex items-center gap-3 cursor-pointer" :class="propertyType === 'commercial' ? 'bg-emerald-600/20 border-emerald-500' : 'bg-white/5 border-white/5'">
                        <i data-lucide="building" class="h-5 w-5 text-emerald-400"></i>
                        <span class="text-sm font-semibold text-slate-200">Commercial</span>
                    </button>
                    <button type="button" @click="propertyType = 'industrial'" class="p-4 rounded-xl border flex items-center gap-3 cursor-pointer" :class="propertyType === 'industrial' ? 'bg-emerald-600/20 border-emerald-500' : 'bg-white/5 border-white/5'">
                        <i data-lucide="factory" class="h-5 w-5 text-emerald-400"></i>
                        <span class="text-sm font-semibold text-slate-200">Industrial</span>
                    </button>
                </div>

                <!-- Address Inputs -->
                <div class="space-y-4">
                    <div>
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Street Address</label>
                        <input type="text" x-model="address" placeholder="123 Main Street" class="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white mt-2 focus:outline-none focus:border-emerald-500 transition-all" />
                    </div>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-400">City</label>
                            <input type="text" x-model="city" placeholder="San Francisco" class="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white mt-2 focus:outline-none focus:border-emerald-500 transition-all" />
                        </div>
                        <div>
                            <label class="text-xs font-bold uppercase tracking-wider text-slate-400">ZIP Code</label>
                            <input type="text" x-model="zipCode" placeholder="94102" class="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white mt-2 focus:outline-none focus:border-emerald-500 transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- STEP 3: SCHEDULE & SCHEDULER -->
            <div x-show="step === 3" x-transition>
                <div class="mb-8 text-center">
                    <h2 class="text-2xl font-extrabold text-white">Schedule Dispatch</h2>
                    <p class="text-sm text-slate-400 mt-2">When should our engineer arrive at your location?</p>
                </div>

                <div class="grid gap-6 sm:grid-cols-2">
                    <!-- Date Input -->
                    <div>
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Preferred Date</label>
                        <input type="date" x-model="scheduledDate" class="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white mt-2 focus:outline-none focus:border-emerald-500 transition-all" />
                    </div>

                    <!-- Time Slots -->
                    <div>
                        <label class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Preferred Slot</label>
                        <div class="space-y-2">
                            <button type="button" @click="timeSlot = 'morning'; specificTime = '09:00 AM'" class="w-full text-left p-3 rounded-lg border text-xs font-semibold cursor-pointer" :class="timeSlot === 'morning' ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-slate-300'">
                                Morning (08:00 AM - 12:00 PM)
                            </button>
                            <button type="button" @click="timeSlot = 'afternoon'; specificTime = '02:00 PM'" class="w-full text-left p-3 rounded-lg border text-xs font-semibold cursor-pointer" :class="timeSlot === 'afternoon' ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-slate-300'">
                                Afternoon (12:00 PM - 05:00 PM)
                            </button>
                            <button type="button" @click="timeSlot = 'evening'; specificTime = '06:00 PM'" class="w-full text-left p-3 rounded-lg border text-xs font-semibold cursor-pointer" :class="timeSlot === 'evening' ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-slate-300'">
                                Evening (05:00 PM - 08:00 PM)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- STEP 4: CHOOSE TECH & CONFIRM -->
            <div x-show="step === 4" x-transition>
                <div class="mb-8 text-center">
                    <h2 class="text-2xl font-extrabold text-white">Select Engineer & Confirm</h2>
                    <p class="text-sm text-slate-400 mt-2">Pick an available specialist nearby to finalize dispatch.</p>
                </div>

                <div class="space-y-3 mb-6 max-h-[220px] overflow-y-auto pr-2">
                    <template x-for="tech in technicians" :key="tech.id">
                        <button type="button" 
                                @click="selectedTech = tech.id"
                                class="relative w-full p-4 text-left rounded-xl border flex items-center justify-between cursor-pointer"
                                :class="selectedTech == tech.id ? 'bg-emerald-600/20 border-emerald-500' : 'bg-white/5 border-white/5'">
                            <div class="flex items-center gap-3">
                                <div class="h-9 w-9 rounded-full bg-emerald-600/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                                    👤
                                </div>
                                <div>
                                    <h4 class="font-bold text-white text-sm" x-text="tech.name"></h4>
                                    <p class="text-xs text-slate-400" x-text="tech.specialty || 'General Engineer'"></p>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="text-xs text-emerald-400 block font-semibold" x-text="'ETA: ' + (tech.eta || '15 min')"></span>
                            </div>
                        </button>
                    </template>
                </div>

                <!-- Notes -->
                <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-slate-400">Additional Instructions</label>
                    <textarea x-model="notes" rows="3" placeholder="Provide extra details for the service dispatcher..." class="block w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white mt-2 focus:outline-none focus:border-emerald-500 transition-all"></textarea>
                </div>
            </div>

            <!-- Footer navigation -->
            <div class="mt-8 flex justify-between gap-4 pt-6 border-t border-white/5">
                <button type="button" 
                        @click="if(step > 1) { step-- } else { window.location.href = '/' }" 
                        class="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors cursor-pointer">
                    Back
                </button>

                <button type="button" 
                        x-show="step < 4" 
                        @click="if(selectedService || step > 1) { step++ } else { alert('Please select a service first') }" 
                        class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer">
                    Next
                </button>

                <button type="button" 
                        x-show="step === 4" 
                        @click="submitBooking()"
                        :disabled="isSubmitting"
                        class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-2 cursor-pointer">
                    <span x-text="isSubmitting ? 'Creating Dispatch...' : 'Confirm Dispatch'"></span>
                    <i data-lucide="check" class="h-4 w-4"></i>
                </button>
            </div>

        </div>
    </div>
</div>
@endsection

<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Enums\TechnicianStatus;
use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\Service;
use App\Models\TechnicianLocation;
use App\Models\TechnicianProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@schneider.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Admin,
            'phone' => '+1 555-0100',
        ]);

        $customer = User::create([
            'name' => 'Sarah Johnson',
            'email' => 'customer@schneider.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Customer,
            'phone' => '+1 555-0101',
        ]);

        $jessica = User::create([
            'name' => 'Jessica Martinez',
            'email' => 'jessica@schneider.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Customer,
            'phone' => '+1 555-0201',
        ]);

        $david = User::create([
            'name' => 'David Chen',
            'email' => 'david_customer@schneider.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Customer,
            'phone' => '+1 555-0202',
        ]);

        $thompson = User::create([
            'name' => 'Sarah Thompson',
            'email' => 'thompson@schneider.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Customer,
            'phone' => '+1 555-0203',
        ]);

        $balu = User::create([
            'name' => 'Balu Parasa',
            'email' => 'baluparasa3@gmail.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Customer,
            'phone' => '+1 555-0301',
        ]);

        $technicians = [
            ['name' => 'John Mitchell', 'email' => 'john@schneider.com', 'specialty' => 'HVAC', 'status' => TechnicianStatus::Online],
            ['name' => 'Maria Garcia', 'email' => 'maria@schneider.com', 'specialty' => 'Plumbing', 'status' => TechnicianStatus::Busy],
            ['name' => 'David Chen', 'email' => 'david@schneider.com', 'specialty' => 'Electrical', 'status' => TechnicianStatus::Online],
            ['name' => 'Emily Watson', 'email' => 'emily@schneider.com', 'specialty' => 'Emergency Services', 'status' => TechnicianStatus::Emergency],
        ];

        $techUsers = collect();
        foreach ($technicians as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => UserRole::Technician,
                'phone' => '+1 555-'.rand(1000, 9999),
            ]);

            TechnicianProfile::create([
                'user_id' => $user->id,
                'specialty' => $data['specialty'],
                'status' => $data['status'],
                'rating' => rand(46, 50) / 10,
                'total_jobs' => rand(80, 350),
                'hourly_rate' => rand(65, 120),
                'verified' => true,
                'vehicle' => 'Ford Transit',
                'license_plate' => 'SS-'.rand(1000, 9999),
            ]);

            TechnicianLocation::create([
                'technician_id' => $user->id,
                'latitude' => 37.7749 + (rand(-100, 100) / 1000),
                'longitude' => -122.4194 + (rand(-100, 100) / 1000),
                'eta_minutes' => rand(5, 25),
            ]);

            $techUsers->push($user);
        }

        $services = [
            ['slug' => 'hvac', 'name' => 'HVAC', 'category' => 'HVAC', 'icon' => 'wind', 'base_price' => 89],
            ['slug' => 'plumbing', 'name' => 'Plumbing', 'category' => 'Plumbing', 'icon' => 'droplets', 'base_price' => 75],
            ['slug' => 'electrical', 'name' => 'Electrical', 'category' => 'Electrical', 'icon' => 'zap', 'base_price' => 85],
            ['slug' => 'appliance', 'name' => 'Appliance Repair', 'category' => 'Appliance', 'icon' => 'refrigerator', 'base_price' => 69],
            ['slug' => 'industrial', 'name' => 'Industrial Maintenance', 'category' => 'Industrial', 'icon' => 'factory', 'base_price' => 150],
            ['slug' => 'emergency', 'name' => 'Emergency Services', 'category' => 'Emergency', 'icon' => 'alert-triangle', 'base_price' => 120, 'is_emergency' => true],
        ];

        foreach ($services as $i => $service) {
            Service::create(array_merge($service, [
                'description' => "Professional {$service['name']} services",
                'emergency_multiplier' => 1.5,
                'sort_order' => $i,
            ]));
        }

        $hvac = Service::where('slug', 'hvac')->first();
        $plumbing = Service::where('slug', 'plumbing')->first();

        Booking::create([
            'reference' => 'SSS-DEMO0001',
            'customer_id' => $customer->id,
            'technician_id' => $techUsers[0]->id,
            'service_id' => $hvac->id,
            'status' => BookingStatus::EnRoute,
            'property_type' => 'home',
            'address' => '742 Evergreen Terrace',
            'city' => 'San Francisco',
            'zip_code' => '94102',
            'latitude' => 37.7749,
            'longitude' => -122.4194,
            'scheduled_date' => now()->toDateString(),
            'time_slot' => 'afternoon',
            'specific_time' => '2:00 PM',
            'estimated_cost' => 89,
            'eta_minutes' => 12,
            'priority' => 'normal',
            'assigned_at' => now()->subHour(),
            'accepted_at' => now()->subMinutes(45),
            'en_route_at' => now()->subMinutes(20),
        ]);

        Booking::create([
            'reference' => 'SSS-DEMO0002',
            'customer_id' => $customer->id,
            'technician_id' => null,
            'service_id' => $plumbing->id,
            'status' => BookingStatus::Pending,
            'is_emergency' => true,
            'property_type' => 'commercial',
            'address' => '100 Market Street',
            'city' => 'San Francisco',
            'zip_code' => '94105',
            'estimated_cost' => 180,
            'priority' => 'emergency',
        ]);

        // Seed completed bookings and reviews for original testimonials
        $booking3 = Booking::create([
            'reference' => 'SSS-TEST0001',
            'customer_id' => $jessica->id,
            'technician_id' => $techUsers[0]->id, // John Mitchell
            'service_id' => $hvac->id,
            'status' => BookingStatus::Completed,
            'property_type' => 'home',
            'address' => '124 Park Line Ave',
            'city' => 'San Francisco',
            'zip_code' => '94103',
            'latitude' => 37.7749,
            'longitude' => -122.4194,
            'scheduled_date' => now()->subDays(2)->toDateString(),
            'time_slot' => 'morning',
            'specific_time' => '10:00 AM',
            'estimated_cost' => 120,
            'final_cost' => 120,
            'eta_minutes' => 8,
            'priority' => 'normal',
            'assigned_at' => now()->subDays(2)->subHours(2),
            'accepted_at' => now()->subDays(2)->subHours(2)->addMinutes(5),
            'en_route_at' => now()->subDays(2)->subHours(2)->addMinutes(15),
            'started_at' => now()->subDays(2)->subHour(),
            'completed_at' => now()->subDays(2)->subMinutes(15),
        ]);

        \App\Models\Review::create([
            'booking_id' => $booking3->id,
            'customer_id' => $jessica->id,
            'technician_id' => $techUsers[0]->id,
            'rating' => 5,
            'comment' => 'The realtime tracking feature is incredible. I knew exactly when the technician would arrive and could follow their progress. The repair was quick and professional.',
        ]);

        $booking4 = Booking::create([
            'reference' => 'SSS-TEST0002',
            'customer_id' => $david->id,
            'technician_id' => $techUsers[1]->id, // Maria Garcia
            'service_id' => $plumbing->id,
            'status' => BookingStatus::Completed,
            'property_type' => 'commercial',
            'address' => '555 Mission St',
            'city' => 'San Francisco',
            'zip_code' => '94105',
            'latitude' => 37.7891,
            'longitude' => -122.4014,
            'scheduled_date' => now()->subDays(5)->toDateString(),
            'time_slot' => 'afternoon',
            'specific_time' => '3:30 PM',
            'estimated_cost' => 150,
            'final_cost' => 150,
            'eta_minutes' => 15,
            'priority' => 'normal',
            'assigned_at' => now()->subDays(5)->subHours(3),
            'accepted_at' => now()->subDays(5)->subHours(3)->addMinutes(10),
            'en_route_at' => now()->subDays(5)->subHours(2),
            'started_at' => now()->subDays(5)->subHour(),
            'completed_at' => now()->subDays(5)->subMinutes(10),
        ]);

        \App\Models\Review::create([
            'booking_id' => $booking4->id,
            'customer_id' => $david->id,
            'technician_id' => $techUsers[1]->id,
            'rating' => 5,
            'comment' => 'Managing multiple properties used to be a nightmare. Now I can dispatch technicians to any location instantly and track all jobs from one dashboard.',
        ]);

        $emergency = Service::where('slug', 'emergency')->first();
        $booking5 = Booking::create([
            'reference' => 'SSS-TEST0003',
            'customer_id' => $thompson->id,
            'technician_id' => $techUsers[3]->id, // Emily Watson (Emergency)
            'service_id' => $emergency->id,
            'status' => BookingStatus::Completed,
            'is_emergency' => true,
            'property_type' => 'commercial',
            'address' => '900 Front St',
            'city' => 'San Francisco',
            'zip_code' => '94111',
            'latitude' => 37.8001,
            'longitude' => -122.4005,
            'scheduled_date' => now()->subDays(1)->toDateString(),
            'time_slot' => 'morning',
            'specific_time' => '8:15 AM',
            'estimated_cost' => 180,
            'final_cost' => 240,
            'eta_minutes' => 20,
            'priority' => 'emergency',
            'assigned_at' => now()->subDays(1)->subHour(),
            'accepted_at' => now()->subDays(1)->subMinutes(55),
            'en_route_at' => now()->subDays(1)->subMinutes(50),
            'started_at' => now()->subDays(1)->subMinutes(30),
            'completed_at' => now()->subDays(1)->subMinutes(5),
        ]);

        \App\Models\Review::create([
            'booking_id' => $booking5->id,
            'customer_id' => $thompson->id,
            'technician_id' => $techUsers[3]->id,
            'rating' => 5,
            'comment' => 'The emergency response time is unmatched. When our HVAC system failed during a heatwave, they had a technician on-site within 20 minutes.',
        ]);

        $this->command->info('Seeded demo users:');
        $this->command->info('  Admin: admin@schneider.com / password');
        $this->command->info('  Customer: customer@schneider.com / password');
        $this->command->info('  Balu Parasa: baluparasa3@gmail.com / password');
        $this->command->info('  Technicians: john@schneider.com, maria@schneider.com, etc. / password');
    }
}

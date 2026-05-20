<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->after('email');
            $table->string('phone')->nullable()->after('role');
            $table->string('avatar')->nullable()->after('phone');
        });

        Schema::create('technician_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('specialty');
            $table->string('status')->default('offline');
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->unsignedInteger('total_jobs')->default(0);
            $table->decimal('hourly_rate', 8, 2)->default(75.00);
            $table->boolean('verified')->default(false);
            $table->string('vehicle')->nullable();
            $table->string('license_plate')->nullable();
            $table->json('skills')->nullable();
            $table->json('service_areas')->nullable();
            $table->timestamps();

            $table->unique('user_id');
            $table->index('status');
            $table->index('specialty');
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('category');
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->decimal('base_price', 10, 2)->default(0);
            $table->decimal('emergency_multiplier', 4, 2)->default(1.5);
            $table->boolean('is_emergency')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('customer_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('label')->default('Home');
            $table->string('property_type')->default('home');
            $table->string('address');
            $table->string('city');
            $table->string('zip_code');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'is_default']);
        });

        Schema::create('favorite_technicians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('technician_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['customer_id', 'technician_id']);
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('technician_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('pending');
            $table->boolean('is_emergency')->default(false);
            $table->string('property_type')->default('home');
            $table->string('address');
            $table->string('city');
            $table->string('zip_code');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->date('scheduled_date')->nullable();
            $table->string('time_slot')->nullable();
            $table->string('specific_time')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('estimated_cost', 10, 2)->nullable();
            $table->decimal('final_cost', 10, 2)->nullable();
            $table->unsignedSmallInteger('eta_minutes')->nullable();
            $table->string('priority')->default('normal');
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('en_route_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index(['customer_id', 'status']);
            $table->index(['technician_id', 'status']);
            $table->index('is_emergency');
            $table->index('scheduled_date');
        });

        Schema::create('booking_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('note')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['booking_id', 'created_at']);
        });

        Schema::create('technician_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('technician_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->decimal('heading', 5, 2)->nullable();
            $table->decimal('speed', 6, 2)->nullable();
            $table->unsignedSmallInteger('eta_minutes')->nullable();
            $table->timestamps();

            $table->index(['technician_id', 'created_at']);
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            $table->string('status')->default('pending');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('method')->default('card');
            $table->string('transaction_id')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['customer_id', 'status']);
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('technician_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->unique('booking_id');
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('receiver_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['booking_id', 'created_at']);
            $table->index(['receiver_id', 'is_read']);
        });

        Schema::create('platform_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_read', 'created_at']);
        });

        Schema::create('analytics_snapshots', function (Blueprint $table) {
            $table->id();
            $table->string('metric_key');
            $table->decimal('value', 14, 2);
            $table->json('dimensions')->nullable();
            $table->timestamp('recorded_at');
            $table->timestamps();

            $table->index(['metric_key', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_snapshots');
        Schema::dropIfExists('platform_notifications');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('technician_locations');
        Schema::dropIfExists('booking_status_logs');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('favorite_technicians');
        Schema::dropIfExists('customer_addresses');
        Schema::dropIfExists('services');
        Schema::dropIfExists('technician_profiles');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'avatar']);
        });
    }
};

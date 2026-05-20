<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    protected $fillable = [
        'reference',
        'customer_id',
        'technician_id',
        'service_id',
        'status',
        'is_emergency',
        'property_type',
        'address',
        'city',
        'zip_code',
        'latitude',
        'longitude',
        'scheduled_date',
        'time_slot',
        'specific_time',
        'notes',
        'estimated_cost',
        'final_cost',
        'eta_minutes',
        'priority',
        'assigned_at',
        'accepted_at',
        'en_route_at',
        'started_at',
        'completed_at',
        'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => BookingStatus::class,
            'is_emergency' => 'boolean',
            'scheduled_date' => 'date',
            'estimated_cost' => 'decimal:2',
            'final_cost' => 'decimal:2',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'assigned_at' => 'datetime',
            'accepted_at' => 'datetime',
            'en_route_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function technician(): BelongsTo
    {
        return $this->belongsTo(User::class, 'technician_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(BookingStatusLog::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}

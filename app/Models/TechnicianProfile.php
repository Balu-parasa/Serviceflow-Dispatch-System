<?php

namespace App\Models;

use App\Enums\TechnicianStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TechnicianProfile extends Model
{
    protected $fillable = [
        'user_id',
        'specialty',
        'status',
        'rating',
        'total_jobs',
        'hourly_rate',
        'verified',
        'vehicle',
        'license_plate',
        'skills',
        'service_areas',
    ];

    protected function casts(): array
    {
        return [
            'status' => TechnicianStatus::class,
            'rating' => 'decimal:2',
            'hourly_rate' => 'decimal:2',
            'verified' => 'boolean',
            'skills' => 'array',
            'service_areas' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(TechnicianLocation::class, 'technician_id', 'user_id');
    }

    public function latestLocation(): ?TechnicianLocation
    {
        return TechnicianLocation::query()
            ->where('technician_id', $this->user_id)
            ->latest()
            ->first();
    }
}

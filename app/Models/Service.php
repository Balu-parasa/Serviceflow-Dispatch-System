<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'category',
        'description',
        'icon',
        'base_price',
        'emergency_multiplier',
        'is_emergency',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'emergency_multiplier' => 'decimal:2',
            'is_emergency' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}

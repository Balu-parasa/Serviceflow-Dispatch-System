<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyticsSnapshot extends Model
{
    protected $fillable = [
        'metric_key',
        'value',
        'dimensions',
        'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'dimensions' => 'array',
            'recorded_at' => 'datetime',
        ];
    }
}

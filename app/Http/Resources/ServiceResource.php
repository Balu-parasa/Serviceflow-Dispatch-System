<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'category' => $this->category,
            'description' => $this->description,
            'icon' => $this->icon,
            'base_price' => (float) $this->base_price,
            'emergency_multiplier' => (float) $this->emergency_multiplier,
            'is_emergency' => $this->is_emergency,
        ];
    }
}

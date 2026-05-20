<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TechnicianProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'specialty' => $this->specialty,
            'status' => $this->status?->value ?? $this->status,
            'rating' => (float) $this->rating,
            'total_jobs' => $this->total_jobs,
            'hourly_rate' => (float) $this->hourly_rate,
            'verified' => $this->verified,
            'vehicle' => $this->vehicle,
            'license_plate' => $this->license_plate,
            'skills' => $this->skills ?? [],
            'service_areas' => $this->service_areas ?? [],
        ];
    }
}

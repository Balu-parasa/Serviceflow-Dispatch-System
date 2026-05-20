<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'role' => $this->role?->value ?? $this->role,
            'dashboard_path' => $this->role?->dashboardPath(),
            'technician_profile' => $this->when(
                $this->relationLoaded('technicianProfile') && $this->technicianProfile,
                fn () => new TechnicianProfileResource($this->technicianProfile),
            ),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

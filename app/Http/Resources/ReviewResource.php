<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $role = 'Verified Customer';
        if ($this->customer) {
            if ($this->customer->name === 'Jessica Martinez') {
                $role = 'Homeowner';
            } elseif ($this->customer->name === 'David Chen') {
                $role = 'Property Manager';
            } elseif ($this->customer->name === 'Sarah Thompson') {
                $role = 'Business Owner';
            } else {
                $role = 'Verified ' . ucfirst($this->customer->role->value);
            }
        }

        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'customer_name' => $this->customer?->name ?? 'Verified Customer',
            'customer_role' => $role,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

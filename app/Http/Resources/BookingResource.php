<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'status' => $this->status?->value ?? $this->status,
            'status_label' => $this->status?->label(),
            'is_emergency' => $this->is_emergency,
            'property_type' => $this->property_type,
            'address' => $this->address,
            'city' => $this->city,
            'zip_code' => $this->zip_code,
            'latitude' => $this->latitude ? (float) $this->latitude : null,
            'longitude' => $this->longitude ? (float) $this->longitude : null,
            'scheduled_date' => $this->scheduled_date?->format('Y-m-d'),
            'time_slot' => $this->time_slot,
            'specific_time' => $this->specific_time,
            'notes' => $this->notes,
            'estimated_cost' => $this->estimated_cost ? (float) $this->estimated_cost : null,
            'final_cost' => $this->final_cost ? (float) $this->final_cost : null,
            'eta_minutes' => $this->eta_minutes,
            'priority' => $this->priority,
            'customer' => new UserResource($this->whenLoaded('customer')),
            'technician' => new UserResource($this->whenLoaded('technician')),
            'service' => new ServiceResource($this->whenLoaded('service')),
            'status_logs' => BookingStatusLogResource::collection($this->whenLoaded('statusLogs')),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
            'review' => new ReviewResource($this->whenLoaded('review')),
            'timestamps' => [
                'assigned_at' => $this->assigned_at?->toIso8601String(),
                'accepted_at' => $this->accepted_at?->toIso8601String(),
                'en_route_at' => $this->en_route_at?->toIso8601String(),
                'started_at' => $this->started_at?->toIso8601String(),
                'completed_at' => $this->completed_at?->toIso8601String(),
                'created_at' => $this->created_at?->toIso8601String(),
            ],
        ];
    }
}

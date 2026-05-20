<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'body' => $this->body,
            'is_read' => $this->is_read,
            'sender' => new UserResource($this->whenLoaded('sender')),
            'receiver_id' => $this->receiver_id,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

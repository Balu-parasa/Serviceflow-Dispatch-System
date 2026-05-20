<?php

namespace App\Events;

use App\Models\TechnicianLocation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TechnicianLocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public TechnicianLocation $location) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin.fleet'),
            new PrivateChannel('technician.'.$this->location->technician_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'technician.location.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'technician_id' => $this->location->technician_id,
            'booking_id' => $this->location->booking_id,
            'latitude' => (float) $this->location->latitude,
            'longitude' => (float) $this->location->longitude,
            'eta_minutes' => $this->location->eta_minutes,
        ];
    }
}

<?php

namespace App\Events;

use App\Models\TechnicianProfile;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TechnicianStatusUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public User $technician) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('technicians'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'technician.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'technician' => [
                'id' => $this->technician->id,
                'name' => $this->technician->name,
                'role' => $this->technician->role,
                'technician_profile' => $this->technician->technicianProfile,
            ],
        ];
    }
}

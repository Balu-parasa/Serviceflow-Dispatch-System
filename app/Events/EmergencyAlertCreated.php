<?php

namespace App\Events;

use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EmergencyAlertCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Booking $booking) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin.emergency'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'emergency.alert';
    }

    public function broadcastWith(): array
    {
        return [
            'booking' => (new BookingResource($this->booking->load(['customer', 'service'])))->resolve(),
        ];
    }
}

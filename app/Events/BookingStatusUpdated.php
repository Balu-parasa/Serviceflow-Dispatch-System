<?php

namespace App\Events;

use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Booking $booking) {}

    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel('bookings.'.$this->booking->id),
            new PrivateChannel('admin.dispatch'),
            new PrivateChannel('user.'.$this->booking->customer_id),
        ];

        if ($this->booking->technician_id) {
            $channels[] = new PrivateChannel('user.'.$this->booking->technician_id);
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'booking.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'booking' => (new BookingResource($this->booking))->resolve(),
        ];
    }
}

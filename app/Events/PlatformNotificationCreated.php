<?php

namespace App\Events;

use App\Http\Resources\NotificationResource;
use App\Models\PlatformNotification;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PlatformNotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public PlatformNotification $notification) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->notification->user_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'notification.created';
    }

    public function broadcastWith(): array
    {
        return [
            'notification' => (new NotificationResource($this->notification))->resolve(),
        ];
    }
}

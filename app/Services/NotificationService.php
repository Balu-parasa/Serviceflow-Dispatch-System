<?php

namespace App\Services;

use App\Events\PlatformNotificationCreated;
use App\Models\PlatformNotification;
use App\Models\User;

class NotificationService
{
    public function notify(User $user, string $type, string $title, string $message, array $data = []): PlatformNotification
    {
        $notification = PlatformNotification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);

        PlatformNotificationCreated::dispatch($notification);

        return $notification;
    }
}

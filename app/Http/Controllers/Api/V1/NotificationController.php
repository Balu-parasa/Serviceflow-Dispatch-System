<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\PlatformNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = PlatformNotification::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(20);

        return NotificationResource::collection($notifications)->response();
    }

    public function markRead(Request $request, PlatformNotification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification->update(['is_read' => true, 'read_at' => now()]);

        return response()->json(['notification' => new NotificationResource($notification)]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        PlatformNotification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read.']);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = PlatformNotification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }
}

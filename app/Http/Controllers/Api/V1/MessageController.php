<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Models\Booking;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        $messages = Message::with(['sender'])
            ->where('booking_id', $booking->id)
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'messages' => MessageResource::collection($messages),
            'unread_count' => Message::where('booking_id', $booking->id)
                ->where('receiver_id', $request->user()->id)
                ->where('is_read', false)
                ->count(),
        ]);
    }

    public function store(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        $request->validate(['body' => ['required', 'string', 'max:5000']]);

        $receiverId = $request->user()->id === $booking->customer_id
            ? $booking->technician_id
            : $booking->customer_id;

        if (! $receiverId) {
            return response()->json(['message' => 'No recipient available yet.'], 422);
        }

        $message = Message::create([
            'booking_id' => $booking->id,
            'sender_id' => $request->user()->id,
            'receiver_id' => $receiverId,
            'body' => $request->body,
        ]);

        MessageSent::dispatch($message);

        // Dispatch real-time platform notification to the receiver
        $notificationService = app(\App\Services\NotificationService::class);
        $notificationService->notify(
            \App\Models\User::find($receiverId),
            'chat_message',
            'New message from ' . $request->user()->name,
            $request->body,
            [
                'booking_id' => $booking->id,
                'type' => 'chat',
            ]
        );

        return response()->json([
            'message' => new MessageResource($message->load(['sender', 'receiver'])),
        ], 201);
    }

    public function markRead(Request $request, Booking $booking): JsonResponse
    {
        Message::where('booking_id', $booking->id)
            ->where('receiver_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true, 'read_at' => now()]);

        return response()->json(['message' => 'Messages marked as read.']);
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Booking;
use App\Models\Review;
use App\Models\TechnicianProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function index(): JsonResponse
    {
        $reviews = Review::with('customer')
            ->latest()
            ->take(6)
            ->get();

        return response()->json([
            'reviews' => ReviewResource::collection($reviews),
        ]);
    }

    public function store(Request $request, Booking $booking): JsonResponse
    {
        abort_unless($booking->customer_id === $request->user()->id, 403);
        abort_if($booking->review, 422, 'Review already submitted.');

        $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $review = Review::create([
            'booking_id' => $booking->id,
            'customer_id' => $request->user()->id,
            'technician_id' => $booking->technician_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        if ($booking->technician_id) {
            $profile = TechnicianProfile::where('user_id', $booking->technician_id)->first();
            if ($profile) {
                $avg = Review::where('technician_id', $booking->technician_id)->avg('rating');
                $profile->update([
                    'rating' => round($avg, 2),
                    'total_jobs' => $profile->total_jobs + 1,
                ]);
            }

            // Notify technician in real-time
            $technician = $booking->technician;
            if ($technician) {
                app(\App\Services\NotificationService::class)->notify(
                    $technician,
                    'review_received',
                    'New Customer Review',
                    "Customer {$request->user()->name} left a {$request->rating}-star review: \"{$request->comment}\"",
                    ['booking_id' => $booking->id, 'rating' => $request->rating],
                );
            }
        }

        return response()->json([
            'review' => new ReviewResource($review),
        ], 201);
    }
}

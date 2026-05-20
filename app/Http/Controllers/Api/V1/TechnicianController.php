<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\BookingStatus;
use App\Enums\TechnicianStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\UserResource;
use App\Models\Booking;
use App\Models\TechnicianProfile;
use App\Models\User;
use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TechnicianController extends Controller
{
    public function __construct(protected LocationService $locationService) {}

    public function index(Request $request): JsonResponse
    {
        $technicians = User::query()
            ->where('role', 'technician')
            ->with('technicianProfile')
            ->whereHas('technicianProfile', function ($p) {
                $p->where('status', '!=', TechnicianStatus::Offline);
            })
            ->get();

        return response()->json([
            'technicians' => UserResource::collection($technicians),
        ]);
    }

    public function assignments(Request $request): JsonResponse
    {
        $bookings = Booking::with(['customer', 'service'])
            ->where('technician_id', $request->user()->id)
            ->whereNotIn('status', [BookingStatus::Completed, BookingStatus::Cancelled])
            ->orderByRaw("CASE WHEN priority = 'emergency' THEN 0 ELSE 1 END")
            ->latest()
            ->get();

        return response()->json([
            'assignments' => BookingResource::collection($bookings),
        ]);
    }

    public function updateStatus(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:online,offline,busy,emergency'],
        ]);

        $profile = $request->user()->technicianProfile;
        $profile->update(['status' => $request->status]);

        return response()->json([
            'profile' => $profile->fresh(),
        ]);
    }

    public function updateLocation(Request $request): JsonResponse
    {
        $request->validate([
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
            'booking_id' => ['nullable', 'exists:bookings,id'],
            'eta_minutes' => ['nullable', 'integer', 'min:0'],
        ]);

        $booking = $request->booking_id
            ? Booking::find($request->booking_id)
            : null;

        $location = $this->locationService->updateLocation(
            $request->user(),
            $request->latitude,
            $request->longitude,
            $booking,
            $request->eta_minutes,
        );

        return response()->json(['location' => $location]);
    }

    public function earnings(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $today = now()->startOfDay();

        $todayEarnings = Booking::where('technician_id', $userId)
            ->where('status', BookingStatus::Completed)
            ->where('completed_at', '>=', $today)
            ->sum('final_cost');

        $weekEarnings = Booking::where('technician_id', $userId)
            ->where('status', BookingStatus::Completed)
            ->where('completed_at', '>=', now()->startOfWeek())
            ->selectRaw('DATE(completed_at) as date, SUM(final_cost) as total')
            ->groupBy('date')
            ->get();

        return response()->json([
            'today' => [
                'jobs' => Booking::where('technician_id', $userId)->where('completed_at', '>=', $today)->count(),
                'earnings' => (float) $todayEarnings,
                'rating' => (float) $request->user()->technicianProfile?->rating,
            ],
            'weekly' => $weekEarnings,
        ]);
    }

    public function performance(Request $request): JsonResponse
    {
        $profile = $request->user()->technicianProfile;

        return response()->json([
            'rating' => (float) $profile->rating,
            'total_jobs' => $profile->total_jobs,
            'completed_jobs' => Booking::where('technician_id', $request->user()->id)
                ->where('status', BookingStatus::Completed)->count(),
            'acceptance_rate' => 94,
        ]);
    }
}

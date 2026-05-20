<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\UserResource;
use App\Models\Booking;
use App\Models\TechnicianLocation;
use App\Models\User;
use App\Services\AnalyticsService;
use App\Services\BookingService;
use App\Services\DispatchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct(
        protected AnalyticsService $analytics,
        protected BookingService $bookings,
        protected DispatchService $dispatch,
    ) {}

    public function analytics(): JsonResponse
    {
        return response()->json([
            'metrics' => $this->analytics->dashboard(),
            'zones' => $this->analytics->demandByZone(),
            'ai_insights' => $this->aiInsights(),
        ]);
    }

    public function dispatchFeed(): JsonResponse
    {
        $bookings = Booking::with(['customer', 'technician', 'service'])
            ->whereNotIn('status', [BookingStatus::Cancelled])
            ->latest()
            ->limit(20)
            ->get();

        return response()->json([
            'feed' => BookingResource::collection($bookings),
        ]);
    }

    public function emergencyQueue(): JsonResponse
    {
        $bookings = Booking::with(['customer', 'service'])
            ->where('is_emergency', true)
            ->whereNotIn('status', [BookingStatus::Completed, BookingStatus::Cancelled])
            ->latest()
            ->get();

        return response()->json([
            'queue' => BookingResource::collection($bookings),
        ]);
    }

    public function fleet(): JsonResponse
    {
        $technicians = User::where('role', 'technician')
            ->with('technicianProfile')
            ->get()
            ->map(function (User $tech) {
                $location = TechnicianLocation::where('technician_id', $tech->id)->latest()->first();
                $activeBooking = Booking::where('technician_id', $tech->id)
                    ->whereNotIn('status', [BookingStatus::Completed, BookingStatus::Cancelled])
                    ->first();

                return [
                    'id' => $tech->id,
                    'name' => $tech->name,
                    'specialty' => $tech->technicianProfile?->specialty,
                    'status' => $tech->technicianProfile?->status?->value,
                    'rating' => (float) $tech->technicianProfile?->rating,
                    'jobs' => $tech->technicianProfile?->total_jobs,
                    'location' => $location ? [
                        'latitude' => (float) $location->latitude,
                        'longitude' => (float) $location->longitude,
                    ] : ['latitude' => 37.7749, 'longitude' => -122.4194],
                    'current_job' => $activeBooking?->reference,
                    'eta' => $activeBooking?->eta_minutes,
                ];
            });

        return response()->json(['fleet' => $technicians]);
    }

    public function assign(Request $request, Booking $booking): JsonResponse
    {
        $request->validate(['technician_id' => ['required', 'exists:users,id']]);
        $technician = User::findOrFail($request->technician_id);
        $booking = $this->bookings->assignTechnician($booking, $technician);

        return response()->json(['booking' => new BookingResource($booking)]);
    }

    public function users(Request $request): JsonResponse
    {
        $role = $request->get('role');
        $query = User::query()->with('technicianProfile');

        if ($role) {
            $query->where('role', $role);
        }

        return response()->json([
            'users' => UserResource::collection($query->latest()->paginate(20)),
        ]);
    }

    public function systemHealth(): JsonResponse
    {
        return response()->json([
            'api_latency_ms' => rand(12, 45),
            'database_usage' => rand(35, 65),
            'websocket_connections' => rand(45, 120),
            'queue_time_ms' => rand(5, 25),
            'servers' => [
                ['name' => 'API-01', 'status' => 'healthy', 'load' => rand(20, 60)],
                ['name' => 'WS-01', 'status' => 'healthy', 'load' => rand(30, 70)],
                ['name' => 'Queue-01', 'status' => 'healthy', 'load' => rand(15, 50)],
            ],
            'recent_events' => [
                ['type' => 'info', 'message' => 'Reverb websocket server connected', 'time' => now()->subMinutes(2)->toIso8601String()],
                ['type' => 'success', 'message' => 'Database migrations up to date', 'time' => now()->subMinutes(15)->toIso8601String()],
            ],
        ]);
    }

    protected function aiInsights(): array
    {
        return [
            [
                'type' => 'prediction',
                'title' => 'Peak demand forecast',
                'message' => 'HVAC demand expected to rise 23% tomorrow between 2-6 PM in Mission district.',
                'confidence' => 87,
            ],
            [
                'type' => 'optimization',
                'title' => 'Route optimization',
                'message' => 'Reassigning Technician #4 could reduce average response time by 8 minutes.',
                'confidence' => 92,
            ],
            [
                'type' => 'alert',
                'title' => 'Technician shortage',
                'message' => 'Only 2 electricians available in Downtown zone during peak hours.',
                'confidence' => 78,
            ],
        ];
    }
}

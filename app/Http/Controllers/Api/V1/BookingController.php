<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Bookings\StoreBookingRequest;
use App\Http\Requests\Bookings\UpdateBookingStatusRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\TechnicianLocation;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(protected BookingService $bookingService) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Booking::with(['customer', 'technician.technicianProfile', 'service', 'payment', 'review']);

        if ($user->isCustomer()) {
            $query->where('customer_id', $user->id);
        } elseif ($user->isTechnician()) {
            $query->where('technician_id', $user->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $bookings = $query->latest()->paginate($request->integer('per_page', 15));

        return BookingResource::collection($bookings)->response();
    }

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $booking = $this->bookingService->create($request->user(), $request->validated());

        return (new BookingResource($booking))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        return response()->json([
            'booking' => new BookingResource($booking->load([
                'customer', 'technician.technicianProfile', 'service', 'statusLogs', 'payment', 'review',
            ])),
        ]);
    }

    public function tracking(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        $booking->load(['customer', 'technician.technicianProfile', 'service', 'statusLogs', 'payment']);

        $location = $booking->technician_id
            ? TechnicianLocation::where('technician_id', $booking->technician_id)
                ->when($booking->id, fn ($q) => $q->where('booking_id', $booking->id))
                ->latest()
                ->first()
            : null;

        return response()->json([
            'booking' => new BookingResource($booking),
            'technician_location' => $location ? [
                'latitude' => (float) $location->latitude,
                'longitude' => (float) $location->longitude,
                'eta_minutes' => $location->eta_minutes ?? $booking->eta_minutes,
                'updated_at' => $location->created_at?->toIso8601String(),
            ] : null,
            'destination' => [
                'latitude' => $booking->latitude ? (float) $booking->latitude : 37.7749,
                'longitude' => $booking->longitude ? (float) $booking->longitude : -122.4194,
                'address' => "{$booking->address}, {$booking->city}",
            ],
        ]);
    }

    public function updateStatus(UpdateBookingStatusRequest $request, Booking $booking): JsonResponse
    {
        $this->authorize('update', $booking);

        $status = BookingStatus::from($request->status);
        $booking = $this->bookingService->updateStatus(
            $booking,
            $status,
            $request->user(),
            $request->note,
        );

        return response()->json([
            'booking' => new BookingResource($booking->load([
                'customer', 'technician.technicianProfile', 'service', 'statusLogs',
            ])),
        ]);
    }

    public function accept(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('update', $booking);

        $booking = $this->bookingService->updateStatus(
            $booking,
            BookingStatus::Accepted,
            $request->user(),
            'Technician accepted the job',
        );

        return response()->json(['booking' => new BookingResource($booking->load(['customer', 'service']))]);
    }

    public function reject(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('update', $booking);

        $oldTech = $booking->technician;
        $booking->update(['technician_id' => null, 'status' => BookingStatus::Pending]);

        $this->bookingService->logStatus(
            $booking,
            BookingStatus::Pending->value,
            'rejected',
            'Technician ' . ($oldTech ? $oldTech->name : 'assigned technician') . ' rejected the job',
            $request->user()->id
        );

        if ($booking->customer) {
            app(\App\Services\NotificationService::class)->notify(
                $booking->customer,
                'booking_rejected',
                'Technician Declined Request',
                "Technician " . ($oldTech ? $oldTech->name : 'assigned technician') . " declined your booking {$booking->reference}. We are re-assigning it to another expert.",
                ['booking_id' => $booking->id],
            );
        }

        // Trigger real-time status update broadcast
        \App\Events\BookingStatusUpdated::dispatch($booking->fresh(['customer', 'service']));

        // Try to re-assign automatically
        $dispatch = app(\App\Services\DispatchService::class);
        if ($booking->is_emergency) {
            $dispatch->autoAssignEmergency($booking);
        } else {
            $dispatch->autoAssign($booking);
        }

        return response()->json(['message' => 'Booking rejected and returned to queue.']);
    }

    public function cancel(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('cancel', $booking);

        $booking = $this->bookingService->updateStatus(
            $booking,
            BookingStatus::Cancelled,
            $request->user(),
            'Booking cancelled',
        );

        return response()->json(['booking' => new BookingResource($booking)]);
    }
}

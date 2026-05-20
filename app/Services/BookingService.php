<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\UserRole;
use App\Events\BookingStatusUpdated;
use App\Models\Booking;
use App\Models\BookingStatusLog;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Str;

class BookingService
{
    public function __construct(
        protected NotificationService $notifications,
        protected DispatchService $dispatch,
    ) {}

    public function create(User $customer, array $data): Booking
    {
        $service = Service::findOrFail($data['service_id']);
        $isEmergency = (bool) ($data['is_emergency'] ?? false);
        $basePrice = (float) $service->base_price;
        $estimated = $isEmergency
            ? $basePrice * (float) $service->emergency_multiplier
            : $basePrice;

        $booking = Booking::create([
            'reference' => 'SSS-'.strtoupper(Str::random(8)),
            'customer_id' => $customer->id,
            'technician_id' => $data['technician_id'] ?? null,
            'service_id' => $service->id,
            'status' => BookingStatus::Pending,
            'is_emergency' => $isEmergency,
            'property_type' => $data['property_type'] ?? 'home',
            'address' => $data['address'],
            'city' => $data['city'],
            'zip_code' => $data['zip_code'],
            'latitude' => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null,
            'scheduled_date' => $data['scheduled_date'] ?? null,
            'time_slot' => $data['time_slot'] ?? null,
            'specific_time' => $data['specific_time'] ?? null,
            'notes' => $data['notes'] ?? null,
            'estimated_cost' => $estimated,
            'priority' => $isEmergency ? 'emergency' : 'normal',
            'assigned_at' => isset($data['technician_id']) ? now() : null,
        ]);

        $this->logStatus($booking, null, $booking->status->value, 'Booking created');

        if (! $booking->technician_id && $isEmergency) {
            $this->dispatch->autoAssignEmergency($booking);
        } elseif (! $booking->technician_id) {
            $this->dispatch->autoAssign($booking);
        }

        $booking->refresh();

        if ($booking->technician_id) {
            $technician = \App\Models\User::find($booking->technician_id);
            if ($technician) {
                $this->notifications->notify(
                    $technician,
                    'booking_assigned',
                    'New Job Request',
                    "New booking request {$booking->reference} has been assigned to you.",
                    ['booking_id' => $booking->id],
                );
            }
        }

        $this->notifications->notify(
            $customer,
            'booking_created',
            'Booking Confirmed',
            "Your {$service->name} request {$booking->reference} has been received.",
            ['booking_id' => $booking->id],
        );

        BookingStatusUpdated::dispatch($booking->fresh(['customer', 'technician.technicianProfile', 'service']));

        return $booking->load(['customer', 'technician.technicianProfile', 'service', 'statusLogs']);
    }

    public function updateStatus(Booking $booking, BookingStatus $status, ?User $actor = null, ?string $note = null): Booking
    {
        $from = $booking->status;
        $booking->status = $status;

        match ($status) {
            BookingStatus::Assigned => $booking->assigned_at = now(),
            BookingStatus::Accepted => $booking->accepted_at = now(),
            BookingStatus::EnRoute => $booking->en_route_at = now(),
            BookingStatus::InProgress => $booking->started_at = now(),
            BookingStatus::Completed => $booking->completed_at = now(),
            BookingStatus::Cancelled => $booking->cancelled_at = now(),
            default => null,
        };

        if ($status === BookingStatus::Completed) {
            $booking->final_cost = $booking->final_cost ?: $booking->estimated_cost ?: 0.00;
            if ($booking->technician && $booking->technician->technicianProfile) {
                $booking->technician->technicianProfile->increment('total_jobs');
            }
        }

        $booking->save();

        $this->logStatus($booking, $from->value, $status->value, $note, $actor?->id);

        if ($booking->customer) {
            if ($status === BookingStatus::Completed) {
                $this->notifications->notify(
                    $booking->customer,
                    'booking_completed',
                    'Service Completed',
                    "Your service for booking {$booking->reference} has been completed. Please leave a review!",
                    ['booking_id' => $booking->id],
                );
            } elseif ($status === BookingStatus::Accepted) {
                $this->notifications->notify(
                    $booking->customer,
                    'booking_accepted',
                    'Booking Approved',
                    "Technician {$booking->technician->name} has approved and accepted your booking {$booking->reference}.",
                    ['booking_id' => $booking->id],
                );
            } else {
                $this->notifications->notify(
                    $booking->customer,
                    'booking_status',
                    'Booking Update',
                    "Your booking {$booking->reference} is now {$status->label()}.",
                    ['booking_id' => $booking->id, 'status' => $status->value],
                );
            }
        }

        if ($booking->technician) {
            $this->notifications->notify(
                $booking->technician,
                'booking_status',
                'Job Update',
                "Booking {$booking->reference} is now {$status->label()}.",
                ['booking_id' => $booking->id, 'status' => $status->value],
            );
        }

        BookingStatusUpdated::dispatch($booking->fresh(['customer', 'technician.technicianProfile', 'service']));

        return $booking;
    }

    public function assignTechnician(Booking $booking, User $technician): Booking
    {
        $booking->technician_id = $technician->id;
        $booking->assigned_at = now();
        $booking->save();

        $this->updateStatus($booking, BookingStatus::Pending, null, 'Technician assigned');

        $this->notifications->notify(
            $technician,
            'booking_assigned',
            'New Assignment',
            "You have been assigned booking {$booking->reference}.",
            ['booking_id' => $booking->id],
        );

        return $booking->fresh(['customer', 'technician.technicianProfile', 'service']);
    }

    public function logStatus(Booking $booking, ?string $from, string $to, ?string $note = null, ?int $userId = null): void
    {
        BookingStatusLog::create([
            'booking_id' => $booking->id,
            'user_id' => $userId,
            'from_status' => $from,
            'to_status' => $to,
            'note' => $note,
        ]);
    }
}

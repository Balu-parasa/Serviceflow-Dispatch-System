<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\TechnicianStatus;
use App\Enums\UserRole;
use App\Events\EmergencyAlertCreated;
use App\Models\Booking;
use App\Models\TechnicianProfile;
use App\Models\User;

class DispatchService
{
    public function __construct(
        protected NotificationService $notifications,
    ) {}

    public function autoAssign(Booking $booking): void
    {
        $technician = $this->findAvailableTechnician($booking->service->category);

        if ($technician) {
            $booking->technician_id = $technician->id;
            $booking->status = BookingStatus::Pending;
            $booking->assigned_at = now();
            $booking->save();

            $this->notifications->notify(
                $technician,
                'booking_assigned',
                'New Job Assigned',
                "Booking {$booking->reference} has been assigned to you.",
                ['booking_id' => $booking->id],
            );
        }
    }

    public function autoAssignEmergency(Booking $booking): void
    {
        $technician = User::query()
            ->where('role', UserRole::Technician)
            ->whereHas('technicianProfile', function ($q) use ($booking) {
                $q->whereIn('status', [TechnicianStatus::Online, TechnicianStatus::Emergency])
                    ->where('specialty', 'like', '%'.$booking->service->category.'%');
            })
            ->first();

        if ($technician) {
            $booking->technician_id = $technician->id;
            $booking->status = BookingStatus::Pending;
            $booking->assigned_at = now();
            $booking->save();

            EmergencyAlertCreated::dispatch($booking);

            $this->notifications->notify(
                User::where('role', UserRole::Admin)->get()->first() ?? $technician,
                'emergency_alert',
                'Emergency Dispatch',
                "Emergency booking {$booking->reference} requires immediate attention.",
                ['booking_id' => $booking->id],
            );
        }
    }

    public function findAvailableTechnician(string $category): ?User
    {
        $profile = TechnicianProfile::query()
            ->where('status', TechnicianStatus::Online)
            ->where('specialty', 'like', '%'.$category.'%')
            ->with('user')
            ->orderByDesc('rating')
            ->first();

        return $profile?->user;
    }
}

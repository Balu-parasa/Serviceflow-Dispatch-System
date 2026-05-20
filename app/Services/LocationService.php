<?php

namespace App\Services;

use App\Events\TechnicianLocationUpdated;
use App\Models\Booking;
use App\Models\TechnicianLocation;
use App\Models\User;

class LocationService
{
    public function updateLocation(User $technician, float $lat, float $lng, ?Booking $booking = null, ?int $eta = null): TechnicianLocation
    {
        $location = TechnicianLocation::create([
            'technician_id' => $technician->id,
            'booking_id' => $booking?->id,
            'latitude' => $lat,
            'longitude' => $lng,
            'eta_minutes' => $eta,
        ]);

        if ($booking && $eta) {
            $booking->update(['eta_minutes' => $eta]);
        }

        TechnicianLocationUpdated::dispatch($location->load('technician.technicianProfile'));

        return $location;
    }
}

<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool
    {
        return $user->isAdmin()
            || $booking->customer_id === $user->id
            || $booking->technician_id === $user->id;
    }

    public function update(User $user, Booking $booking): bool
    {
        return $user->isAdmin() || $booking->technician_id === $user->id;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return $user->isAdmin()
            || $booking->customer_id === $user->id
            || $booking->technician_id === $user->id;
    }
}

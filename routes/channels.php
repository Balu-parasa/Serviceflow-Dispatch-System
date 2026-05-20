<?php

use App\Models\Booking;
use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['auth:sanctum']]);

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('bookings.{bookingId}', function ($user, $bookingId) {
    $booking = Booking::find($bookingId);

    return $booking && (
        $user->isAdmin()
        || $booking->customer_id === $user->id
        || $booking->technician_id === $user->id
    );
});

Broadcast::channel('chat.booking.{bookingId}', function ($user, $bookingId) {
    $booking = Booking::find($bookingId);

    return $booking && (
        $booking->customer_id === $user->id
        || $booking->technician_id === $user->id
        || $user->isAdmin()
    );
});

Broadcast::channel('admin.dispatch', function ($user) {
    return $user->isAdmin();
});

Broadcast::channel('admin.emergency', function ($user) {
    return $user->isAdmin();
});

Broadcast::channel('admin.fleet', function ($user) {
    return $user->isAdmin();
});

Broadcast::channel('technician.{technicianId}', function ($user, $technicianId) {
    return $user->isAdmin() || (int) $user->id === (int) $technicianId;
});

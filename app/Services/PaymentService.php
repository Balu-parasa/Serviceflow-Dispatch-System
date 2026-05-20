<?php

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Str;

class PaymentService
{
    public function __construct(
        protected NotificationService $notifications,
    ) {}

    public function simulatePayment(Booking $booking): Payment
    {
        $amount = $booking->final_cost ?? $booking->estimated_cost ?? 0;

        $payment = Payment::updateOrCreate(
            ['booking_id' => $booking->id],
            [
                'customer_id' => $booking->customer_id,
                'invoice_number' => 'INV-'.strtoupper(Str::random(10)),
                'status' => PaymentStatus::Processing,
                'amount' => $amount,
                'method' => 'card',
            ],
        );

        $payment->update([
            'status' => PaymentStatus::Completed,
            'transaction_id' => 'txn_'.Str::random(16),
            'paid_at' => now(),
            'metadata' => ['simulated' => true],
        ]);

        $this->notifications->notify(
            $booking->customer,
            'payment_completed',
            'Payment Successful',
            "Payment of \${$amount} for booking {$booking->reference} was processed.",
            ['booking_id' => $booking->id, 'payment_id' => $payment->id],
        );

        return $payment->fresh();
    }
}

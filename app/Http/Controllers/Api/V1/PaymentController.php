<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Booking;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(protected PaymentService $payments) {}

    public function process(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        if ($booking->customer_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            abort(403);
        }

        $payment = $this->payments->simulatePayment($booking);

        return response()->json([
            'payment' => new PaymentResource($payment),
            'message' => 'Payment processed successfully.',
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $payments = $request->user()
            ->customerBookings()
            ->with('payment')
            ->whereHas('payment')
            ->latest()
            ->paginate(15);

        return response()->json([
            'payments' => $payments->map(fn ($b) => new PaymentResource($b->payment)),
        ]);
    }

    public function invoice(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);
        $payment = $booking->payment;

        return response()->json([
            'invoice' => [
                'invoice_number' => $payment?->invoice_number ?? 'PENDING',
                'booking_reference' => $booking->reference,
                'customer' => $booking->customer?->name,
                'service' => $booking->service?->name,
                'amount' => (float) ($payment?->amount ?? $booking->estimated_cost),
                'status' => $payment?->status?->value ?? 'pending',
                'issued_at' => $payment?->created_at?->toIso8601String(),
            ],
        ]);
    }
}

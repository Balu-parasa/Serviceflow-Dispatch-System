<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'status' => $this->status?->value ?? $this->status,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'method' => $this->method,
            'transaction_id' => $this->transaction_id,
            'paid_at' => $this->paid_at?->toIso8601String(),
        ];
    }
}

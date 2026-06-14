<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'productId' => (string) $this->product_id,
            'quantity' => $this->quantity,
            'price' => (float) $this->price,
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'buyerId' => (string) $this->buyer_id,
            'productId' => (string) $this->items->first()?->product_id,
            'product_title' => $this->items->first()?->product?->title,
            'product_image' => $this->items->first()?->product?->image,
            'amount' => (float) $this->total_amount,
            'status' => $this->status,
            'date' => $this->created_at?->toDateString(),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}

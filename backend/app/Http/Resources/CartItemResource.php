<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'productId' => (string) $this->product_id,
            'variationId' => $this->variation_id ? (string) $this->variation_id : null,
            'variationName' => $this->whenLoaded('variation', fn() => $this->variation?->name),
            'qty' => $this->quantity,
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}

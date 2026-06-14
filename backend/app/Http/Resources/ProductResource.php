<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category?->slug,
            'category_name' => $this->category?->name,
            'price' => (float) $this->price,
            'stock' => $this->stock,
            'image' => $this->image,
            'sellerId' => (string) $this->seller_id,
            'seller_name' => $this->seller?->name,
            'seller_avatar' => $this->seller?->avatar,
            'rating' => (float) $this->rating,
            'reviewsCount' => $this->reviews_count,
            'deliveryType' => $this->delivery_type,
            'sales' => $this->sales,
            'trending' => $this->trending,
            'featured' => $this->featured,
            'createdAt' => $this->created_at?->toDateString(),
        ];
    }
}

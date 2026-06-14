<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'user_name' => $this->user?->name,
            'user_avatar' => $this->user?->avatar,
            'productId' => (string) $this->product_id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'date' => $this->created_at?->toDateString(),
        ];
    }
}

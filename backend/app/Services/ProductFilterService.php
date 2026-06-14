<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductFilterService
{
    public function filter(array $params): LengthAwarePaginator
    {
        $query = Product::with('seller', 'category')
            ->withCount('reviews');

        if (!empty($params['category']) && $params['category'] !== 'all') {
            $query->byCategory($params['category']);
        }

        if (!empty($params['q'])) {
            $query->search($params['q']);
        }

        $min = $params['price_min'] ?? 0;
        $max = $params['price_max'] ?? 200;
        $query->priceBetween((float) $min, (float) $max);

        $sort = $params['sort'] ?? 'popular';
        match ($sort) {
            'newest' => $query->orderBy('created_at', 'desc'),
            'price-asc' => $query->orderBy('price', 'asc'),
            'price-desc' => $query->orderBy('price', 'desc'),
            'rating' => $query->orderBy('rating', 'desc'),
            default => $query->orderBy('sales', 'desc'),
        };

        $perPage = $params['per_page'] ?? 12;

        return $query->paginate($perPage);
    }
}

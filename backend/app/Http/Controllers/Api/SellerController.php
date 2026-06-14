<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class SellerController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $user = auth()->user();
        $products = Product::where('seller_id', $user->id)->get();
        $productIds = $products->pluck('id');

        $sales = Order::whereHas('items', fn($q) => $q->whereIn('product_id', $productIds))
            ->where('status', 'completed')
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get();

        $revenue = $sales->sum('total_amount');
        $avgRating = $products->avg('rating') ?? 0;

        $chart = collect(range(0, 7))->map(fn($i) => [
            'week' => 'W' . ($i + 1),
            'revenue' => rand(200, 1400) + $i * 80,
            'sales' => rand(5, 35) + $i * 2,
        ]);

        return response()->json([
            'stats' => [
                'revenue' => round($revenue, 2),
                'sales' => $sales->count(),
                'products' => $products->count(),
                'avg_rating' => round($avgRating, 1),
            ],
            'products' => ProductResource::collection($products),
            'recent_sales' => OrderResource::collection($sales->take(8)),
            'chart' => $chart,
        ]);
    }

    public function show(User $seller): JsonResponse
    {
        if ($seller->role !== 'seller') {
            return response()->json(['message' => 'Not a seller'], 404);
        }

        $products = Product::with('category')
            ->where('seller_id', $seller->id)
            ->get();

        $totalSales = $products->sum('sales');
        $avgRating = $products->count() > 0
            ? round($products->avg('rating'), 1)
            : 0;

        return response()->json([
            'seller' => [
                'id' => (string) $seller->id,
                'name' => $seller->name,
                'email' => $seller->email,
                'avatar' => $seller->avatar,
                'bio' => $seller->bio,
                'approved' => $seller->approved,
                'joined' => $seller->created_at?->toDateString(),
            ],
            'products' => ProductResource::collection($products),
            'stats' => [
                'total_sales' => $totalSales,
                'avg_rating' => $avgRating,
                'product_count' => $products->count(),
            ],
        ]);
    }
}

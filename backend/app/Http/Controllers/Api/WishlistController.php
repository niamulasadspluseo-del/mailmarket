<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\WishlistItem;
use Illuminate\Http\JsonResponse;

class WishlistController extends Controller
{
    public function index(): JsonResponse
    {
        $productIds = WishlistItem::where('user_id', auth()->id())
            ->pluck('product_id');

        $products = Product::with('seller', 'category')
            ->whereIn('id', $productIds)
            ->get();

        return response()->json([
            'wishlist' => ProductResource::collection($products),
            'wishlistIds' => $productIds->map(fn($id) => (string) $id),
        ]);
    }

    public function toggle(Product $product): JsonResponse
    {
        $userId = auth()->id();
        $existing = WishlistItem::where('user_id', $userId)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $wished = false;
        } else {
            WishlistItem::create([
                'user_id' => $userId,
                'product_id' => $product->id,
            ]);
            $wished = true;
        }

        return response()->json([
            'wished' => $wished,
            'message' => $wished ? 'Added to wishlist' : 'Removed from wishlist',
        ]);
    }
}

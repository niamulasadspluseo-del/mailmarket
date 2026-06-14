<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function index(Product $product): JsonResponse
    {
        $reviews = Review::with('user')
            ->where('product_id', $product->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'reviews' => ReviewResource::collection($reviews),
        ]);
    }

    public function store(StoreReviewRequest $request, Product $product): JsonResponse
    {
        $existing = Review::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You already reviewed this product'], 422);
        }

        $review = Review::create([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $product->reviews_count = $product->reviews()->count();
        $product->rating = round(
            $product->reviews()->avg('rating'),
            1
        );
        $product->save();

        return response()->json([
            'review' => new ReviewResource($review),
        ], 201);
    }

    public function destroy(Review $review): JsonResponse
    {
        if ($review->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $product = $review->product;
        $review->delete();

        $product->reviews_count = $product->reviews()->count();
        $product->rating = $product->reviews_count > 0
            ? round($product->reviews()->avg('rating'), 1)
            : 0;
        $product->save();

        return response()->json(['message' => 'Review deleted']);
    }
}

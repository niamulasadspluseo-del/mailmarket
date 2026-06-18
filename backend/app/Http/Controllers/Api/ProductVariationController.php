<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductVariationController extends Controller
{
    public function index(Product $product): JsonResponse
    {
        return response()->json([
            'variations' => $product->variations,
        ]);
    }

    public function store(Request $request, Product $product): JsonResponse
    {
        if ($product->seller_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['sort_order'] ??= 0;

        $variation = $product->variations()->create($validated);

        return response()->json(['variation' => $variation], 201);
    }

    public function update(Request $request, ProductVariation $variation): JsonResponse
    {
        if ($variation->product->seller_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'price' => 'numeric|min:0',
            'stock' => 'integer|min:0',
            'sort_order' => 'integer|min:0',
        ]);

        $variation->update($validated);

        return response()->json(['variation' => $variation->fresh()]);
    }

    public function destroy(ProductVariation $variation): JsonResponse
    {
        if ($variation->product->seller_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $variation->delete();

        return response()->json(['message' => 'Variation deleted']);
    }
}

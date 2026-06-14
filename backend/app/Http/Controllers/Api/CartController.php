<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartItemResource;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(): JsonResponse
    {
        $items = CartItem::with('product.seller', 'product.category')
            ->where('user_id', auth()->id())
            ->get();

        return response()->json([
            'cart' => CartItemResource::collection($items),
        ]);
    }

    public function add(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1',
        ]);

        $userId = auth()->id();
        $productId = $request->product_id;
        $qty = $request->input('quantity', 1);

        $existing = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($existing) {
            $existing->increment('quantity', $qty);
            $item = $existing->fresh();
        } else {
            $item = CartItem::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $qty,
            ]);
        }

        return response()->json([
            'message' => 'Added to cart',
            'cart_item' => new CartItemResource($item->load('product.seller', 'product.category')),
        ]);
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        if ($cartItem->user_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate(['quantity' => 'required|integer|min:1']);
        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Cart updated']);
    }

    public function remove(CartItem $cartItem): JsonResponse
    {
        if ($cartItem->user_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Removed from cart']);
    }

    public function clear(): JsonResponse
    {
        CartItem::where('user_id', auth()->id())->delete();

        return response()->json(['message' => 'Cart cleared']);
    }
}

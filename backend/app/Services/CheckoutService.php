<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Collection;

class CheckoutService
{
    public function checkout(int $userId): Collection
    {
        $cartItems = CartItem::with('product')
            ->where('user_id', $userId)
            ->get();

        if ($cartItems->isEmpty()) {
            return collect();
        }

        $totalAmount = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);
        $totalAmount = round($totalAmount * 1.05, 2);

        $order = Order::create([
            'buyer_id' => $userId,
            'total_amount' => $totalAmount,
            'status' => 'completed',
        ]);

        $newOrders = collect();

        foreach ($cartItems as $item) {
            $orderItem = OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
            ]);

            $item->product->increment('sales', $item->quantity);

            $newOrders->push((object) [
                'id' => (string) $orderItem->id,
                'buyerId' => (string) $userId,
                'productId' => (string) $item->product_id,
                'amount' => $item->product->price * $item->quantity,
                'status' => 'completed',
                'date' => now()->toDateString(),
            ]);
        }

        CartItem::where('user_id', $userId)->delete();

        return $newOrders;
    }
}

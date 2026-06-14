<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\CheckoutService;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function __construct(
        private CheckoutService $checkoutService
    ) {}

    public function index(): JsonResponse
    {
        $orders = Order::with('items.product')
            ->where('buyer_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'orders' => OrderResource::collection($orders),
        ]);
    }

    public function checkout(): JsonResponse
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $newOrders = $this->checkoutService->checkout($user->id);

        return response()->json([
            'orders' => $newOrders,
            'message' => 'Checkout successful',
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        if (Order::count() > 0) {
            return;
        }

        $buyers = User::where('role', 'buyer')->pluck('id', 'email');
        $products = Product::pluck('price', 'id');

        $orders = [
            ['buyer' => 'sarah@mailmarket.dev', 'product_title' => 'Gmail Bulk — 10 Accounts Pack', 'status' => 'completed', 'date' => '2025-10-12'],
            ['buyer' => 'sarah@mailmarket.dev', 'product_title' => 'AOL Mail — Premium Address', 'status' => 'completed', 'date' => '2025-10-20'],
            ['buyer' => 'marcus@mailmarket.dev', 'product_title' => 'Hotmail — Legacy Account (No Numbers)', 'status' => 'completed', 'date' => '2025-10-18'],
            ['buyer' => 'priya@mailmarket.dev', 'product_title' => 'AOL Mail — Premium Address', 'status' => 'pending', 'date' => '2025-11-01'],
            ['buyer' => 'marcus@mailmarket.dev', 'product_title' => 'Proton Mail — Encrypted Account', 'status' => 'completed', 'date' => '2025-11-04'],
            ['buyer' => 'priya@mailmarket.dev', 'product_title' => 'Hotmail — Legacy Account (No Numbers)', 'status' => 'completed', 'date' => '2025-11-07'],
            ['buyer' => 'sarah@mailmarket.dev', 'product_title' => 'Yahoo Mail — 5 Accounts Pack', 'status' => 'completed', 'date' => '2025-11-09'],
            ['buyer' => 'marcus@mailmarket.dev', 'product_title' => 'Outlook Business — 5 Accounts', 'status' => 'refunded', 'date' => '2025-11-10'],
        ];

        $productIds = Product::pluck('id', 'title');

        foreach ($orders as $data) {
            $productId = $productIds[$data['product_title']] ?? null;
            if (!$productId || !isset($products[$productId])) continue;

            $order = Order::create([
                'buyer_id' => $buyers[$data['buyer']],
                'total_amount' => $products[$productId],
                'status' => $data['status'],
                'created_at' => $data['date'] . ' 00:00:00',
                'updated_at' => $data['date'] . ' 00:00:00',
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $productId,
                'quantity' => 1,
                'price' => $products[$productId],
                'created_at' => $data['date'] . ' 00:00:00',
                'updated_at' => $data['date'] . ' 00:00:00',
            ]);
        }
    }
}

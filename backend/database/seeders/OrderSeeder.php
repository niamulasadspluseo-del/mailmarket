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
        $buyers = User::where('role', 'buyer')->pluck('id', 'email');
        $products = Product::pluck('price', 'id');

        $orders = [
            ['buyer' => 'sarah@mailmarket.dev', 'product_id' => 1, 'amount' => 79, 'status' => 'completed', 'date' => '2025-10-12'],
            ['buyer' => 'sarah@mailmarket.dev', 'product_id' => 5, 'amount' => 19, 'status' => 'completed', 'date' => '2025-10-20'],
            ['buyer' => 'marcus@mailmarket.dev', 'product_id' => 2, 'amount' => 99, 'status' => 'completed', 'date' => '2025-10-18'],
            ['buyer' => 'priya@mailmarket.dev', 'product_id' => 10, 'amount' => 129, 'status' => 'pending', 'date' => '2025-11-01'],
            ['buyer' => 'marcus@mailmarket.dev', 'product_id' => 7, 'amount' => 59, 'status' => 'completed', 'date' => '2025-11-04'],
            ['buyer' => 'priya@mailmarket.dev', 'product_id' => 3, 'amount' => 49, 'status' => 'completed', 'date' => '2025-11-07'],
            ['buyer' => 'sarah@mailmarket.dev', 'product_id' => 12, 'amount' => 29, 'status' => 'completed', 'date' => '2025-11-09'],
            ['buyer' => 'marcus@mailmarket.dev', 'product_id' => 4, 'amount' => 39, 'status' => 'refunded', 'date' => '2025-11-10'],
        ];

        foreach ($orders as $i => $data) {
            $order = Order::create([
                'buyer_id' => $buyers[$data['buyer']],
                'total_amount' => $data['amount'],
                'status' => $data['status'],
                'created_at' => $data['date'] . ' 00:00:00',
                'updated_at' => $data['date'] . ' 00:00:00',
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $data['product_id'],
                'quantity' => 1,
                'price' => $products[$data['product_id']],
                'created_at' => $data['date'] . ' 00:00:00',
                'updated_at' => $data['date'] . ' 00:00:00',
            ]);
        }
    }
}

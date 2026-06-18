<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        if (Review::count() > 0) {
            return;
        }

        $buyers = User::where('role', 'buyer')->pluck('id', 'email');
        $products = Product::pluck('id', 'title');

        $reviews = [
            ['user' => 'sarah@mailmarket.dev', 'product' => 'Gmail Bulk — 10 Accounts Pack', 'rating' => 5, 'comment' => 'Easily the cleanest dashboard kit I\'ve used. Saved weeks of work.', 'date' => '2025-10-15'],
            ['user' => 'marcus@mailmarket.dev', 'product' => 'Gmail Bulk — 10 Accounts Pack', 'rating' => 5, 'comment' => 'Stunning components and the Figma file is immaculate.', 'date' => '2025-10-19'],
            ['user' => 'priya@mailmarket.dev', 'product' => 'Hotmail — Legacy Account (No Numbers)', 'rating' => 5, 'comment' => 'Shipped my MVP in a weekend. Worth every cent.', 'date' => '2025-10-21'],
            ['user' => 'sarah@mailmarket.dev', 'product' => 'AOL Mail — Premium Address', 'rating' => 4, 'comment' => 'Great variety, would love a few more brand icons.', 'date' => '2025-10-22'],
            ['user' => 'marcus@mailmarket.dev', 'product' => 'Proton Mail — Encrypted Account', 'rating' => 5, 'comment' => 'Conversion-optimized sections out of the box.', 'date' => '2025-11-05'],
            ['user' => 'priya@mailmarket.dev', 'product' => 'Hotmail — Legacy Account (No Numbers)', 'rating' => 5, 'comment' => 'Aurora is the display face I\'ve been searching for.', 'date' => '2025-11-08'],
        ];

        foreach ($reviews as $data) {
            $productId = $products[$data['product']] ?? null;
            if (!$productId) continue;

            Review::create([
                'user_id' => $buyers[$data['user']],
                'product_id' => $productId,
                'rating' => $data['rating'],
                'comment' => $data['comment'],
                'created_at' => $data['date'] . ' 00:00:00',
            ]);
        }
    }
}

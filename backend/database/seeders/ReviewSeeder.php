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
        $buyers = User::where('role', 'buyer')->pluck('id', 'email');

        Review::create([
            'user_id' => $buyers['sarah@mailmarket.dev'],
            'product_id' => 1,
            'rating' => 5,
            'comment' => 'Easily the cleanest dashboard kit I\'ve used. Saved weeks of work.',
            'created_at' => '2025-10-15 00:00:00',
        ]);

        Review::create([
            'user_id' => $buyers['marcus@mailmarket.dev'],
            'product_id' => 1,
            'rating' => 5,
            'comment' => 'Stunning components and the Figma file is immaculate.',
            'created_at' => '2025-10-19 00:00:00',
        ]);

        Review::create([
            'user_id' => $buyers['priya@mailmarket.dev'],
            'product_id' => 2,
            'rating' => 5,
            'comment' => 'Shipped my MVP in a weekend. Worth every cent.',
            'created_at' => '2025-10-21 00:00:00',
        ]);

        Review::create([
            'user_id' => $buyers['sarah@mailmarket.dev'],
            'product_id' => 5,
            'rating' => 4,
            'comment' => 'Great variety, would love a few more brand icons.',
            'created_at' => '2025-10-22 00:00:00',
        ]);

        Review::create([
            'user_id' => $buyers['marcus@mailmarket.dev'],
            'product_id' => 7,
            'rating' => 5,
            'comment' => 'Conversion-optimized sections out of the box.',
            'created_at' => '2025-11-05 00:00:00',
        ]);

        Review::create([
            'user_id' => $buyers['priya@mailmarket.dev'],
            'product_id' => 3,
            'rating' => 5,
            'comment' => 'Aurora is the display face I\'ve been searching for.',
            'created_at' => '2025-11-08 00:00:00',
        ]);
    }
}

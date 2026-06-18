<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $img = fn(string $seed) => "https://picsum.photos/seed/mm-{$seed}/800/600";

        $sellerIds = \App\Models\User::whereIn('email', [
            'pixel@mailmarket.dev', 'north@mailmarket.dev', 'lumen@mailmarket.dev',
            'helix@mailmarket.dev', 'nova@mailmarket.dev',
        ])->pluck('id', 'email');

        $categories = \App\Models\Category::pluck('id', 'slug');

        $products = [
            ['title' => 'Gmail Bulk — 10 Accounts Pack', 'description' => 'Bundle of 10 verified Gmail accounts. Each with unique recovery, phone verified, ready for bulk operations.', 'category_id' => $categories['bulk'], 'price' => 299, 'stock' => 100, 'image' => 'https://logo.clearbit.com/gmail.com', 'seller_id' => $sellerIds['helix@mailmarket.dev'], 'rating' => 4.8, 'reviews_count' => 198, 'delivery_type' => 'Instant Download', 'sales' => 1102, 'featured' => true, 'trending' => true, 'created_at' => '2025-10-02'],
            ['title' => 'Hotmail — Legacy Account (No Numbers)', 'description' => 'Clean Hotmail account with original @hotmail.com domain. No numbers in username, perfect for professional use.', 'category_id' => $categories['outlook'], 'price' => 129, 'stock' => 30, 'image' => 'https://logo.clearbit.com/outlook.com', 'seller_id' => $sellerIds['lumen@mailmarket.dev'], 'rating' => 4.7, 'reviews_count' => 156, 'delivery_type' => 'Email Delivery', 'sales' => 890, 'featured' => true, 'created_at' => '2025-08-30'],
            ['title' => 'Outlook Business — 5 Accounts', 'description' => '5 Outlook.com accounts with custom display names. Microsoft 365 compatible, phone verified, ready for outreach.', 'category_id' => $categories['business'], 'price' => 199, 'stock' => 40, 'image' => 'https://logo.clearbit.com/outlook.com', 'seller_id' => $sellerIds['north@mailmarket.dev'], 'rating' => 4.6, 'reviews_count' => 88, 'delivery_type' => 'Email Delivery', 'sales' => 540, 'trending' => true, 'created_at' => '2025-09-25'],
            ['title' => 'Proton Mail — Encrypted Account', 'description' => 'Privacy-focused Proton Mail account with 10 GB storage. End-to-end encrypted, no logs, Swiss-based. Full access.', 'category_id' => $categories['proton'], 'price' => 69, 'stock' => 25, 'image' => 'https://logo.clearbit.com/proton.me', 'seller_id' => $sellerIds['nova@mailmarket.dev'], 'rating' => 4.5, 'reviews_count' => 73, 'delivery_type' => 'Email Delivery', 'sales' => 410, 'created_at' => '2025-08-18'],
            ['title' => 'Outlook — 10 Accounts Bulk', 'description' => '10 Outlook accounts with unique IP creation. Each has recovery email set, phone verified, warmed up for sending.', 'category_id' => $categories['bulk'], 'price' => 449, 'stock' => 30, 'image' => 'https://logo.clearbit.com/outlook.com', 'seller_id' => $sellerIds['lumen@mailmarket.dev'], 'rating' => 4.7, 'reviews_count' => 64, 'delivery_type' => 'Email Delivery', 'sales' => 240, 'created_at' => '2025-08-05'],
            ['title' => 'Yahoo Mail — 5 Accounts Pack', 'description' => '5 Yahoo Mail accounts with clean reputation. Ideal for cold email campaigns and social media signups.', 'category_id' => $categories['yahoo'], 'price' => 249, 'stock' => 35, 'image' => 'https://logo.clearbit.com/yahoo.com', 'seller_id' => $sellerIds['north@mailmarket.dev'], 'rating' => 4.6, 'reviews_count' => 51, 'delivery_type' => 'Email Delivery', 'sales' => 320, 'created_at' => '2025-07-22'],
            ['title' => 'AOL Mail — Premium Address', 'description' => 'Classic AOL Mail account with original @aol.com domain. Rare find, full access, recovery configured, high trust score.', 'category_id' => $categories['aol'], 'price' => 199, 'stock' => 10, 'image' => 'https://logo.clearbit.com/aol.com', 'seller_id' => $sellerIds['helix@mailmarket.dev'], 'rating' => 4.9, 'reviews_count' => 211, 'delivery_type' => 'Email Delivery', 'sales' => 670, 'featured' => true, 'trending' => true, 'created_at' => '2025-10-10'],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(
                ['title' => $product['title']],
                $product
            );
        }
    }
}

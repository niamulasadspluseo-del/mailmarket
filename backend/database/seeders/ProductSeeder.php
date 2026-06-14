<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $img = fn(string $seed) => "https://picsum.photos/seed/mm-{$seed}/800/600";

        $sellers = [
            'pixel@mailmarket.dev' => null,
            'north@mailmarket.dev' => null,
            'lumen@mailmarket.dev' => null,
            'helix@mailmarket.dev' => null,
            'nova@mailmarket.dev' => null,
        ];

        // Get seller IDs
        $sellerIds = \App\Models\User::whereIn('email', array_keys($sellers))
            ->pluck('id', 'email');

        $categories = \App\Models\Category::pluck('id', 'slug');

        Product::create([
            'title' => 'Nimbus — SaaS Dashboard Kit',
            'description' => '120+ dashboard screens, dark/light, fully responsive. Built with React + Tailwind. Includes Figma source files.',
            'category_id' => $categories['ui-kits'],
            'price' => 79, 'stock' => 999, 'image' => $img('nimbus'),
            'seller_id' => $sellerIds['pixel@mailmarket.dev'],
            'rating' => 4.9, 'reviews_count' => 312,
            'delivery_type' => 'Instant Download', 'sales' => 1840,
            'featured' => true, 'trending' => true,
            'created_at' => '2025-09-12',
        ]);

        Product::create([
            'title' => 'Orbit — Next.js Starter Pro',
            'description' => 'Production-ready Next.js 15 starter with auth, billing, and analytics pre-wired.',
            'category_id' => $categories['code'],
            'price' => 99, 'stock' => 999, 'image' => $img('orbit'),
            'seller_id' => $sellerIds['helix@mailmarket.dev'],
            'rating' => 4.8, 'reviews_count' => 198,
            'delivery_type' => 'Instant Download', 'sales' => 1102,
            'featured' => true, 'trending' => true,
            'created_at' => '2025-10-02',
        ]);

        Product::create([
            'title' => 'Aurora Display — Variable Font',
            'description' => 'Sharp, contemporary display family with 9 weights and full Latin Extended.',
            'category_id' => $categories['fonts'],
            'price' => 49, 'stock' => 999, 'image' => $img('aurora'),
            'seller_id' => $sellerIds['lumen@mailmarket.dev'],
            'rating' => 4.7, 'reviews_count' => 156,
            'delivery_type' => 'Instant Download', 'sales' => 890,
            'featured' => true,
            'created_at' => '2025-08-30',
        ]);

        Product::create([
            'title' => 'Pulse — Cinematic Loops Vol. 2',
            'description' => '60 hand-crafted cinematic loops at 24-bit / 48kHz. Royalty-free for any project.',
            'category_id' => $categories['music'],
            'price' => 39, 'stock' => 999, 'image' => $img('pulse'),
            'seller_id' => $sellerIds['north@mailmarket.dev'],
            'rating' => 4.6, 'reviews_count' => 88,
            'delivery_type' => 'Instant Download', 'sales' => 540,
            'trending' => true,
            'created_at' => '2025-09-25',
        ]);

        Product::create([
            'title' => 'Mono Icon Pack — 2,400 icons',
            'description' => 'Pixel-perfect 24px stroke icons covering UI, business, finance, and dev.',
            'category_id' => $categories['icons'],
            'price' => 19, 'stock' => 999, 'image' => $img('mono'),
            'seller_id' => $sellerIds['pixel@mailmarket.dev'],
            'rating' => 4.9, 'reviews_count' => 421,
            'delivery_type' => 'Instant Download', 'sales' => 2310,
            'trending' => true,
            'created_at' => '2025-07-10',
        ]);

        Product::create([
            'title' => 'The Indie Maker Playbook',
            'description' => '180-page e-book on shipping, pricing, and marketing your first digital product.',
            'category_id' => $categories['ebooks'],
            'price' => 24, 'stock' => 999, 'image' => $img('playbook'),
            'seller_id' => $sellerIds['nova@mailmarket.dev'],
            'rating' => 4.5, 'reviews_count' => 73,
            'delivery_type' => 'Email Delivery', 'sales' => 410,
            'created_at' => '2025-08-18',
        ]);

        Product::create([
            'title' => 'Helios — Landing Page Template',
            'description' => 'Modern marketing template. 14 pre-built sections, MDX blog, contact form.',
            'category_id' => $categories['templates'],
            'price' => 59, 'stock' => 999, 'image' => $img('helios'),
            'seller_id' => $sellerIds['pixel@mailmarket.dev'],
            'rating' => 4.8, 'reviews_count' => 142,
            'delivery_type' => 'Instant Download', 'sales' => 780,
            'featured' => true,
            'created_at' => '2025-09-01',
        ]);

        Product::create([
            'title' => 'Frost — Editorial Serif',
            'description' => 'High-contrast editorial serif with 5 weights and small caps.',
            'category_id' => $categories['fonts'],
            'price' => 65, 'stock' => 999, 'image' => $img('frost'),
            'seller_id' => $sellerIds['lumen@mailmarket.dev'],
            'rating' => 4.7, 'reviews_count' => 64,
            'delivery_type' => 'Instant Download', 'sales' => 240,
            'created_at' => '2025-08-05',
        ]);

        Product::create([
            'title' => 'Atmos — Ambient Pads',
            'description' => '40 evolving ambient pads designed for film scoring and meditation apps.',
            'category_id' => $categories['music'],
            'price' => 29, 'stock' => 999, 'image' => $img('atmos'),
            'seller_id' => $sellerIds['north@mailmarket.dev'],
            'rating' => 4.6, 'reviews_count' => 51,
            'delivery_type' => 'Instant Download', 'sales' => 320,
            'created_at' => '2025-07-22',
        ]);

        Product::create([
            'title' => 'React Component Library Pro',
            'description' => '60+ accessible React components with Storybook, tests, and theming.',
            'category_id' => $categories['code'],
            'price' => 129, 'stock' => 999, 'image' => $img('rcl'),
            'seller_id' => $sellerIds['helix@mailmarket.dev'],
            'rating' => 4.9, 'reviews_count' => 211,
            'delivery_type' => 'License Key', 'sales' => 670,
            'featured' => true, 'trending' => true,
            'created_at' => '2025-10-10',
        ]);

        Product::create([
            'title' => 'Cinematic Stock Photos — City',
            'description' => '120 high-res cinematic city photos. Commercial license included.',
            'category_id' => $categories['photos'],
            'price' => 35, 'stock' => 999, 'image' => $img('city'),
            'seller_id' => $sellerIds['pixel@mailmarket.dev'],
            'rating' => 4.4, 'reviews_count' => 39,
            'delivery_type' => 'Instant Download', 'sales' => 180,
            'created_at' => '2025-06-30',
        ]);

        Product::create([
            'title' => 'Saturn — Notion Templates Bundle',
            'description' => '12 productivity templates for founders, freelancers, and creators.',
            'category_id' => $categories['templates'],
            'price' => 29, 'stock' => 999, 'image' => $img('saturn'),
            'seller_id' => $sellerIds['pixel@mailmarket.dev'],
            'rating' => 4.7, 'reviews_count' => 95,
            'delivery_type' => 'Email Delivery', 'sales' => 460,
            'trending' => true,
            'created_at' => '2025-09-18',
        ]);
    }
}

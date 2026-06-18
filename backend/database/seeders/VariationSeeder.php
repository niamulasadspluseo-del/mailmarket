<?php

namespace Database\Seeders;

use App\Models\ProductVariation;
use Illuminate\Database\Seeder;

class VariationSeeder extends Seeder
{
    public function run(): void
    {
        $products = \App\Models\Product::pluck('id', 'title');

        $variations = [
            'Gmail Bulk — 10 Accounts Pack' => [
                ['name' => 'Standard', 'price' => 299, 'stock' => 50, 'sort_order' => 1],
                ['name' => 'Warmed Up', 'price' => 499, 'stock' => 20, 'sort_order' => 2],
            ],
            'Hotmail — Legacy Account (No Numbers)' => [
                ['name' => 'Standard', 'price' => 129, 'stock' => 20, 'sort_order' => 1],
                ['name' => 'Premium (No Numbers)', 'price' => 199, 'stock' => 10, 'sort_order' => 2],
            ],
            'Outlook Business — 5 Accounts' => [
                ['name' => 'Basic', 'price' => 199, 'stock' => 25, 'sort_order' => 1],
                ['name' => 'Pro (with Phone)', 'price' => 349, 'stock' => 15, 'sort_order' => 2],
            ],
            'Proton Mail — Encrypted Account' => [
                ['name' => 'Plus (10GB)', 'price' => 69, 'stock' => 15, 'sort_order' => 1],
                ['name' => 'Visionary (50GB)', 'price' => 199, 'stock' => 10, 'sort_order' => 2],
            ],
            'Outlook — 10 Accounts Bulk' => [
                ['name' => 'Standard', 'price' => 449, 'stock' => 20, 'sort_order' => 1],
                ['name' => 'Warmed + Aged', 'price' => 799, 'stock' => 10, 'sort_order' => 2],
            ],
            'Yahoo Mail — 5 Accounts Pack' => [
                ['name' => 'Standard', 'price' => 249, 'stock' => 20, 'sort_order' => 1],
                ['name' => 'Aged (2yr+)', 'price' => 449, 'stock' => 15, 'sort_order' => 2],
            ],
            'AOL Mail — Premium Address' => [
                ['name' => 'Standard', 'price' => 199, 'stock' => 8, 'sort_order' => 1],
                ['name' => 'Vintage', 'price' => 299, 'stock' => 2, 'sort_order' => 2],
            ],
        ];

        foreach ($variations as $title => $items) {
            $productId = $products[$title] ?? null;
            if (!$productId) continue;

            foreach ($items as $data) {
                ProductVariation::firstOrCreate(
                    ['product_id' => $productId, 'name' => $data['name']],
                    $data + ['product_id' => $productId]
                );
            }
        }
    }
}

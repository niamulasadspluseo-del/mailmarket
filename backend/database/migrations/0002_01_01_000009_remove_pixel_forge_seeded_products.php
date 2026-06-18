<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $titles = [
            'Gmail — Premium Aged Account',
            'Yahoo Mail — Vintage Account',
            'Gmail — Phone Verified Account',
            'Zoho Mail — Business Account',
            'Mail.com — Custom Username Account',
        ];

        Product::whereIn('title', $titles)->delete();
    }

    public function down(): void
    {
        // No need to restore seeded data
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->foreignId('variation_id')->nullable()->constrained('product_variations')->nullOnDelete()->after('product_id');
            $table->dropUnique(['user_id', 'product_id']);
            $table->unique(['user_id', 'product_id', 'variation_id']);
        });
    }

    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'product_id', 'variation_id']);
            $table->unique(['user_id', 'product_id']);
            $table->dropForeign(['variation_id']);
            $table->dropColumn('variation_id');
        });
    }
};

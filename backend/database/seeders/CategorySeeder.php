<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'gmail', 'name' => 'Gmail Accounts', 'icon' => 'Mail'],
            ['slug' => 'outlook', 'name' => 'Outlook & Hotmail', 'icon' => 'Mail'],
            ['slug' => 'yahoo', 'name' => 'Yahoo Mail', 'icon' => 'Mail'],
            ['slug' => 'proton', 'name' => 'Proton Mail', 'icon' => 'Shield'],
            ['slug' => 'aol', 'name' => 'AOL & Legacy', 'icon' => 'Archive'],
            ['slug' => 'business', 'name' => 'Business Email', 'icon' => 'Briefcase'],
            ['slug' => 'bulk', 'name' => 'Bulk Packs', 'icon' => 'Package'],
            ['slug' => 'premium', 'name' => 'Premium & Aged', 'icon' => 'Star'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}

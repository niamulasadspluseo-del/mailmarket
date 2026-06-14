<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'templates', 'name' => 'Web Templates', 'icon' => 'Layout'],
            ['slug' => 'ui-kits', 'name' => 'UI Kits', 'icon' => 'Palette'],
            ['slug' => 'ebooks', 'name' => 'E-books', 'icon' => 'BookOpen'],
            ['slug' => 'fonts', 'name' => 'Fonts', 'icon' => 'Type'],
            ['slug' => 'icons', 'name' => 'Icon Packs', 'icon' => 'Sparkles'],
            ['slug' => 'music', 'name' => 'Audio & Music', 'icon' => 'Music'],
            ['slug' => 'photos', 'name' => 'Stock Photos', 'icon' => 'Image'],
            ['slug' => 'code', 'name' => 'Code & Scripts', 'icon' => 'Code2'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Demo Admin', 'email' => 'admin@mailmarket.dev', 'role' => 'admin', 'avatar' => 'https://i.pravatar.cc/150?img=12', 'bio' => 'Platform administrator.', 'approved' => true],
            ['name' => 'Pixel Forge Studio', 'email' => 'pixel@mailmarket.dev', 'role' => 'seller', 'avatar' => 'https://i.pravatar.cc/150?img=15', 'bio' => 'Premium UI kits and design systems for modern teams.', 'approved' => true],
            ['name' => 'Northwave Audio', 'email' => 'north@mailmarket.dev', 'role' => 'seller', 'avatar' => 'https://i.pravatar.cc/150?img=33', 'bio' => 'Cinematic loops, ambient pads, and SFX collections.', 'approved' => true],
            ['name' => 'Lumen Type Co.', 'email' => 'lumen@mailmarket.dev', 'role' => 'seller', 'avatar' => 'https://i.pravatar.cc/150?img=47', 'bio' => 'Independent type foundry crafting display & text faces.', 'approved' => true],
            ['name' => 'Helix Code Labs', 'email' => 'helix@mailmarket.dev', 'role' => 'seller', 'avatar' => 'https://i.pravatar.cc/150?img=53', 'bio' => 'Production-ready React, Next.js & TypeScript starters.', 'approved' => true],
            ['name' => 'Nova Reads', 'email' => 'nova@mailmarket.dev', 'role' => 'seller', 'avatar' => 'https://i.pravatar.cc/150?img=24', 'bio' => 'Indie publisher of design & business e-books.', 'approved' => false],
            ['name' => 'Sarah Chen', 'email' => 'sarah@mailmarket.dev', 'role' => 'buyer', 'avatar' => 'https://i.pravatar.cc/150?img=5', 'approved' => true],
            ['name' => 'Marcus Lee', 'email' => 'marcus@mailmarket.dev', 'role' => 'buyer', 'avatar' => 'https://i.pravatar.cc/150?img=8', 'approved' => true],
            ['name' => 'Priya Raman', 'email' => 'priya@mailmarket.dev', 'role' => 'buyer', 'avatar' => 'https://i.pravatar.cc/150?img=49', 'approved' => true],
        ];

        foreach ($users as $user) {
            User::firstOrCreate(
                ['email' => $user['email']],
                [...$user, 'password' => bcrypt('password')]
            );
        }
    }
}

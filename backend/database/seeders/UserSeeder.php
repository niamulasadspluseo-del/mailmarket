<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Demo Admin',
            'email' => 'admin@mailmarket.dev',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'avatar' => 'https://i.pravatar.cc/150?img=12',
            'bio' => 'Platform administrator.',
            'approved' => true,
        ]);

        User::create([
            'name' => 'Pixel Forge Studio',
            'email' => 'pixel@mailmarket.dev',
            'password' => bcrypt('password'),
            'role' => 'seller',
            'avatar' => 'https://i.pravatar.cc/150?img=15',
            'bio' => 'Premium UI kits and design systems for modern teams.',
            'approved' => true,
        ]);

        User::create([
            'name' => 'Northwave Audio',
            'email' => 'north@mailmarket.dev',
            'password' => bcrypt('password'),
            'role' => 'seller',
            'avatar' => 'https://i.pravatar.cc/150?img=33',
            'bio' => 'Cinematic loops, ambient pads, and SFX collections.',
            'approved' => true,
        ]);

        User::create([
            'name' => 'Lumen Type Co.',
            'email' => 'lumen@mailmarket.dev',
            'password' => bcrypt('password'),
            'role' => 'seller',
            'avatar' => 'https://i.pravatar.cc/150?img=47',
            'bio' => 'Independent type foundry crafting display & text faces.',
            'approved' => true,
        ]);

        User::create([
            'name' => 'Helix Code Labs',
            'email' => 'helix@mailmarket.dev',
            'password' => bcrypt('password'),
            'role' => 'seller',
            'avatar' => 'https://i.pravatar.cc/150?img=53',
            'bio' => 'Production-ready React, Next.js & TypeScript starters.',
            'approved' => true,
        ]);

        User::create([
            'name' => 'Nova Reads',
            'email' => 'nova@mailmarket.dev',
            'password' => bcrypt('password'),
            'role' => 'seller',
            'avatar' => 'https://i.pravatar.cc/150?img=24',
            'bio' => 'Indie publisher of design & business e-books.',
            'approved' => false,
        ]);

        User::create([
            'name' => 'Sarah Chen',
            'email' => 'sarah@mailmarket.dev',
            'password' => bcrypt('password'),
            'role' => 'buyer',
            'avatar' => 'https://i.pravatar.cc/150?img=5',
            'approved' => true,
        ]);

        User::create([
            'name' => 'Marcus Lee',
            'email' => 'marcus@mailmarket.dev',
            'password' => bcrypt('password'),
            'role' => 'buyer',
            'avatar' => 'https://i.pravatar.cc/150?img=8',
            'approved' => true,
        ]);

        User::create([
            'name' => 'Priya Raman',
            'email' => 'priya@mailmarket.dev',
            'password' => bcrypt('password'),
            'role' => 'buyer',
            'avatar' => 'https://i.pravatar.cc/150?img=49',
            'approved' => true,
        ]);
    }
}

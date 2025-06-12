<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        $branch = Branch::where('slug', 'downtown-branch')->first();
        $admin = User::where('email', 'admin@example.com')->first();

        $services = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'Haircut',
                'slug' => 'haircut',
                'description' => 'Professional haircut service.',
                'branch_id' => $branch ? $branch->id : null,
                'excerpt' => 'Standard haircut.',
                'duration' => 30,
                'price' => 25.00,
                'discount_price' => 20.00,
                'requires_buffer' => true,
                'is_active' => true,
                'is_promotion' => true,
                'created_by' => $admin ? $admin->id : null,
                'updated_by' => $admin ? $admin->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Massage',
                'slug' => 'massage',
                'description' => 'Relaxing full-body massage.',
                'branch_id' => $branch ? $branch->id : null,
                'excerpt' => '60-minute massage.',
                'duration' => 60,
                'price' => 50.00,
                'discount_price' => null,
                'requires_buffer' => true,
                'is_active' => true,
                'is_promotion' => false,
                'created_by' => $admin ? $admin->id : null,
                'updated_by' => $admin ? $admin->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($services as $serviceData) {
            Service::create($serviceData);
        }
    }
}
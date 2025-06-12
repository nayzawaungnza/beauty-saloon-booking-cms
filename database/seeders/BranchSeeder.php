<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Support\Str;

class BranchSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        $manager = User::where('email', 'john.manager@example.com')->first();

        $branches = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'Downtown Branch',
                'slug' => 'downtown-branch',
                'description' => 'Main branch in the city center.',
                'address' => '123 Main St, Downtown',
                'phone' => '555-0100',
                'city' => 'New York',
                'state' => 'NY',
                'zip' => '10001',
                'manager_id' => $manager ? $manager->id : null,
                'latitude' => 40.7128,
                'longitude' => -74.0060,
                'is_active' => true,
                'created_by' => $manager ? $manager->id : null,
                'updated_by' => $manager ? $manager->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Uptown Branch',
                'slug' => 'uptown-branch',
                'description' => 'Branch in the uptown area.',
                'address' => '456 Uptown Ave',
                'phone' => '555-0101',
                'city' => 'New York',
                'state' => 'NY',
                'zip' => '10002',
                'manager_id' => $manager ? $manager->id : null,
                'latitude' => 40.7831,
                'longitude' => -73.9712,
                'is_active' => true,
                'created_by' => $manager ? $manager->id : null,
                'updated_by' => $manager ? $manager->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($branches as $branchData) {
            Branch::create($branchData);
        }
    }
}
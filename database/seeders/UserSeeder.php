<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        // Create roles
        // $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        // $managerRole = Role::firstOrCreate(['name' => 'Manager']);
         //$customerRole = Role::firstOrCreate(['name' => 'Customer']);

        // Sample users
        $users = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'mobile' => '555-0001',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'is_blocked' => false,
                'is_subscribed' => true,
                'created_by' => null,
                'updated_by' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'role' => 'Admin',
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'John Manager',
                'email' => 'john.manager@example.com',
                'mobile' => '555-0002',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'is_blocked' => false,
                'is_subscribed' => true,
                'created_by' => null,
                'updated_by' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'role' => 'Manager',
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Jane Customer',
                'email' => 'jane.customer@example.com',
                'mobile' => '555-0003',
                'password' => Hash::make('password123'),
                'is_active' => true,
                'is_blocked' => false,
                'is_subscribed' => true,
                'created_by' => null,
                'updated_by' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'role' => 'User',
            ],
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            unset($userData['role']);
            $user = User::create($userData);
            $user->assignRole($role);
        }
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Staff;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Support\Str;

class StaffSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        $branch = Branch::where('slug', 'downtown-branch')->first();
        $admin = User::where('email', 'admin@example.com')->first();

        $staff = [
            [
                'id' => (string) Str::uuid(),
                'name' => 'Alice Staff',
                'email' => 'alice.staff@example.com',
                'phone' => '555-0102',
                'slug' => 'alice-staff',
                'branch_id' => $branch ? $branch->id : null,
                'specialization' => 'Hair Stylist',
                'description' => 'Experienced hair stylist.',
                'excerpt' => 'Expert in haircuts and styling.',
                'is_active' => true,
                'created_by' => $admin ? $admin->id : null,
                'updated_by' => $admin ? $admin->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'name' => 'Bob Staff',
                'email' => 'bob.staff@example.com',
                'phone' => '555-0103',
                'slug' => 'bob-staff',
                'branch_id' => $branch ? $branch->id : null,
                'specialization' => 'Massage Therapist',
                'description' => 'Certified massage therapist.',
                'excerpt' => 'Specialist in relaxation massages.',
                'is_active' => true,
                'created_by' => $admin ? $admin->id : null,
                'updated_by' => $admin ? $admin->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($staff as $staffData) {
            Staff::create($staffData);
        }
    }
}
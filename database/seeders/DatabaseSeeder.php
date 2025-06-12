<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RolePermissionSeeder::class,
            // ServiceSeeder::class,
            // StaffSeeder::class,
            // StaffServiceSeeder::class,
            
            UserSeeder::class,
            BranchSeeder::class,
            StaffSeeder::class,
            ServiceSeeder::class,
            StaffServiceSeeder::class,
            TimeslotSeeder::class,
            StaffScheduleSeeder::class,
            BookingSeeder::class,
            BookingServiceSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
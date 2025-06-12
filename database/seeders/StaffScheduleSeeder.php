<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StaffSchedule;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Support\Str;

class StaffScheduleSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        $alice = Staff::where('slug', 'alice-staff')->first();
        $admin = User::where('email', 'admin@example.com')->first();

        $schedules = [
            [
                'id' => (string) Str::uuid(),
                'staff_id' => $alice ? $alice->id : null,
                'day_of_week' => 1, // Monday
                'start_time' => '09:00:00',
                'end_time' => '17:00:00',
                'is_available' => true,
                'created_by' => $admin ? $admin->id : null,
                'updated_by' => $admin ? $admin->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'staff_id' => $alice ? $alice->id : null,
                'day_of_week' => 2, // Tuesday
                'start_time' => '09:00:00',
                'end_time' => '17:00:00',
                'is_available' => true,
                'created_by' => $admin ? $admin->id : null,
                'updated_by' => $admin ? $admin->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($schedules as $scheduleData) {
            if ($scheduleData['staff_id']) {
                StaffSchedule::create($scheduleData);
            }
        }
    }
}
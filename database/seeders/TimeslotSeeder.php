<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Timeslot;
use App\Models\Staff;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Support\Str;

class TimeslotSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        $alice = Staff::where('slug', 'alice-staff')->first();
        $branch = Branch::where('slug', 'downtown-branch')->first();
        $admin = User::where('email', 'admin@example.com')->first();

        $timeslots = [
            [
                'id' => (string) Str::uuid(),
                'staff_id' => $alice ? $alice->id : null,
                'branch_id' => $branch ? $branch->id : null,
                'date' => now()->addDays(1)->format('Y-m-d'),
                'start_time' => '09:00:00',
                'end_time' => '10:00:00',
                'is_available' => true,
                'created_by' => $admin ? $admin->id : null,
                'updated_by' => $admin ? $admin->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'staff_id' => $alice ? $alice->id : null,
                'branch_id' => $branch ? $branch->id : null,
                'date' => now()->addDays(1)->format('Y-m-d'),
                'start_time' => '10:00:00',
                'end_time' => '11:00:00',
                'is_available' => true,
                'created_by' => $admin ? $admin->id : null,
                'updated_by' => $admin ? $admin->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($timeslots as $timeslotData) {
            if ($timeslotData['staff_id'] && $timeslotData['branch_id']) {
                Timeslot::create($timeslotData);
            }
        }
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Staff;
use App\Models\Service;
use Illuminate\Support\Facades\DB;

class StaffServiceSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        $alice = Staff::where('slug', 'alice-staff')->first();
        $bob = Staff::where('slug', 'bob-staff')->first();
        $haircut = Service::where('slug', 'haircut')->first();
        $massage = Service::where('slug', 'massage')->first();

        $staffServices = [
            [
                'staff_id' => $alice ? $alice->id : null,
                'service_id' => $haircut ? $haircut->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'staff_id' => $bob ? $bob->id : null,
                'service_id' => $massage ? $massage->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($staffServices as $staffService) {
            if ($staffService['staff_id'] && $staffService['service_id']) {
                DB::table('staff_service')->insert($staffService);
            }
        }
    }
}
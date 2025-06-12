<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\User;
use App\Models\Staff;
use App\Models\Branch;
use App\Models\Timeslot;
use Illuminate\Support\Str;

class BookingSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        $customer = User::where('email', 'jane.customer@example.com')->first();
        $staff = Staff::where('slug', 'alice-staff')->first();
        $branch = Branch::where('slug', 'downtown-branch')->first();
        $timeslot = Timeslot::first();
        $admin = User::where('email', 'admin@example.com')->first();

        $bookings = [
            [
                'id' => (string) Str::uuid(),
                'customer_id' => $customer ? $customer->id : null,
                'staff_id' => $staff ? $staff->id : null,
                'branch_id' => $branch ? $branch->id : null,
                'timeslot_id' => $timeslot ? $timeslot->id : null,
                'status' => 'confirmed',
                'booking_date' => now()->addDays(1)->format('Y-m-d'),
                'start_time' => '09:00:00',
                'end_time' => '09:30:00',
                'notes' => 'Customer prefers quick service.',
                'created_by' => $admin ? $admin->id : null,
                'updated_by' => $admin ? $admin->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($bookings as $bookingData) {
            if ($bookingData['customer_id'] && $bookingData['staff_id'] && $bookingData['branch_id'] && $bookingData['timeslot_id']) {
                Booking::create($bookingData);
            }
        }
    }
}
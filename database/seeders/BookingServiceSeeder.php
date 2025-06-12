<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Support\Facades\DB;

class BookingServiceSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        $booking = Booking::first();
        $haircut = Service::where('slug', 'haircut')->first();

        $bookingServices = [
            [
                'booking_id' => $booking ? $booking->id : null,
                'service_id' => $haircut ? $haircut->id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($bookingServices as $bookingService) {
            if ($bookingService['booking_id'] && $bookingService['service_id']) {
                DB::table('booking_service')->insert($bookingService);
            }
        }
    }
}
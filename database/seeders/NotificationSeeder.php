<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Booking;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run(): void
    {
        $customer = User::where('email', 'jane.customer@example.com')->first();
        $booking = Booking::first();

        $notifications = [
            [
                'id' => (string) Str::uuid(),
                'type' => 'App\Notifications\BookingConfirmed',
                'notifiable_type' => 'App\Models\User',
                'notifiable_id' => $customer ? $customer->id : null,
                'data' => json_encode(['message' => 'Your booking has been confirmed!', 'booking_id' => $booking ? $booking->id : null]),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($notifications as $notificationData) {
            if ($notificationData['notifiable_id']) {
                DB::table('notifications')->insert($notificationData);
            }
        }
    }
}
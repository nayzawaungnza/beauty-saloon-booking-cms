<?php

namespace App\Events;

use App\Models\Booking;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class BookingStatusUpdatedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $booking;
    public $previousStatus;
    /**
     * Create a new event instance.
     */
    public function __construct(Booking $booking, $previousStatus)
    {
        $this->booking = $booking;
        $this->previousStatus = $previousStatus;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        if ($this->booking->customer_id) {
            return [
                new Channel('user.' . $this->booking->customer_id),
                new Channel('admin.bookings')
            ];
        }
        return [
            new PrivateChannel('admin.bookings'),
        ];
    }
    public function broadcastAs()
    {
        return 'booking.status.updated';
    }
}
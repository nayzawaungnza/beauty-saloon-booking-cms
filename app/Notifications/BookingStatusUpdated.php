<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class BookingStatusUpdated extends Notification
{
    use Queueable;

    public $booking;
    public $previousStatus;
    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking, $previousStatus)
    {
        $this->booking = $booking;
        $this->previousStatus = $previousStatus;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database','mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Booking Status Updated')
            ->line('Your booking status has been updated from ' . $this->previousStatus . ' to ' . $this->booking->status)
            ->action('View Booking', route('booking.show', $this->booking->id));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'message' => 'Booking status updated to ' . $this->booking->status,
            'url' => route('booking.show', $this->booking->id),
        ];
    }
}
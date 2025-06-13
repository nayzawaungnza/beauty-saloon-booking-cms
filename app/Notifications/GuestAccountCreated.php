<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GuestAccountCreated extends Notification
{
    use Queueable;

    public $password;
    /**
     * Create a new notification instance.
     */
    public function __construct($password)
    {
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Booking Account')
            ->line('An account has been created for you with the following credentials:')
            ->line('Email: ' . $notifiable->email)
            ->line('Password: ' . $this->password)
            ->line('Please change your password after logging in.')
            ->action('Login to Your Account', url('/login'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
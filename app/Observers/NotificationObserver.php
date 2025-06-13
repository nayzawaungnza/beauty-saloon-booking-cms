<?php

namespace App\Observers;

use App\Models\Notification;
use App\Events\NotificationCreated;

class NotificationObserver
{
    /**
     * Handle the Notification "created" event.
     */
    public function created(Notification $notification): void
    {
        event(new NotificationCreated($notification));
    }

    /**
     * Handle the Notification "updated" event.
     */
    public function updated(Notification $notification): void
    {
        if ($notification->read_at && !$notification->getOriginal('read_at')) {
            event(new NotificationRead($notification));
        }
    }

    /**
     * Handle the Notification "deleted" event.
     */
    public function deleted(Notification $notification): void
    {
        //
    }

    /**
     * Handle the Notification "restored" event.
     */
    public function restored(Notification $notification): void
    {
        //
    }

    /**
     * Handle the Notification "force deleted" event.
     */
    public function forceDeleted(Notification $notification): void
    {
        //
    }
}
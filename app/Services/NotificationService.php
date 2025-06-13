<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Backend\NotificationRepository;
use App\Services\Interfaces\NotificationServiceInterface;

class NotificationService implements NotificationServiceInterface
{
    protected $notificationRepository;

    public function __construct(NotificationRepository $notificationRepository)
    {
        $this->notificationRepository = $notificationRepository;
    }

    public function getUserNotifications(User $user)
    {
        return $user->notifications()->paginate(10);
    }

    public function getUnreadCount(User $user): int
    {
        return $user->unreadNotifications()->count();
    }

    public function markAsRead(string $id, User $user): void
    {
        $notification = $user->notifications()->where('id', $id)->first();
        if ($notification) {
            $notification->markAsRead();
        }
    }

    public function markAllAsRead(User $user): void
    {
        $user->unreadNotifications->markAsRead();
    }

    public function createNotification(User $user, array $data)
    {
        return $user->notifications()->create($data);
    }
}
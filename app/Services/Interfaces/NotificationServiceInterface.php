<?php

namespace App\Services\Interfaces;

interface NotificationServiceInterface
{
    public function getUserNotifications(User $user);
    public function getUnreadCount(User $user): int;
    public function markAsRead(string $id, User $user): void;
    public function markAllAsRead(User $user): void;
    public function createNotification(User $user, array $data);
}
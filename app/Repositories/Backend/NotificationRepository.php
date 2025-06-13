<?php

namespace App\Repositories\Backend;

use App\Models\Notification;

use App\Repositories\BaseRepository;

class NotificationRepository extends BaseRepository
{
   public function model()
    {
        return Notification::class;
    }
    public function getPaginated(int $perPage = 10)
    {
        return $this->model->latest()->paginate($perPage);
    }

    public function getUnreadCountForUser(int $userId): int
    {
        return $this->model
            ->where('notifiable_id', $userId)
            ->whereNull('read_at')
            ->count();
    }

    public function markAsRead(int $notificationId, int $userId): void
    {
        $this->model->where('id', $notificationId)
            ->where('notifiable_id', $userId)
            ->update(['read_at' => now()]);
    }

    public function markAllAsRead(int $userId): void
    {
        $this->model->where('notifiable_id', $userId)
            ->update(['read_at' => now()]);
    }
    
}
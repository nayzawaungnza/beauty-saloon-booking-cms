<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('admin.bookings', function ($user) {
    return $user->hasRole('Admin');
});

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
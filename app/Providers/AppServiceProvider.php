<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Image;
use App\Models\Service;

use App\Models\Notification;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Schema;
use App\Observers\NotificationObserver;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Schema::defaultStringLength(191);

        Relation::morphMap([
            'Image' => Image::class,
            'Service' => Service::class,
            'User' => User::class,
            
            
        ]);
        Notification::observe(NotificationObserver::class);
        
    }
}
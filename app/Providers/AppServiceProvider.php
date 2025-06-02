<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Image;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use PhpOffice\PhpSpreadsheet\Calculation\Web\Service;

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
            //'Post' => Post::class,
            //'Page' => Page::class,
            'Service' => Service::class,
            'User' => User::class,
            //'Partner' => Partner::class,
           // 'Slider' => Slider::class,
            //'Client' => Client::class,
            //'PostCategory' => PostCategory::class,
            //'Assignment' => Assignment::class,
            //'Transaction' => Transaction::class,
            //'Enrollment' => Enrollment::class,
            
        ]);
        
    }
}
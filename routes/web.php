<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

// Client Authenticated Routes
Route::middleware(['auth', 'verified', 'role:User'])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard/index'))->name('dashboard');
    Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Authenticated Routes
Route::middleware(['auth', 'verified', 'role:Super Admin|Admin', 'check_user_active'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])
        ->name('dashboard');
    Route::resource('/users', App\Http\Controllers\Backend\UserController::class);
    Route::patch('users/{user}/change_status',[App\Http\Controllers\Backend\UserController::class, 'changeStatus'])->name('users.changeStatus');
    
    Route::resource('/services', App\Http\Controllers\Backend\ServiceController::class);
    Route::patch('services/{service}/change_status',[App\Http\Controllers\Backend\ServiceController::class, 'changeStatus'])->name('services.changeStatus');
    
});

require __DIR__.'/auth.php';
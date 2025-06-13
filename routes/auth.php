<?php

use Illuminate\Support\Facades\Route;

// Client Authentication
Route::middleware('guest')->group(function () {
    Route::get('login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);
    
    Route::get('register', [App\Http\Controllers\Auth\RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);

});

// Admin Authentication
Route::middleware('guest')->prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [App\Http\Controllers\Admin\Auth\AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [App\Http\Controllers\Admin\Auth\AuthenticatedSessionController::class, 'store'])
        ->name('login');
    
    Route::get('register', [App\Http\Controllers\Admin\Auth\RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [App\Http\Controllers\Admin\Auth\RegisteredUserController::class, 'store'])
        ->name('register');
});

// Logout (shared)
Route::post('logout', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');
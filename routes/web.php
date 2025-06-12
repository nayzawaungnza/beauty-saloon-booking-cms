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
    
    Route::resource('/staff', App\Http\Controllers\Backend\StaffController::class);
    
    Route::patch('staff/{staff}/status', [App\Http\Controllers\Backend\StaffController::class, 'changeStatus'])->name('staff.changeStatus');
    Route::patch('staff/{staff}/restore', [App\Http\Controllers\Backend\StaffController::class, 'restore'])->name('staff.restore');
    Route::get('staff/search', [App\Http\Controllers\Backend\StaffController::class, 'search'])->name('staff.search');
    Route::get('staff/branch/{branch}', [App\Http\Controllers\Backend\StaffController::class, 'getByBranch'])->name('staff.byBranch');
    
    Route::resource('/staff_availability', App\Http\Controllers\Backend\StaffAvailabilityController::class);
    Route::get('staff-availability-calendar', [App\Http\Controllers\Backend\StaffAvailabilityController::class, 'calendar'])->name('staff_availability.calendar');
    Route::get('staff-availability-batch/create', [App\Http\Controllers\Backend\StaffAvailabilityController::class, 'createBatch'])->name('staff_availability.create-batch');
    Route::post('staff-availability-batch', [App\Http\Controllers\Backend\StaffAvailabilityController::class, 'storeBatch'])->name('staff_availability.store-batch');
    Route::post('staff/{staff}/generate-default-availability', [App\Http\Controllers\Backend\StaffAvailabilityController::class, 'generateDefault'])->name('staff_availability.generate-default');
    Route::post('staff-availability/check', [App\Http\Controllers\Backend\StaffAvailabilityController::class, 'checkAvailability'])->name('staff_availability.check');
    Route::post('staff-availability/find-available', [App\Http\Controllers\Backend\StaffAvailabilityController::class, 'findAvailableStaff'])->name('staff_availability.find-available');

    Route::resource('/branches', App\Http\Controllers\Backend\BranchController::class);
    Route::patch('branches/{branch}/status', [App\Http\Controllers\Backend\BranchController::class, 'changeStatus'])->name('branches.changeStatus');
    Route::patch('branches/{branch}/restore', [App\Http\Controllers\Backend\BranchController::class, 'restore'])->name('branches.restore');
    Route::get('branches/search', [App\Http\Controllers\Backend\BranchController::class, 'search'])->name('branches.search');

    Route::resource('/roles', App\Http\Controllers\Backend\RoleController::class);

    // Staff Schedule routes
    Route::resource('staff-schedules', App\Http\Controllers\Backend\StaffScheduleController::class);
    Route::post('staff-schedules/bulk', [App\Http\Controllers\Backend\StaffScheduleController::class, 'bulkCreate'])->name('staff-schedules.bulk');
    
    // Timeslot routes
    Route::get('bulk-timeslots/create', [App\Http\Controllers\Backend\TimeslotController::class, 'bulkCreateForm'])->name('timeslots.bulk-create');
    Route::post('bulk-timeslots', [App\Http\Controllers\Backend\TimeslotController::class, 'bulkCreate'])->name('timeslots.bulk');
    Route::post('bulk-timeslots/preview', [App\Http\Controllers\Backend\TimeslotController::class, 'preview'])->name('timeslots.preview');
    Route::resource('timeslots', App\Http\Controllers\Backend\TimeslotController::class);
    
    Route::resource('bookings', App\Http\Controllers\Backend\BookingController::class);
    Route::patch('bookings/{booking}/confirm', [App\Http\Controllers\Backend\BookingController::class, 'confirm'])->name('bookings.confirm');
    Route::patch('bookings/{booking}/cancel', [App\Http\Controllers\Backend\BookingController::class, 'cancel'])->name('bookings.cancel');
    Route::patch('bookings/{booking}/complete', [App\Http\Controllers\Backend\BookingController::class, 'complete'])->name('bookings.complete');
    Route::post('bookings/check-availability', [App\Http\Controllers\Backend\BookingController::class, 'checkAvailability'])->name('bookings.checkAvailability');
    Route::get('bookings/available-timeslots', [App\Http\Controllers\Backend\BookingController::class, 'getAvailableTimeslots'])->name('bookings.availableTimeslots');
    
    // Calendar routes
    Route::get('calendar', [App\Http\Controllers\Backend\CalendarController::class, 'index'])->name('calendar.index');
    Route::get('calendar/bookings', [App\Http\Controllers\Backend\CalendarController::class, 'getBookings'])->name('calendar.bookings');
    
    // Activity Log routes
    Route::get('activity-logs', [App\Http\Controllers\Backend\ActivityLogController::class, 'index'])->name('activity-logs.index');
    Route::get('activity-logs/{activityLog}', [App\Http\Controllers\Backend\ActivityLogController::class, 'show'])->name('activity-logs.show');
    Route::get('activity-logs/export', [App\Http\Controllers\Backend\ActivityLogController::class, 'export'])->name('activity-logs.export');
});

require __DIR__.'/auth.php';
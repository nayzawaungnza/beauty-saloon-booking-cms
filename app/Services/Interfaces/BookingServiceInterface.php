<?php

namespace App\Services\Interfaces;

use App\Models\Booking;

interface BookingServiceInterface
{
    public function getAllBookings();
    public function getBookingsByCustomer($customerId);
    public function getBookingsByStaff($staffId);
    public function getBookingsByBranch($branchId);
    public function getBookingsByDate($date);
    public function getBookingsByDateRange($startDate, $endDate);
    public function getBookingsByStatus($status);
    public function getBookingById($id);
    public function create(array $data);
    public function update(Booking $booking, array $data);
    public function delete(Booking $booking);
    public function confirmBooking(Booking $booking);
    public function cancelBooking(Booking $booking);
    public function completeBooking(Booking $booking);
    public function checkAvailability($branchId, $date, $startTime, $endTime, $staffId = null);
    public function getAvailableTimeslots($branchId, $date, $staffId = null);
}
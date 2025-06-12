<?php

namespace App\Services;

use Exception;
use App\Models\Booking;
use InvalidArgumentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\Backend\BookingRepository;
use App\Services\Interfaces\BookingServiceInterface;

class BookingService implements BookingServiceInterface
{
    protected $bookingRepository;

    public function __construct(BookingRepository $bookingRepository)
    {
        $this->bookingRepository = $bookingRepository;
    }

    public function getAllBookings()
    {
        return $this->bookingRepository->getAllBookings();
    }

    public function getBookingsByCustomer($customerId)
    {
        return $this->bookingRepository->getBookingsByCustomer($customerId);
    }

    public function getBookingsByStaff($staffId)
    {
        return $this->bookingRepository->getBookingsByStaff($staffId);
    }

    public function getBookingsByBranch($branchId)
    {
        return $this->bookingRepository->getBookingsByBranch($branchId);
    }

    public function getBookingsByDate($date)
    {
        return $this->bookingRepository->getBookingsByDate($date);
    }

    public function getBookingsByDateRange($startDate, $endDate)
    {
        return $this->bookingRepository->getBookingsByDateRange($startDate, $endDate);
    }

    public function getBookingsByStatus($status)
    {
        return $this->bookingRepository->getBookingsByStatus($status);
    }

    public function getBookingById($id)
    {
        return $this->bookingRepository->getBookingById($id);
    }

    public function create(array $data)
    {
        DB::beginTransaction();
        try {
            // Validate availability before creating
            $isAvailable = $this->checkAvailability(
                $data['branch_id'],
                $data['booking_date'],
                $data['start_time'],
                $data['end_time'],
                $data['staff_id'] ?? null
            );

            if (!$isAvailable) {
                throw new InvalidArgumentException('The selected time slot is not available');
            }

            $booking = $this->bookingRepository->create($data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Booking Creation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to create booking: ' . $exc->getMessage());
        }
        DB::commit();
        return $booking;
    }

    public function update(Booking $booking, array $data)
    {
        DB::beginTransaction();
        try {
            //$booking = $this->getBookingById($id);

            // Check availability if time/date/staff is being changed
            if (isset($data['booking_date']) || isset($data['start_time']) || isset($data['end_time']) || isset($data['staff_id'])) {
                $isAvailable = $this->checkAvailability(
                    $data['branch_id'] ?? $booking->branch_id,
                    $data['booking_date'] ?? $booking->booking_date,
                    $data['start_time'] ?? $booking->start_time,
                    $data['end_time'] ?? $booking->end_time,
                    $data['staff_id'] ?? $booking->staff_id,
                    $booking->id
                );

                if (!$isAvailable) {
                    throw new InvalidArgumentException('The selected time slot is not available');
                }
            }

            $booking = $this->bookingRepository->update($booking, $data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Booking Update Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to update booking: ' . $exc->getMessage());
        }
        DB::commit();
        return $booking;
    }

    public function delete(Booking $booking)
    {
        DB::beginTransaction();
        try {
            //$booking = $this->getBookingById($id);
            $result = $this->bookingRepository->delete($booking);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Booking Deletion Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to delete booking: ' . $exc->getMessage());
        }
        DB::commit();
        return $result;
    }

    public function confirmBooking(Booking $booking)
    {
        DB::beginTransaction();
        try {
            //$booking = $this->getBookingById($id);
            
            if (!$booking->canBeConfirmed()) {
                throw new InvalidArgumentException('Booking cannot be confirmed in its current status');
            }

            $booking = $this->bookingRepository->updateBookingStatus($booking, Booking::STATUS_CONFIRMED);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Booking Confirmation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to confirm booking: ' . $exc->getMessage());
        }
        DB::commit();
        return $booking;
    }

    public function cancelBooking(Booking $booking)
    {
        DB::beginTransaction();
        try {
            //$booking = $this->getBookingById($id);
            
            if (!$booking->canBeCancelled()) {
                throw new InvalidArgumentException('Booking cannot be cancelled in its current status');
            }

            $booking = $this->bookingRepository->updateBookingStatus($booking, Booking::STATUS_CANCELLED);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Booking Cancellation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to cancel booking: ' . $exc->getMessage());
        }
        DB::commit();
        return $booking;
    }

    public function completeBooking(Booking $booking)
    {
        DB::beginTransaction();
        try {
            //$booking = $this->getBookingById($id);
            
            if (!$booking->canBeCompleted()) {
                throw new InvalidArgumentException('Booking cannot be completed in its current status');
            }

            $booking = $this->bookingRepository->updateBookingStatus($booking, Booking::STATUS_COMPLETED);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Booking Completion Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to complete booking: ' . $exc->getMessage());
        }
        DB::commit();
        return $booking;
    }

    public function checkAvailability($branchId, $date, $startTime, $endTime, $staffId = null, $excludeBookingId = null)
    {
        // Check if staff has conflicting bookings
        if ($staffId) {
            $hasStaffConflict = $this->bookingRepository->checkStaffConflict(
                $staffId, 
                $date, 
                $startTime, 
                $endTime, 
                $excludeBookingId
            );
            
            if ($hasStaffConflict) {
                return false;
            }
        }

        return true;
    }

    public function getAvailableTimeslots($branchId, $date, $staffId = null)
    {
        return $this->bookingRepository->getAvailableTimeslots($branchId, $date, $staffId);
    }
}
<?php

namespace App\Repositories\Backend;

use Carbon\Carbon;

use App\Models\Booking;
use App\Repositories\BaseRepository;

class BookingRepository extends BaseRepository
{
   public function model()
    {
        return Booking::class;
    }
    public function getAllBookings()
    {
        return $this->model->with(['customer', 'staff', 'branch', 'timeslot', 'services', 'createdBy', 'updatedBy'])
            ->orderBy('booking_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get();
    }

    public function getBookingsByCustomer($customerId)
    {
        return $this->model->where('customer_id', $customerId)
            ->with(['customer', 'staff', 'branch', 'timeslot', 'services', 'createdBy', 'updatedBy'])
            ->orderBy('booking_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get();
    }

    public function getBookingsByStaff($staffId)
    {
        return $this->model->where('staff_id', $staffId)
            ->with(['customer', 'staff', 'branch', 'timeslot', 'services', 'createdBy', 'updatedBy'])
            ->orderBy('booking_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get();
    }

    public function getBookingsByBranch($branchId)
    {
        return $this->model->where('branch_id', $branchId)
            ->with(['customer', 'staff', 'branch', 'timeslot', 'services', 'createdBy', 'updatedBy'])
            ->orderBy('booking_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get();
    }

    public function getBookingsByDate($date)
    {
        return $this->model->where('booking_date', $date)
            ->with(['customer', 'staff', 'branch', 'timeslot', 'services', 'createdBy', 'updatedBy'])
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function getBookingsByDateRange($startDate, $endDate)
    {
        // Parse dates to ensure they're in the correct format
        try {
            $start = Carbon::parse($startDate)->startOfDay();
            $end = Carbon::parse($endDate)->endOfDay();
        } catch (\Exception $e) {
            // Default to current month if dates are invalid
            $start = Carbon::now()->startOfMonth();
            $end = Carbon::now()->endOfMonth();
        }

        return $this->model->whereBetween('booking_date', [$start->toDateString(), $end->toDateString()])
            ->with(['customer', 'staff', 'branch', 'timeslot', 'services', 'createdBy', 'updatedBy'])
            ->orderBy('booking_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function getBookingsByStatus($status)
    {
        return $this->model->where('status', $status)
            ->with(['customer', 'staff', 'branch', 'timeslot', 'services', 'createdBy', 'updatedBy'])
            ->orderBy('booking_date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get();
    }

    public function getBookingById($id)
    {
        return $this->model->with(['customer', 'staff', 'branch', 'timeslot', 'services', 'createdBy', 'updatedBy'])
            ->findOrFail($id);
    }

    public function create(array $data)
    {
        $booking = $this->model->create([
            'customer_id' => $data['customer_id'],
            'staff_id' => $data['staff_id'] ?? null,
            'branch_id' => $data['branch_id'],
            'timeslot_id' => $data['timeslot_id'],
            'status' => $data['status'] ?? Booking::STATUS_PENDING,
            'booking_date' => $data['booking_date'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'notes' => $data['notes'] ?? null,
            'created_by' => auth()->user()->id ?? null,
            'updated_by' => auth()->user()->id ?? null
        ]);

        // Attach services if provided
        if (isset($data['services']) && is_array($data['services'])) {
            $booking->services()->attach($data['services']);
        }

        // Log activity
        $activity_data['subject'] = $booking;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.CREATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) created booking for %s on %s.', 
            $model_type, 
            auth()->user()->name ?? 'System', 
            $booking->customer->name ?? 'Unknown Customer', 
            $booking->booking_date->format('Y-m-d')
        );
        saveActivityLog($activity_data);

        return $booking->load(['customer', 'staff', 'branch', 'timeslot', 'services']);
    }

    public function update(Booking $booking, array $data)
    {
        $booking->update([
            'customer_id' => $data['customer_id'] ?? $booking->customer_id,
            'staff_id' => $data['staff_id'] ?? $booking->staff_id,
            'branch_id' => $data['branch_id'] ?? $booking->branch_id,
            'timeslot_id' => $data['timeslot_id'] ?? $booking->timeslot_id,
            'status' => $data['status'] ?? $booking->status,
            'booking_date' => $data['booking_date'] ?? $booking->booking_date,
            'start_time' => $data['start_time'] ?? $booking->start_time,
            'end_time' => $data['end_time'] ?? $booking->end_time,
            'notes' => $data['notes'] ?? $booking->notes,
            'updated_by' => auth()->user()->id ?? null
        ]);

        // Update services if provided
        if (isset($data['services']) && is_array($data['services'])) {
            $booking->services()->sync($data['services']);
        }

        // Log activity
        $activity_data['subject'] = $booking;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) updated booking for %s on %s.', 
            $model_type, 
            auth()->user()->name ?? 'System', 
            $booking->customer->name ?? 'Unknown Customer', 
            $booking->booking_date->format('Y-m-d')
        );
        saveActivityLog($activity_data);

        return $booking->fresh(['customer', 'staff', 'branch', 'timeslot', 'services', 'createdBy', 'updatedBy']);
    }

    public function destroy(Booking $booking)
    {
        $deleted = $this->deleteById($booking->id);
        if ($deleted) {
            $booking->save();
        }

        // Log activity
        $activity_data['subject'] = $booking;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.DELETED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) deleted booking for %s on %s.', 
            $model_type, 
            auth()->user()->name ?? 'System', 
            $booking->customer->name ?? 'Unknown Customer', 
            $booking->booking_date->format('Y-m-d')
        );
        saveActivityLog($activity_data);

        return $booking;
    }

    public function checkTimeslotConflict($timeslotId, $bookingDate, $excludeBookingId = null)
    {
        $query = $this->model->where('timeslot_id', $timeslotId)
            ->where('booking_date', $bookingDate)
            ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED]);

        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }

        return $query->exists();
    }

    public function checkStaffConflict($staffId, $bookingDate, $startTime, $endTime, $excludeBookingId = null)
    {
        if (!$staffId) {
            return false;
        }

        $query = $this->model->where('staff_id', $staffId)
            ->where('booking_date', $bookingDate)
            ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED])
            ->where(function ($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function ($q2) use ($startTime, $endTime) {
                      $q2->where('start_time', '<=', $startTime)
                         ->where('end_time', '>=', $endTime);
                  });
            });

        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }

        return $query->exists();
    }

    public function getAvailableTimeslots($branchId, $date, $staffId = null)
    {
        $timeslots = \App\Models\Timeslot::where('branch_id', $branchId)
            ->where('date', $date)
            ->where('is_available', true);

        if ($staffId) {
            $timeslots->where('staff_id', $staffId);
        }

        $timeslots = $timeslots->get();

        // Filter out timeslots that have confirmed bookings
        return $timeslots->filter(function ($timeslot) use ($date) {
            return !$this->checkTimeslotConflict($timeslot->id, $date);
        });
    }

    public function updateBookingStatus(Booking $booking, $status)
    {
        $oldStatus = $booking->status;
        $booking->update([
            'status' => $status,
            'updated_by' => auth()->user()->id ?? null
        ]);

        // Log activity
        $activity_data['subject'] = $booking;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) changed booking status from %s to %s for %s.',
            $model_type,
            auth()->user()->name ?? 'System',
            $oldStatus,
            $status,
            $booking->customer->name ?? 'Unknown Customer'
        );
        saveActivityLog($activity_data);

        $freshBooking = $booking->fresh(['customer', 'staff', 'branch', 'timeslot', 'services']);

        event(new \App\Events\BookingStatusUpdated($freshBooking));

        return $freshBooking;
    }

    public function hasSchedule($staffId, $date)
    {
        return \App\Models\StaffSchedule::where('staff_id', $staffId)
            ->where('day_of_week', Carbon::parse($date)->dayOfWeek)
            ->where('is_available', true)
            ->exists();
    }
}
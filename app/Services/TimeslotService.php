<?php

namespace App\Services;

use Exception;
use Carbon\Carbon;
use App\Models\Timeslot;
use App\Models\StaffSchedule;
use InvalidArgumentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\Backend\TimeslotRepository;
use App\Services\Interfaces\TimeslotServiceInterface;

class TimeslotService implements TimeslotServiceInterface
{
    protected $timeslotRepository;

    public function __construct(TimeslotRepository $timeslotRepository)
    {
        $this->timeslotRepository = $timeslotRepository;
    }

    public function getAllTimeslots()
    {
        return $this->timeslotRepository->getAllTimeslots();
    }

    public function getTimeslotsByStaff($staffId)
    {
        return $this->timeslotRepository->getTimeslotsByStaff($staffId);
    }

    public function getTimeslotsByBranch($branchId)
    {
        return $this->timeslotRepository->getTimeslotsByBranch($branchId);
    }

    // public function getById($id)
    // {
    //     return $this->timeslotRepository->getTimeslotById($id);
    // }

    public function create(array $data)
    {
        DB::beginTransaction();
        try {
            if ($this->timeslotRepository->hasConflict($data['staff_id'], $data['date'], $data['start_time'], $data['end_time'])) {
                throw new InvalidArgumentException('Timeslot conflicts with an existing timeslot.');
            }
            $timeslot = $this->timeslotRepository->create($data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Timeslot Creation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException($exc->getMessage());
        }
        DB::commit();
        return $timeslot;
    }

    public function update(Timeslot $timeslot, array $data)
    {
        DB::beginTransaction();
        try {
            if ($this->timeslotRepository->hasConflict($data['staff_id'], $data['date'], $data['start_time'], $data['end_time'], $timeslot->id)) {
                throw new InvalidArgumentException('Timeslot conflicts with an existing timeslot.');
            }
            $timeslot = $this->timeslotRepository->update($timeslot, $data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Timeslot Update Error: ' . $exc->getMessage());
            throw new InvalidArgumentException($exc->getMessage());
        }
        DB::commit();
        return $timeslot;
    }

    public function delete(Timeslot $timeslot)
    {
        DB::beginTransaction();
        try {
            //$timeslot = $this->getTimeslotById($id);
            $result = $this->timeslotRepository->delete($timeslot);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Timeslot Deletion Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to delete timeslot');
        }
        DB::commit();
        return $result;
    }

    public function getAvailableTimeslots()
    {
        return $this->timeslotRepository->getAvailableTimeslots();
    }

    public function getTimeslotsByDate($date)
    {
        return $this->timeslotRepository->getTimeslotsByDate($date);
    }

    public function getTimeslotsByDateRange($startDate, $endDate)
    {
        return $this->timeslotRepository->getTimeslotsByDateRange($startDate, $endDate);
    }

    // public function bulkCreateTimeslots(array $data)
    // {
    //     DB::beginTransaction();
    //     try {
    //         $timeslots = [];
    //         foreach ($data['timeslots'] as $timeslotData) {
    //             $timeslots[] = $this->timeslotRepository->createTimeslot($timeslotData);
    //         }
    //     } catch (Exception $exc) {
    //         DB::rollBack();
    //         Log::error('Bulk Timeslot Creation Error: ' . $exc->getMessage());
    //         throw new InvalidArgumentException('Unable to create timeslots in bulk');
    //     }
    //     DB::commit();
    //     return $timeslots;
    // }
    public function bulkCreateTimeslots(array $data)
    {
        DB::beginTransaction();
        try {
            $timeslots = [];
            foreach ($data['timeslots'] as $timeslotData) {
                if ($this->timeslotRepository->hasConflict($timeslotData['staff_id'], $timeslotData['date'], $timeslotData['start_time'], $timeslotData['end_time'])) {
                    throw new InvalidArgumentException('Timeslot for ' . $timeslotData['date'] . ' at ' . $timeslotData['start_time'] . ' conflicts with an existing timeslot.');
                }
                // Validate against staff schedule and leaves
                $this->validateTimeslot($timeslotData);
                $timeslots[] = $this->timeslotRepository->create($timeslotData);
            }
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Bulk Timeslot Creation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to create timeslots in bulk: ' . $exc->getMessage());
        }
        DB::commit();
        return $timeslots;
    }

    protected function validateTimeslot(array $data)
    {
        $staffId = $data['staff_id'];
        $date = Carbon::parse($data['date']);
        $startTime = Carbon::parse($data['start_time']);
        $endTime = Carbon::parse($data['end_time']);
        $dayOfWeek = $date->dayOfWeekIso;

        // Check leave
        $isOnLeave = StaffLeave::where('staff_id', $staffId)
            ->where('status', 'approved')
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->exists();

        if ($isOnLeave) {
            throw new InvalidArgumentException('Staff is on leave on selected date.');
        }

        // Check schedule
        $schedule = StaffSchedule::where('staff_id', $staffId)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->first();

        if (!$schedule) {
            throw new InvalidArgumentException('No schedule available for staff on this day.');
        }

        $scheduleStart = Carbon::parse($schedule->start_time);
        $scheduleEnd = Carbon::parse($schedule->end_time);

        if ($startTime->lessThan($scheduleStart) || $endTime->greaterThan($scheduleEnd)) {
            throw new InvalidArgumentException('Timeslot is outside staff schedule.');
        }
    }
}
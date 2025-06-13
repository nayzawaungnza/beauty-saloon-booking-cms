<?php

namespace App\Services;

use Exception;
use App\Models\StaffSchedule;
use InvalidArgumentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\Backend\StaffScheduleRepository;
use App\Services\Interfaces\StaffScheduleServiceInterface;

class StaffScheduleService implements StaffScheduleServiceInterface
{
    protected $staffScheduleRepository;

    public function __construct(StaffScheduleRepository $staffScheduleRepository)
    {
        $this->staffScheduleRepository = $staffScheduleRepository;
    }

    public function getAllSchedules()
    {
        return $this->staffScheduleRepository->getAllSchedules();
    }

    public function getSchedulesByStaff($staffId)
    {
        return $this->staffScheduleRepository->getSchedulesByStaff($staffId);
    }

    // public function getById($id)
    // {
    //     return $this->staffScheduleRepository->getScheduleById($id);
    // }

    public function create(array $data)
    {
        DB::beginTransaction();
        try {
            if ($this->staffScheduleRepository->hasConflict($data['staff_id'], $data['day_of_week'], $data['start_time'], $data['end_time'])) {
                throw new InvalidArgumentException('Schedule conflicts with an existing schedule.');
            }
            $schedule = $this->staffScheduleRepository->create($data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Schedule Creation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException($exc->getMessage());
        }
        DB::commit();
        return $schedule;
    }

    public function update(StaffSchedule $staffSchedule, array $data)
    {
        DB::beginTransaction();
        try {
            if ($this->staffScheduleRepository->hasConflict($data['staff_id'], $data['day_of_week'], $data['start_time'], $data['end_time'], $staffSchedule->id)) {
                throw new InvalidArgumentException('Schedule conflicts with an existing schedule.');
            }
            $staffSchedule = $this->staffScheduleRepository->update($staffSchedule, $data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Schedule Update Error: ' . $exc->getMessage());
            throw new InvalidArgumentException($exc->getMessage());
        }
        DB::commit();
        return $staffSchedule;
    }

    public function delete(StaffSchedule $staffSchedule)
    {
        DB::beginTransaction();
        try {
            //$schedule = $this->getScheduleById($id);
            $result = $this->staffScheduleRepository->destroy($staffSchedule);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Schedule Deletion Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to delete staff schedule');
        }
        DB::commit();
        return $result;
    }

    public function getAvailableSchedules()
    {
        return $this->staffScheduleRepository->getAvailableSchedules();
    }

    public function getSchedulesByDay($dayOfWeek)
    {
        return $this->staffScheduleRepository->getSchedulesByDay($dayOfWeek);
    }

    public function bulkCreateSchedules(array $data)
    {
        DB::beginTransaction();
        try {
            $schedules = [];
            foreach ($data['schedules'] as $scheduleData) {
                if ($this->staffScheduleRepository->hasConflict($scheduleData['staff_id'], $scheduleData['day_of_week'], $scheduleData['start_time'], $scheduleData['end_time'])) {
                    throw new InvalidArgumentException('Schedule for ' . $scheduleData['day_of_week'] . ' conflicts with an existing schedule.');
                }
                $schedules[] = $this->staffScheduleRepository->create($scheduleData);
            }
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Bulk Staff Schedule Creation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException($exc->getMessage());
        }
        DB::commit();
        return $schedules;
    }
}
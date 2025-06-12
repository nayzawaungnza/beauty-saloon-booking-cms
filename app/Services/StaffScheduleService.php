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
            $schedule = $this->staffScheduleRepository->create($data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Schedule Creation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to create staff schedule');
        }
        DB::commit();
        return $schedule;
    }

    public function update(StaffSchedule $staffSchedule, array $data)
    {
        DB::beginTransaction();
        try {
            //$schedule = $this->getScheduleById($id);
            $staffSchedule = $this->staffScheduleRepository->updateSchedule($staffSchedule, $data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Schedule Update Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to update staff schedule');
        }
        DB::commit();
        return $staffSchedule;
    }

    public function delete(StaffSchedule $staffSchedule)
    {
        DB::beginTransaction();
        try {
            //$schedule = $this->getScheduleById($id);
            $result = $this->staffScheduleRepository->delete($staffSchedule);
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
                $schedules[] = $this->staffScheduleRepository->createSchedule($scheduleData);
            }
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Bulk Staff Schedule Creation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to create staff schedules in bulk');
        }
        DB::commit();
        return $schedules;
    }
}
<?php

namespace App\Services\Interfaces;

use App\Models\StaffSchedule;

interface StaffScheduleServiceInterface
{
    public function getAllSchedules();
    public function getSchedulesByStaff($staffId);
    //public function getById($id);
    public function create(array $data);
    public function update(StaffSchedule $staffSchedule, array $data);
    public function delete(StaffSchedule $staffSchedule);
    public function getAvailableSchedules();
    public function getSchedulesByDay($dayOfWeek);
    public function bulkCreateSchedules(array $data);
}
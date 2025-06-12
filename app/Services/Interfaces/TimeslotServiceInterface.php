<?php

namespace App\Services\Interfaces;

use App\Models\Timeslot;

interface TimeslotServiceInterface
{
    public function getAllTimeslots();
    public function getTimeslotsByStaff($staffId);
    public function getTimeslotsByBranch($branchId);
    //public function getTimeslotById($id);
    public function create(array $data);
    public function update(Timeslot $timeslot, array $data);
    public function delete(Timeslot $timeslot);
    public function getAvailableTimeslots();
    public function getTimeslotsByDate($date);
    public function getTimeslotsByDateRange($startDate, $endDate);
    public function bulkCreateTimeslots(array $data);
}
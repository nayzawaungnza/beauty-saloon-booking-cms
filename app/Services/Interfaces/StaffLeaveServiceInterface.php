<?php

namespace App\Services\Interfaces;

use App\Models\StaffLeave;

interface StaffLeaveServiceInterface
{
    public function getAllLeaves();
    public function getLeavesByStaff($staffId);
    public function create(array $data);
    public function update(StaffLeave $staffLeave, array $data);
    public function delete(StaffLeave $staffLeave);
    public function approve(StaffLeave $staffLeave);
    public function reject(StaffLeave $staffLeave);
}
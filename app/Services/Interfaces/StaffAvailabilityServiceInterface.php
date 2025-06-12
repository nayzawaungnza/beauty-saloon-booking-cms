<?php

namespace App\Services\Interfaces;

use App\Models\Staff;
use App\Models\StaffAvailability;

interface StaffAvailabilityServiceInterface
{
    public function create(array $data): StaffAvailability;
    public function update(StaffAvailability $staffAvailability, array $data): StaffAvailability;
    public function delete(StaffAvailability $staffAvailability);

    public function isStaffAvailable(StaffAvailability $staffAvailability);

    public function getAvailabilityForStaff(Staff $staff);

    public function getAvailabilityForDate(Staff $staff, $date);

    public function getAvailabilityForDateRange(Staff $staff, $startDate, $endDate);

    public function createBatch(array $data);

    public function isStaffAvailableAt(Staff $staff, $date, $startTime, $endTime);

    public function findAvailableStaff($date, $startTime, $endTime, array $serviceIds = null);

    public function generateDefaultAvailability(Staff $staff);
    
}
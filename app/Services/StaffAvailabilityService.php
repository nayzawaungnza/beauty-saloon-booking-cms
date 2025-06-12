<?php

namespace App\Services;

use Exception;
use App\Models\Staff;
use InvalidArgumentException;
use App\Models\StaffAvailability;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\Backend\StaffAvailabilityRepository;
use App\Services\Interfaces\StaffAvailabilityServiceInterface;

class StaffAvailabilityService implements StaffAvailabilityServiceInterface
{
    protected $staffAvailabilityRepository;
    /**
     * Create a new class instance.
     */
    public function __construct(StaffAvailabilityRepository $staffAvailabilityRepository)
    {
        $this->staffAvailabilityRepository = $staffAvailabilityRepository;
    }

    public function create(array $data): StaffAvailability
    {
         DB::beginTransaction();
        try {
            $staffAvailability = $this->staffAvailabilityRepository->create($data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Availability Creation Error:'.$exc->getMessage());
            throw new InvalidArgumentException('Unable to create staff availability');
        }
        DB::commit();
        return $staffAvailability;
        
    }
    public function update(StaffAvailability $staffAvailability, array $data): StaffAvailability
    {
        DB::beginTransaction();
        try {
            $staffAvailability = $this->staffAvailabilityRepository->update($staffAvailability, $data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Availability Update Error:'.$exc->getMessage());
            throw new InvalidArgumentException('Unable to update staff availability');
        }
        DB::commit();
        return $staffAvailability;
    }
    public function delete(StaffAvailability $staffAvailability)
    {
        DB::beginTransaction();
        try {
            $staffAvailability = $this->staffAvailabilityRepository->destroy($staffAvailability);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Availability Deletion Error:'.$exc->getMessage());
            throw new InvalidArgumentException('Unable to delete staff availability');
        }
        DB::commit();
        return $staffAvailability;
    }

    public function isStaffAvailable(StaffAvailability $staffAvailability)
    {
        return $this->staffAvailabilityRepository->isStaffAvailable($staffAvailability);
    }

    public function getAvailabilityForStaff(Staff $staff)
    {
        return $this->staffAvailabilityRepository->getAvailabilityForStaff($staff);
    }
    public function getStaffAvailabilityEloquent()
    {
        return $this->staffAvailabilityRepository->getStaffAvailabilityEloquent();
    }

    /**
     * Get staff availability for a specific date.
     */
    public function getAvailabilityForDate(Staff $staff, $date)
    {
        return $this->staffAvailabilityRepository->getAvailabilityForDate($staff, $date);
    }

    /**
     * Get staff availability for a date range.
     */
    public function getAvailabilityForDateRange(Staff $staff, $startDate, $endDate)
    {
        
    }
    /**
     * Create batch availabilities for multiple days.
     */
    public function createBatch(array $data)
    {
        DB::beginTransaction();
        try {
            $staffAvailability = $this->staffAvailabilityRepository->createBatch($data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Availability Creation Error:'.$exc->getMessage());
            throw new InvalidArgumentException('Unable to create staff availability');
        }
        DB::commit();
        return $staffAvailability;
    }
    /**
     * Check if a staff member is available at a specific date and time.
     */
    public function isStaffAvailableAt(Staff $staff, $date, $startTime, $endTime): bool
    {
        return $this->staffAvailabilityRepository->isStaffAvailableAt($staff, $date, $startTime, $endTime);
    }
    /**
     * Find available staff members for a specific date and time.
     */
    public function findAvailableStaff($date, $startTime, $endTime, array $serviceIds = null)
    {
        return $this->staffAvailabilityRepository->findAvailableStaff($date, $startTime, $endTime, $serviceIds);
    }
    /**
     * Generate default availability for a staff member.
     */
    public function generateDefaultAvailability(Staff $staff)
    {
        DB::beginTransaction();
        try {
            $staffAvailability = $this->staffAvailabilityRepository->generateDefaultAvailability($staff);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Availability Creation Error:'.$exc->getMessage());
            throw new InvalidArgumentException('Unable to create staff availability');
        }
        DB::commit();
        return $staffAvailability;
    }
}
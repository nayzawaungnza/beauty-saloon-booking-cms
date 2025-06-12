<?php

namespace App\Repositories\Backend;

use Carbon\Carbon;
use App\Models\Staff;
use App\Models\StaffAvailability;
use App\Repositories\BaseRepository;
use Illuminate\Validation\ValidationException;

class StaffAvailabilityRepository extends BaseRepository
{
    public function model()
    {
        return StaffAvailability::class;
    }
    
    public function create(array $data): StaffAvailability
    {
        $data['created_by'] = auth()->user()->id;
            $data['updated_by'] = auth()->user()->id;
            
            // Check for conflicts before creating
            if ($this->hasTimeConflict($data)) {
                throw ValidationException::withMessages([
                    'time_conflict' => ['This availability conflicts with an existing schedule.']
                ]);
            
            }
            
            // Create the availability
            $staffAvailability = StaffAvailability::create($data);
            
            $staffAvailability->load([
                'staff:id,name,email',
                'createdBy:id,name,email',
                'updatedBy:id,name,email'
            ]);
            
            $staffAvailability->save();
            
            return $staffAvailability;
    }
    public function update(StaffAvailability $staffAvailability, array $data): StaffAvailability
    {
        $data['updated_by'] = auth()->user()->id;
            
            // Check for conflicts before updating
            if ($this->hasTimeConflict($data, $staffAvailability->id)) {
                throw new \Exception('This availability conflicts with an existing schedule.');
            }
            
            $staffAvailability->update($data);
            
            $staffAvailability->save();

            $staffAvailability->load([
                'staff:id,name,email',
                'createdBy:id,name,email',
                'updatedBy:id,name,email'
            ]);
            
            return $staffAvailability;
    }
    public function destroy(StaffAvailability $staffAvailability)
    {
        $staffAvailability->delete();
    }

    public function isStaffAvailable(StaffAvailability $staffAvailability)
    {

    }

    

    public function getStaffAvailabilityEloquent()
    {
        return StaffAvailability::with([
            'staff:id,name,email',
            'createdBy:id,name,email',
            'updatedBy:id,name,email'
        ])->latest()->get();
    }

    public function getAvailabilityForStaff(Staff $staff)
    {
        
    }

    public function getAvailabilityForDate(Staff $staff, $date)
    {
        $dateObj = Carbon::parse($date);
        
        return StaffAvailability::where('staff_id', $staff->id)
            ->forDate($dateObj)
            ->get();
    }

    public function getAvailabilityForDateRange(Staff $staff, $startDate, $endDate)
    {
        $startDateObj = Carbon::parse($startDate);
        $endDateObj = Carbon::parse($endDate);
        $result = [];
        
        // Loop through each day in the range
        for ($date = $startDateObj->copy(); $date->lte($endDateObj); $date->addDay()) {
            $dayOfWeek = $date->dayOfWeek;
            
            // Get availabilities for this day of week
            $availabilities = StaffAvailability::where('staff_id', $staff->id)
                ->forDate($date)
                ->get();
            
            if ($availabilities->isNotEmpty()) {
                $result[$date->format('Y-m-d')] = $availabilities;
            }
        }
        
        return $result;
    }

    public function createBatch(array $data)
    {
        $createdAvailabilities = [];
            $userId = auth()->user()->id;
            
            // Extract common data
            $commonData = [
                'staff_id' => $data['staff_id'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'is_available' => $data['is_available'] ?? true,
                'effective_date' => $data['effective_date'] ?? null,
                'expiry_date' => $data['expiry_date'] ?? null,
                'is_recurring' => $data['is_recurring'] ?? false,
                'recurrence_pattern' => $data['recurrence_pattern'] ?? null,
                'recurrence_end_date' => $data['recurrence_end_date'] ?? null,
                'priority' => $data['priority'] ?? 0,
                'notes' => $data['notes'] ?? null,
                'created_by' => $userId,
                'updated_by' => $userId,
            ];
            
            // Create an availability for each selected day
            foreach ($data['days_of_week'] as $dayOfWeek) {
                $availabilityData = array_merge($commonData, ['day_of_week' => $dayOfWeek]);
                
                // Check for conflicts
                if ($this->hasTimeConflict($availabilityData)) {
                    throw new \Exception("Conflict detected for day {$dayOfWeek}");
                }
                
                $availability = StaffAvailability::create($availabilityData);
                $createdAvailabilities[] = $availability;
            }
            
            return $createdAvailabilities;
    }

    public function isStaffAvailableAt(Staff $staff, $date, $startTime, $endTime)
    {
        $dateObj = Carbon::parse($date);
        $dayOfWeek = $dateObj->dayOfWeek;
        
        // Get all availabilities for this day
        $availabilities = StaffAvailability::where('staff_id', $staff->id)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->forDate($dateObj)
            ->get();
        
        if ($availabilities->isEmpty()) {
            return false;
        }
        
        // Convert times to comparable format
        $requestStart = Carbon::parse($startTime)->format('H:i:s');
        $requestEnd = Carbon::parse($endTime)->format('H:i:s');
        
        // Check if any availability covers the requested time
        foreach ($availabilities as $availability) {
            $availStart = Carbon::parse($availability->start_time)->format('H:i:s');
            $availEnd = Carbon::parse($availability->end_time)->format('H:i:s');
            
            if ($availStart <= $requestStart && $availEnd >= $requestEnd) {
                return true;
            }
        }
        
        return false;
    }

    public function findAvailableStaff($date, $startTime, $endTime, array $serviceIds = null)
    {
        $dateObj = Carbon::parse($date);
        $dayOfWeek = $dateObj->dayOfWeek;
        
        // Start with all active staff
        $query = Staff::where('is_active', true);
        
        // Filter by services if provided
        if (!empty($serviceIds)) {
            $query->whereHas('services', function ($q) use ($serviceIds) {
                $q->whereIn('services.id', $serviceIds);
            });
        }
        
        // Get all potential staff
        $staffMembers = $query->get();
        $availableStaff = [];
        
        foreach ($staffMembers as $staff) {
            if ($this->isStaffAvailableAt($staff, $date, $startTime, $endTime)) {
                $availableStaff[] = $staff;
            }
        }
        
        return $availableStaff;
    }

    public function generateDefaultAvailability(Staff $staff)
    {
        $userId = auth()->user()->id;
            $defaultSchedules = [
                // Monday to Friday, 9 AM to 5 PM
                ['day_of_week' => 1, 'start_time' => '09:00:00', 'end_time' => '17:00:00'],
                ['day_of_week' => 2, 'start_time' => '09:00:00', 'end_time' => '17:00:00'],
                ['day_of_week' => 3, 'start_time' => '09:00:00', 'end_time' => '17:00:00'],
                ['day_of_week' => 4, 'start_time' => '09:00:00', 'end_time' => '17:00:00'],
                ['day_of_week' => 5, 'start_time' => '09:00:00', 'end_time' => '17:00:00'],
            ];
            
            $createdAvailabilities = [];
            
            foreach ($defaultSchedules as $schedule) {
                $availabilityData = array_merge($schedule, [
                    'staff_id' => $staff->id,
                    'is_available' => true,
                    'created_by' => $userId,
                    'updated_by' => $userId,
                ]);
                
                $availability = StaffAvailability::create($availabilityData);
                $createdAvailabilities[] = $availability;
            }
            
            return $createdAvailabilities;
    }
/**
     * Check if there's a time conflict with existing availabilities.
     */
    protected function hasTimeConflict(array $data, $excludeId = null): bool
    {
        $query = StaffAvailability::where('staff_id', $data['staff_id'])
            ->where('day_of_week', $data['day_of_week'])
            ->where('is_available', true);
            
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        // Check for overlapping time ranges
        $query->where(function ($q) use ($data) {
            $q->where(function ($subQ) use ($data) {
                // New start time falls within existing time range
                $subQ->where('start_time', '<=', $data['start_time'])
                     ->where('end_time', '>', $data['start_time']);
            })->orWhere(function ($subQ) use ($data) {
                // New end time falls within existing time range
                $subQ->where('start_time', '<', $data['end_time'])
                     ->where('end_time', '>=', $data['end_time']);
            })->orWhere(function ($subQ) use ($data) {
                // New time range completely contains existing time range
                $subQ->where('start_time', '>=', $data['start_time'])
                     ->where('end_time', '<=', $data['end_time']);
            });
        });
        
        // Check effective/expiry date overlaps if applicable
        if (!empty($data['effective_date']) || !empty($data['expiry_date'])) {
            $query->where(function ($q) use ($data) {
                // If we have an effective date
                if (!empty($data['effective_date'])) {
                    $q->where(function ($subQ) use ($data) {
                        $subQ->whereNull('expiry_date')
                             ->orWhere('expiry_date', '>=', $data['effective_date']);
                    });
                }
                
                // If we have an expiry date
                if (!empty($data['expiry_date'])) {
                    $q->where(function ($subQ) use ($data) {
                        $subQ->whereNull('effective_date')
                             ->orWhere('effective_date', '<=', $data['expiry_date']);
                    });
                }
            });
        }
        
        return $query->exists();
    }
    
}
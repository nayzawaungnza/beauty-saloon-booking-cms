<?php

namespace App\Services;

use Exception;
use App\Models\Staff;
use InvalidArgumentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\Backend\StaffRepository;
use App\Services\Interfaces\StaffServiceInterface;

class StaffService implements StaffServiceInterface
{
    protected $staffRepository;

    public function __construct(StaffRepository $staffRepository)
    {
        $this->staffRepository = $staffRepository;
    }

    public function getAllStaff()
    {
        return $this->staffRepository->getAllStaff();
    }

    public function getActiveStaff()
    {
        return $this->staffRepository->getActiveStaff();
    }

    public function getStaffById($id)
    {
        return $this->staffRepository->getStaffById($id);
    }

    public function getStaffBySlug($slug)
    {
        return $this->staffRepository->getStaffBySlug($slug);
    }

    public function create(array $data)
    {
        DB::beginTransaction();
        try {
            $staff = $this->staffRepository->create($data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Creation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to create staff member');
        }
        DB::commit();
        return $staff;
    }

    public function update(Staff $staff, array $data)
    {
        DB::beginTransaction();
        try {
            $staff = $this->staffRepository->update($staff, $data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Update Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to update staff member');
        }
        DB::commit();
        return $staff;
    }

    public function delete(Staff $staff)
    {
        DB::beginTransaction();
        try {
            $result = $this->staffRepository->deleteStaff($staff);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Deletion Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to delete staff member');
        }
        DB::commit();
        return $result;
    }

    public function changeStatus(Staff $staff)
    {
        DB::beginTransaction();
        try {
            $staff = $this->staffRepository->changeStatus($staff);
            
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Status Change Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to change staff status');
        }
        DB::commit();
        return $staff;
    }

    public function restoreStaff($id)
    {
        DB::beginTransaction();
        try {
            $staff = Staff::withTrashed()->findOrFail($id);
            $staff->restore();
            $staff->update(['updated_by' => auth()->user()->id]);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Restore Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to restore staff member');
        }
        DB::commit();
        return $staff;
    }

    public function searchStaff($query)
    {
        return $this->staffRepository->searchStaff($query);
    }

    public function getStaffByBranch($branchId)
    {
        return $this->staffRepository->getStaffByBranch($branchId);
    }

    public function getStaffWithServices()
    {
        return $this->staffRepository->getStaffWithServices();
    }
}
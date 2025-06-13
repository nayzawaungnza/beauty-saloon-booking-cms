<?php

namespace App\Services;

use Exception;
use App\Models\StaffLeave;
use InvalidArgumentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\Backend\StaffLeaveRepository;
use App\Services\Interfaces\StaffLeaveServiceInterface;

class StaffLeaveService implements StaffLeaveServiceInterface
{
    protected $staffLeaveRepository;

    public function __construct(StaffLeaveRepository $staffLeaveRepository)
    {
        $this->staffLeaveRepository = $staffLeaveRepository;
    }

    public function getAllLeaves()
    {
        return $this->staffLeaveRepository->getAllLeaves();
    }

    public function getLeavesByStaff($staffId)
    {
        return $this->staffLeaveRepository->getLeavesByStaff($staffId);
    }

    public function create(array $data)
    {
        DB::beginTransaction();
        try {
            if ($this->staffLeaveRepository->hasConflict($data['staff_id'], $data['start_date'], $data['end_date'])) {
                throw new InvalidArgumentException('Leave request conflicts with an existing leave request.');
            }
            $leave = $this->staffLeaveRepository->create($data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Leave Creation Error: ' . $exc->getMessage());
            throw new InvalidArgumentException($exc->getMessage());
        }
        DB::commit();
        return $leave;
    }

    public function update(StaffLeave $staffLeave, array $data)
    {
        DB::beginTransaction();
        try {
            if ($this->staffLeaveRepository->hasConflict($data['staff_id'], $data['start_date'], $data['end_date'], $staffLeave->id)) {
                throw new InvalidArgumentException('Leave request conflicts with an existing leave request.');
            }
            $staffLeave = $this->staffLeaveRepository->update($staffLeave, $data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Leave Update Error: ' . $exc->getMessage());
            throw new InvalidArgumentException($exc->getMessage());
        }
        DB::commit();
        return $staffLeave;
    }

    public function delete(StaffLeave $staffLeave)
    {
        DB::beginTransaction();
        try {
            $result = $this->staffLeaveRepository->destroy($staffLeave);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Leave Deletion Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to delete staff leave');
        }
        DB::commit();
        return $result;
    }

    public function approve(StaffLeave $staffLeave)
    {
        DB::beginTransaction();
        try {
            $staffLeave = $this->staffLeaveRepository->update($staffLeave, [
                'status' => 'approved',
                'approved_by' => auth()->user()->id,
            ]);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Leave Approval Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to approve staff leave');
        }
        DB::commit();
        return $staffLeave;
    }

    public function reject(StaffLeave $staffLeave)
    {
        DB::beginTransaction();
        try {
            $staffLeave = $this->staffLeaveRepository->update($staffLeave, [
                'status' => 'rejected',
                'approved_by' => auth()->user()->id,
            ]);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Staff Leave Rejection Error: ' . $exc->getMessage());
            throw new InvalidArgumentException('Unable to reject staff leave');
        }
        DB::commit();
        return $staffLeave;
    }
}
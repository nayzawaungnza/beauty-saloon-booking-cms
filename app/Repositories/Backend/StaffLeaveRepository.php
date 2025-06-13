<?php

namespace App\Repositories\Backend;

use App\Models\StaffLeave;
use App\Repositories\BaseRepository;

class StaffLeaveRepository extends BaseRepository
{
    public function model()
    {
        return StaffLeave::class;
    }

    public function getAllLeaves()
    {
        return $this->model->with(['staff', 'approvedBy', 'createdBy', 'updatedBy'])
            ->orderBy('start_date', 'desc')
            ->get();
    }

    public function getLeavesByStaff($staffId)
    {
        return $this->model->where('staff_id', $staffId)
            ->with(['staff', 'approvedBy', 'createdBy', 'updatedBy'])
            ->orderBy('start_date', 'desc')
            ->get();
    }

    public function create(array $data)
    {
        $staffLeave = $this->model->create([
            'staff_id' => $data['staff_id'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'reason' => $data['reason'],
            'status' => $data['status'] ?? 'pending',
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id,
        ]);

        // Log activity
        $activity_data['subject'] = $staffLeave;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.CREATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf(
            '%s(%s) created a leave request for %s from %s to %s.',
            $model_type,
            auth()->user()->name,
            $staffLeave->staff->name ?? 'Unknown Staff',
            $staffLeave->start_date->format('Y-m-d'),
            $staffLeave->end_date->format('Y-m-d')
        );
        saveActivityLog($activity_data);

        return $staffLeave->load(['staff']);
    }

    public function update(StaffLeave $staffLeave, array $data)
    {
        $staffLeave->update([
            'staff_id' => $data['staff_id'] ?? $staffLeave->staff_id,
            'start_date' => $data['start_date'] ?? $staffLeave->start_date,
            'end_date' => $data['end_date'] ?? $staffLeave->end_date,
            'reason' => $data['reason'] ?? $staffLeave->reason,
            'status' => $data['status'] ?? $staffLeave->status,
            'approved_by' => $data['approved_by'] ?? $staffLeave->approved_by,
            'updated_by' => auth()->user()->id,
        ]);

        // Log activity
        $activity_data['subject'] = $staffLeave;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf(
            '%s(%s) updated a leave request for %s.',
            $model_type,
            auth()->user()->name,
            $staffLeave->staff->name ?? 'Unknown Staff'
        );
        saveActivityLog($activity_data);

        return $staffLeave->fresh(['staff', 'approvedBy', 'createdBy', 'updatedBy']);
    }

    public function destroy(StaffLeave $staffLeave)
    {
        $this->deleteById($staffLeave->id);

        // Log activity
        $activity_data['subject'] = $staffLeave;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.DELETED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf(
            '%s(%s) deleted a leave request for %s.',
            $model_type,
            auth()->user()->name,
            $staffLeave->staff->name ?? 'Unknown Staff'
        );
        saveActivityLog($activity_data);

        return $staffLeave;
    }
    public function hasConflict($staffId, $startDate, $endDate, $excludeId = null)
    {
        $query = $this->model
            ->where('staff_id', $staffId)
            ->where(function ($q) use ($startDate, $endDate) {
                $q->where(function ($q2) use ($startDate, $endDate) {
                    $q2->where('start_date', '<=', $endDate)
                        ->where('end_date', '>=', $startDate);
                });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
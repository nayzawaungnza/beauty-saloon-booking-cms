<?php

namespace App\Repositories\Backend;

use App\Models\StaffSchedule;

use App\Repositories\BaseRepository;

class StaffScheduleRepository extends BaseRepository
{
    public function model()
    {
        return StaffSchedule::class;
    }
   public function getAllSchedules()
    {
        return $this->model->with(['staff', 'createdBy', 'updatedBy'])
            ->orderBy('day_of_week', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function getSchedulesByStaff($staffId)
    {
        return $this->model->where('staff_id', $staffId)
            ->with(['staff', 'createdBy', 'updatedBy'])
            ->orderBy('day_of_week', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();
    }

    // public function getById($id)
    // {
    //     return $this->model->with(['staff', 'createdBy', 'updatedBy'])
    //         ->findOrFail($id);
    // }

    public function create(array $data)
    {
        $staffSchedule = $this->model->create([
            'staff_id' => $data['staff_id'],
            'day_of_week' => $data['day_of_week'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'is_available' => $data['is_available'] ?? true,
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id
        ]);

        // Log activity
        $activity_data['subject'] = $staffSchedule;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.CREATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) created staff schedule for %s on %s.', 
            $model_type, 
            auth()->user()->name, 
            $staffSchedule->staff->name ?? 'Unknown Staff', 
            $staffSchedule->day_name
        );
        saveActivityLog($activity_data);

        return $staffSchedule->load(['staff']);
    }

    public function update(StaffSchedule $staffSchedule, array $data)
    {
        $staffSchedule->update([
            'staff_id' => $data['staff_id'] ?? $staffSchedule->staff_id,
            'day_of_week' => $data['day_of_week'] ?? $staffSchedule->day_of_week,
            'start_time' => $data['start_time'] ?? $staffSchedule->start_time,
            'end_time' => $data['end_time'] ?? $staffSchedule->end_time,
            'is_available' => $data['is_available'] ?? $staffSchedule->is_available,
            'updated_by' => auth()->user()->id
        ]);

        // Log activity
        $activity_data['subject'] = $staffSchedule;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) updated staff schedule for %s on %s.', 
            $model_type, 
            auth()->user()->name, 
            $staffSchedule->staff->name ?? 'Unknown Staff', 
            $staffSchedule->day_name
        );
        saveActivityLog($activity_data);

        return $staffSchedule->fresh(['staff', 'createdBy', 'updatedBy']);
    }

    public function delete(StaffSchedule $staffSchedule)
    {
        return $staffSchedule->delete();
    }

    public function destroy(StaffSchedule $staffSchedule)
    {
        $this->deleteById($staffSchedule->id);

        // Log activity
        $activity_data['subject'] = $staffSchedule;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.DELETED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) deleted staff schedule for %s on %s.', 
            $model_type, 
            auth()->user()->name, 
            $staffSchedule->staff->name ?? 'Unknown Staff', 
            $staffSchedule->day_name
        );
        saveActivityLog($activity_data);

        return $staffSchedule;
    }

    public function getAvailableSchedules()
    {
        return $this->model->where('is_available', true)
            ->with(['staff'])
            ->orderBy('day_of_week', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function getSchedulesByDay($dayOfWeek)
    {
        return $this->model->where('day_of_week', $dayOfWeek)
            ->with(['staff'])
            ->orderBy('start_time', 'asc')
            ->get();
    }
    public function hasConflict($staffId, $dayOfWeek, $startTime, $endTime, $excludeId = null)
    {
        $query = $this->model
            ->where('staff_id', $staffId)
            ->where('day_of_week', $dayOfWeek)
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where(function ($q2) use ($startTime, $endTime) {
                    $q2->where('start_time', '<', $endTime)
                        ->where('end_time', '>', $startTime);
                });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
<?php

namespace App\Repositories\Backend;

use App\Models\Timeslot;

use App\Repositories\BaseRepository;

class TimeslotRepository extends BaseRepository
{
   public function model()
    {
        return Timeslot::class;
    }
    public function getAllTimeslots()
    {
        return $this->model->with(['staff', 'branch', 'createdBy', 'updatedBy'])
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function getTimeslotsByStaff($staffId)
    {
        return $this->model->where('staff_id', $staffId)
            ->with(['staff', 'branch', 'createdBy', 'updatedBy'])
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function getTimeslotsByBranch($branchId)
    {
        return $this->model->where('branch_id', $branchId)
            ->with(['staff', 'branch', 'createdBy', 'updatedBy'])
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function getTimeslotById($id)
    {
        return $this->model->with(['staff', 'branch', 'createdBy', 'updatedBy'])
            ->findOrFail($id);
    }

    public function create(array $data)
    {
        $timeslot = $this->model->create([
            'staff_id' => $data['staff_id'],
            'branch_id' => $data['branch_id'],
            'date' => $data['date'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'is_available' => $data['is_available'] ?? true,
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id
        ]);

        // Log activity
        $activity_data['subject'] = $timeslot;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.CREATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) created timeslot for %s on %s.', 
            $model_type, 
            auth()->user()->name, 
            $timeslot->staff->name ?? 'Unknown Staff', 
            $timeslot->date->format('Y-m-d')
        );
        saveActivityLog($activity_data);

        return $timeslot->load(['staff', 'branch']);
    }

    public function update(Timeslot $timeslot, array $data)
    {
        $timeslot->update([
            'staff_id' => $data['staff_id'] ?? $timeslot->staff_id,
            'branch_id' => $data['branch_id'] ?? $timeslot->branch_id,
            'date' => $data['date'] ?? $timeslot->date,
            'start_time' => $data['start_time'] ?? $timeslot->start_time,
            'end_time' => $data['end_time'] ?? $timeslot->end_time,
            'is_available' => $data['is_available'] ?? $timeslot->is_available,
            'updated_by' => auth()->user()->id
        ]);

        // Log activity
        $activity_data['subject'] = $timeslot;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) updated timeslot for %s on %s.', 
            $model_type, 
            auth()->user()->name, 
            $timeslot->staff->name ?? 'Unknown Staff', 
            $timeslot->date->format('Y-m-d')
        );
        saveActivityLog($activity_data);

        return $timeslot->fresh(['staff', 'branch', 'createdBy', 'updatedBy']);
    }

    public function destroy(Timeslot $timeslot)
    {
        $deleted = $this->deleteById($timeslot->id);
        if ($deleted) {
            $timeslot->save();
        }

        // Log activity
        $activity_data['subject'] = $timeslot;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.DELETED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) deleted timeslot for %s on %s.', 
            $model_type, 
            auth()->user()->name, 
            $timeslot->staff->name ?? 'Unknown Staff', 
            $timeslot->date->format('Y-m-d')
        );
        saveActivityLog($activity_data);

        return $timeslot;
    }

    public function getAvailableTimeslots()
    {
        return $this->model->where('is_available', true)
            ->with(['staff', 'branch'])
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function getTimeslotsByDate($date)
    {
        return $this->model->where('date', $date)
            ->with(['staff', 'branch'])
            ->orderBy('start_time', 'asc')
            ->get();
    }

    public function getTimeslotsByDateRange($startDate, $endDate)
    {
        return $this->model->whereBetween('date', [$startDate, $endDate])
            ->with(['staff', 'branch'])
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();
    }
}
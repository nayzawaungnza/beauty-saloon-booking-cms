<?php

namespace App\Repositories\Backend;

use App\Models\Staff;
use App\Repositories\BaseRepository;

class StaffRepository extends BaseRepository
{
    public function model()
    {
        return Staff::class;
    }
    
    public function getAllStaff()
    {
        return $this->model->with(['branch', 'services', 'createdBy', 'updatedBy'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getActiveStaff()
    {
        return $this->model->where('is_active', true)
            ->with(['branch', 'services'])
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getStaffById($id)
    {
        return $this->model->with(['branch', 'services', 'schedules', 'createdBy', 'updatedBy'])
            ->findOrFail($id);
    }

    public function getStaffBySlug($slug)
    {
        return $this->model->where('slug', $slug)
            ->with(['branch', 'services', 'schedules', 'createdBy', 'updatedBy'])
            ->firstOrFail();
    }

    public function create(array $data)
    {
        $staff = $this->model->create([
            'name' => $data['name'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'branch_id' => $data['branch_id'] ?? null,
            'specialization' => $data['specialization'] ?? null,
            'description' => $data['description'] ?? null,
            'excerpt' => $data['excerpt'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id
        ]);

        // Sync services if provided
        if (isset($data['services']) && is_array($data['services'])) {
            $staff->services()->sync($data['services']);
        }

        // Log activity
        $activity_data['subject'] = $staff;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.CREATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) created staff member (%s).', $model_type, auth()->user()->name, $staff->name);
        saveActivityLog($activity_data);

        return $staff->load(['branch', 'services']);
    }

    public function update(Staff $staff, array $data)
    {
        $staff->update([
            'name' => $data['name'],
            'email' => $data['email'] ?? $staff->email,
            'phone' => $data['phone'] ?? $staff->phone,
            'branch_id' => $data['branch_id'] ?? $staff->branch_id,
            'specialization' => $data['specialization'] ?? $staff->specialization,
            'description' => $data['description'] ?? $staff->description,
            'excerpt' => $data['excerpt'] ?? $staff->excerpt,
            'is_active' => $data['is_active'] ?? $staff->is_active,
            'updated_by' => auth()->user()->id
        ]);

        // Sync services if provided
        if (isset($data['services']) && is_array($data['services'])) {
            $staff->services()->sync($data['services']);
        }

        // Log activity
        $activity_data['subject'] = $staff;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) updated staff member (%s).', $model_type, auth()->user()->name, $staff->name);
        saveActivityLog($activity_data);

        return $staff->fresh(['branch', 'services', 'createdBy', 'updatedBy']);
    }

    public function changeStatus(Staff $staff)
    {
        $staff->update([
            'is_active' => !$staff->is_active,
            'updated_by' => auth()->user()->id
        ]);

        // Log activity
        $activity_data['subject'] = $staff;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) changed status of staff member (%s).', $model_type, auth()->user()->name, $staff->name);
        saveActivityLog($activity_data);

        return $staff;
    }

    public function destroy(Staff $staff)
    {
        $deleted = $this->deleteById($staff->id);
        if ($deleted) {
            $staff->save();
        }

        // Log activity
        $activity_data['subject'] = $staff;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.DELETED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) deleted staff member (%s).', $model_type, auth()->user()->name, $staff->name);
        saveActivityLog($activity_data);

        return $staff;
    }

    public function getStaffByBranch($branchId)
    {
        return $this->model->where('branch_id', $branchId)
            ->where('is_active', true)
            ->with(['services'])
            ->orderBy('name', 'asc')
            ->get();
    }

    public function searchStaff($query)
    {
        return $this->model->where('name', 'LIKE', "%{$query}%")
            ->orWhere('email', 'LIKE', "%{$query}%")
            ->orWhere('specialization', 'LIKE', "%{$query}%")
            ->with(['branch', 'services', 'createdBy', 'updatedBy'])
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getStaffWithServices()
    {
        return $this->model->with(['branch', 'services'])
            ->where('is_active', true)
            ->orderBy('name', 'asc')
            ->get();
    }

    public function syncServices(Staff $staff, array $serviceIds)
    {
        $staff->services()->sync($serviceIds);
        return $staff->load('services');
    }
}
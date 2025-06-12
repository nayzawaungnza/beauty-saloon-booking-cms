<?php

namespace App\Repositories\Backend;

use App\Models\Branch;

use App\Repositories\BaseRepository;

class BranchRepository extends BaseRepository
{
    public function model()
    {
        return Branch::class;
    }

    public function create(array $data)
    {
        $branch = $this->model->create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'address' => $data['address'] ?? null,
            'phone' => $data['phone'] ?? null,
            'city' => $data['city'] ?? null,
            'state' => $data['state'] ?? null,
            'zip' => $data['zip'] ?? null,
            'manager_id' => $data['manager_id'] ?? null,
            'latitude' => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'created_by' => auth()->user()->id,
            'updated_by' => auth()->user()->id
        ]);

        // Log activity
        $activity_data['subject'] = $branch;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.CREATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) created branch (%s).', $model_type, auth()->user()->name, $branch->name);
        saveActivityLog($activity_data);

        return $branch;
    }

    public function update(Branch $branch, array $data)
    {
        $branch->update([
            'name' => $data['name'],
            'description' => $data['description'] ?? $branch->description,
            'address' => $data['address'] ?? $branch->address,
            'phone' => $data['phone'] ?? $branch->phone,
            'city' => $data['city'] ?? $branch->city,
            'state' => $data['state'] ?? $branch->state,
            'zip' => $data['zip'] ?? $branch->zip,
            'manager_id' => $data['manager_id'] ?? $branch->manager_id,
            'latitude' => $data['latitude'] ?? $branch->latitude,
            'longitude' => $data['longitude'] ?? $branch->longitude,
            'is_active' => $data['is_active'] ?? $branch->is_active,
            'updated_by' => auth()->user()->id
        ]);

        // Log activity
        $activity_data['subject'] = $branch;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) updated branch (%s).', $model_type, auth()->user()->name, $branch->name);
        saveActivityLog($activity_data);

        return $branch->fresh(['manager', 'createdBy', 'updatedBy']);
    }

    public function changeStatus(Branch $branch)
    {
        $branch->update([
            'is_active' => !$branch->is_active,
            'updated_by' => auth()->user()->id
        ]);

        // Log activity
        $activity_data['subject'] = $branch;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) changed status of branch (%s).', $model_type, auth()->user()->name, $branch->name);
        saveActivityLog($activity_data);

        return $branch;
    }

    public function destroy(Branch $branch)
    {
        $deleted = $this->deleteById($branch->id);
        if ($deleted) {
            $branch->save();
        }

        // Log activity
        $activity_data['subject'] = $branch;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.DELETED_EVENT_NAME');
        $model_type = (class_basename(auth()->user()->getModel()) === config('constants.LABEL_NAME.USER'))
            ? 'User'
            : class_basename(auth()->user()->getModel());
        $activity_data['description'] = sprintf('%s(%s) deleted branch (%s).', $model_type, auth()->user()->name, $branch->name);
        saveActivityLog($activity_data);

        return $branch;
    }

    public function getBranches()
    {
        return $this->model->where('is_active', 1)
            ->with('manager', 'createdBy', 'updatedBy')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    public function getBranchBySlug(string $slug)
    {
        return $this->model->where('slug', $slug)
            ->with('manager', 'createdBy', 'updatedBy')
            ->first();
    }

    public function getBranchEloquent()
    {
        return $this->model
            ->with('manager', 'createdBy', 'updatedBy')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getActiveBranches()
    {
        return $this->model->where('is_active', 1)
            ->with('manager')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function searchBranches($query)
    {
        return $this->model->where('name', 'LIKE', "%{$query}%")
            ->orWhere('city', 'LIKE', "%{$query}%")
            ->orWhere('state', 'LIKE', "%{$query}%")
            ->with('manager', 'createdBy', 'updatedBy')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getBranchesByManager($managerId)
    {
        return $this->model->where('manager_id', $managerId)
            ->with('manager')
            ->orderBy('name', 'asc')
            ->get();
    }

    public function getBranchesWithLocation()
    {
        return $this->model->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->with('manager')
            ->orderBy('name', 'asc')
            ->get();
    }
}
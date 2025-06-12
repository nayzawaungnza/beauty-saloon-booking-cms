<?php

namespace App\Repositories\Backend;

use Spatie\Permission\Models\Role;
use App\Repositories\BaseRepository;
use Illuminate\Support\Facades\Hash;

class RoleRepository extends BaseRepository
{
    /**
     * @return string
     */
    public function model()
    {
        return Role::class;
    }

    /**
     * @param array $data
     *
     * @return Role
     */
    public function create(array $data) : Role
    {
        $role = Role::create([
            'name'   => $data['name'],
        ]);
        $role->syncPermissions($data['permission']);

        // save activity in activitylog
        $activity_data['subject'] = $role;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.CREATED_EVENT_NAME');
        $activity_data['description'] = sprintf('Admin(%s) created Role(%s).', auth()->user()->name, $role->name);
        saveActivityLog($activity_data);
        return $role;
    }

    /**
     * @param Agent  $agent
     * @param array $data
     *
     * @return mixed
     */
    public function update(Role $role, array $data) : Role
    {
        $role->name = isset($data['name']) ? $data['name'] : $role->name ;
       
        if ($role->isDirty()) {
            $role->save();
        }

        $role->syncPermissions($data['permission']);

        // save activity in activitylog
        $activity_data['subject'] = $role->refresh();
        $activity_data['event'] = config('constants.ACTIVITY_LOG.UPDATED_EVENT_NAME');
        $activity_data['description'] = sprintf('Admin(%s) update Role(%s).', auth()->user()->name, $role->name);
        saveActivityLog($activity_data);

        return $role;
    }

    /**
     * @param Role $role
     */
    public function destroy(Role $role)
    {
        $deleted = $this->deleteById($role->id);

        if ($deleted) {
            $role->save();
        }

        // save activity in activitylog
        $activity_data['subject'] = $role;
        $activity_data['event'] = config('constants.ACTIVITY_LOG.DELETED_EVENT_NAME');
        $activity_data['description'] = sprintf('Admin(%s) delete Role(%s).', auth()->user()->name, $role->name);
        saveActivityLog($activity_data);
    }

    /**
     * return Eloquent
     */
    public function getRoleEloquent()
    {
        return Role::query();
    }

    public function getRoles()
{
    return $this->model()::query()
        //->whereNotIn('name', ['Super Admin']) // Exclude specific roles
        ->with('permissions')
        ->orderBy('created_at', 'desc')
        ->get();
}
}
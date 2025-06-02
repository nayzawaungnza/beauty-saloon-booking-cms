<?php
namespace App\Repositories\Backend;

use App\Models\Service;
use App\Repositories\BaseRepository;

class ServiceRepository extends BaseRepository
{
    public function model()
    {
        return Service::class;
    }

    public function getServiceEloquent()
    {
        return $this->model->where('is_active',1)
                ->with('createdBy', 'updatedBy');
    }
}
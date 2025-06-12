<?php

namespace App\Services;

use Exception;
use App\Models\Service;
use InvalidArgumentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Repositories\Backend\ServiceRepository;
use App\Services\Interfaces\ServiceServiceInterface;

class ServiceService implements ServiceServiceInterface
{
    protected $serviceRepository;

    public function __construct(ServiceRepository $serviceRepository)
    {
        $this->serviceRepository = $serviceRepository;
    }
    public function create(array $data){
        DB::beginTransaction();
        try {
            $service = $this->serviceRepository->create($data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Service Creation Error:'.$exc->getMessage());
            throw new InvalidArgumentException('Unable to create service'); 
        }
        DB::commit();
        return $service;
    }

    public function update(Service $service, array $data)
    {
        DB::beginTransaction();
        try {
            $service = $this->serviceRepository->update($service,$data);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Service Update Error:'.$exc->getMessage());
            throw new InvalidArgumentException('Unable to Service update'); 
        }
        DB::commit();
        return $service;
    }
    public function changeStatus(Service $service){
        DB::beginTransaction();
        try {
            $service = $this->serviceRepository->changeStatus($service);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Service Status Change Error:'.$exc->getMessage());
            throw new InvalidArgumentException('Unable to change service status'); 
        }
        DB::commit();
        return $service;
    }

    public function delete(Service $service){
        DB::beginTransaction();
        try {
            $service = $this->serviceRepository->destroy($service);
        } catch (Exception $exc) {
            DB::rollBack();
            Log::error('Service Deletion Error:'.$exc->getMessage());
            throw new InvalidArgumentException('Unable to delete service'); 
        }
        DB::commit();
        return $service;
    }

    public function getServices(){
        return $this->serviceRepository->getServices();
    }

    public function getServiceBySlug(string $slug){
        return $this->serviceRepository->getServiceBySlug($slug);
    }

    public function getServiceEloquent(){
        return $this->serviceRepository->getServiceEloquent();
    }
    
}
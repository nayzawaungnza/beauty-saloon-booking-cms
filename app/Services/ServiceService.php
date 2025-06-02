<?php

namespace App\Services;

use App\Repositories\Backend\ServiceRepository;
use App\Services\Interfaces\ServiceServiceInterface;

class ServiceService implements ServiceServiceInterface
{
    protected $serviceRepository;

    public function __construct(ServiceRepository $serviceRepository)
    {
        $this->serviceRepository = $serviceRepository;
    }

    public function getServiceEloquent(){
        return $this->serviceRepository->getServiceEloquent();
    }
}
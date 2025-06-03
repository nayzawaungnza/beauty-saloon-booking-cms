<?php

namespace App\Services\Interfaces;

use App\Enums\IsAdminStatusEnum;
use App\Models\Service;

interface ServiceServiceInterface
{
    public function create(array $data);

    public function update(Service $service, array $data);
    public function changeStatus(Service $service);

    public function delete(Service $service);

    public function getServices();
    public function getServiceBySlug(string $slug);
    public function getServiceEloquent();
}
<?php

namespace App\Services\Interfaces;

use App\Enums\IsAdminStatusEnum;
use App\Models\Service;

interface ServiceServiceInterface
{
    public function getServiceEloquent();
}
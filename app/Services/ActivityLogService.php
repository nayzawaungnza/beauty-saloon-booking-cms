<?php

namespace App\Services;

use App\Repositories\Backend\ActivityLogRepository;
use App\Services\Interfaces\ActivityLogServiceInterface;
use Carbon\Carbon;

class ActivityLogService implements ActivityLogServiceInterface
{
    /**
     * @var ActivityLogRepository
     */
    protected $activityLogRepository;

    /**
     * BrandService constructor.
     *
     * @param ActivityLogRepository $activityLogRepository
     */
    public function __construct(ActivityLogRepository $activityLogRepository)
    {
        $this->activityLogRepository = $activityLogRepository;
    }

    /**
     * Get lists of activity logs.
     * 
     * @return Collection | static []
     */
    public function getActivityLogs($request)
    {
        return $this->activityLogRepository->getActivityLogs($request);
    }
}

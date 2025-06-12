<?php

namespace App\Repositories\Backend;

use Spatie\Activitylog\Models\Activity;
use App\Repositories\BaseRepository;

class ActivityLogRepository extends BaseRepository
{
    /**
     * @return string
     */
    public function model()
    {
        return Activity::class;
    }

    /**
     * Get eloquent of activity logs.
     * 
     * @return Eloquent
     */
    public function getActivityLogs($request)
    {
        $activites = Activity::with(['causer', 'subject']);
        if ($request->activity_log_startDate && $request->activity_log_endDate) {
            $activites = $activites->whereBetween('created_at', [$request->activity_log_startDate, $request->activity_log_endDate]);
        }
        if (isset($request->event) && $event = $request->event) {
            $activites = $activites->where('event', $event);
        }
        if (isset($request->causer_type) && $causer_type = $request->causer_type) {
            $activites = $activites->where('causer_type', 'App\Models\\' . $causer_type);
        }
        if (isset($request->causer_name) && $causer_name = $request->causer_name) {
            $activites = $activites->whereHas('causer', function ($q) use ($causer_name) {
                $q->where('name', 'like', "%{$causer_name}%");
            });
        }
        return $activites->select('activity_log.*');
    }
}

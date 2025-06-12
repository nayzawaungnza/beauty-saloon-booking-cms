<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    /**
     * @var ActivityLogService
     */
    protected $activityLogService;

    /**
     * ActivityLogController constructor.
     *
     */
    public function __construct(ActivityLogService $activityLogService)
    {
        $this->middleware('permission:activity_log.view', ['only' => ['index']]);
        $this->activityLogService = $activityLogService;
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $activityLogs = $this->activityLogService->getActivityLogs($request);
            
            // Apply ordering
            $activityLogs->orderBy('created_at', 'desc');
            
            // Get all results for client-side pagination
            $logs = $activityLogs->get();
            
            // Transform the data
            $transformedLogs = $logs->map(function ($log) {
                return [
                    'id' => $log->id,
                    'event' => $log->event,
                    'description' => $log->description,
                    'subject_type' => $log->subject_type,
                    'subject_id' => $log->subject_id,
                    'causer_type' => $log->causer_type,
                    'causer_id' => $log->causer_id,
                    'causer' => $log->causer,
                    'properties' => $log->properties,
                    'created_at' => $log->created_at,
                    'updated_at' => $log->updated_at,
                ];
            });
            
            // Get filter options
            $events = Activity::distinct()->pluck('event')->filter()->sort()->values();
            $causerTypes = Activity::distinct()
                ->whereNotNull('causer_type')
                ->pluck('causer_type')
                ->map(function ($type) {
                    return class_basename($type);
                })
                ->unique()
                ->sort()
                ->values();
            
            return Inertia::render('Backend/ActivityLogs/Index', [
                'activityLogs' => [
                    'data' => $transformedLogs,
                    'total' => $transformedLogs->count(),
                    'from' => $transformedLogs->count() > 0 ? 1 : 0,
                    'to' => $transformedLogs->count(),
                ],
                'filters' => [
                    'events' => $events,
                    'causerTypes' => $causerTypes,
                ],
                'currentFilters' => [
                    'event' => $request->event,
                    'causer_type' => $request->causer_type,
                    'causer_name' => $request->causer_name,
                    'activity_log_startDate' => $request->activity_log_startDate,
                    'activity_log_endDate' => $request->activity_log_endDate,
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load activity logs: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  Activity  $activityLog
     * @return \Illuminate\Http\Response
     */
    public function show(Activity $activityLog)
    {
        try {
            $activityLog->load(['causer', 'subject']);
            
            return Inertia::render('Backend/ActivityLogs/Show', [
                'activityLog' => $activityLog
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.activity-logs.index')
                ->with('error', 'Activity log not found: ' . $e->getMessage());
        }
    }

    /**
     * Export activity logs
     */
    public function export(Request $request)
    {
        try {
            $activityLogs = $this->activityLogService->getActivityLogs($request);
            $logs = $activityLogs->orderBy('created_at', 'desc')->get();
            
            // Here you can implement your export logic (CSV, PDF, etc.)
            // For now, we'll return JSON
            return response()->json([
                'data' => $logs,
                'message' => 'Export completed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Export failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
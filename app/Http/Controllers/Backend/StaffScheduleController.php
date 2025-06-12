<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\StaffSchedule;
use App\Services\StaffService;
use App\Http\Controllers\Controller;
use App\Services\StaffScheduleService;
use App\Http\Requests\StaffSchedule\CreateStaffScheduleRequest;
use App\Http\Requests\StaffSchedule\UpdateStaffScheduleRequest;

class StaffScheduleController extends Controller
{
    protected $staffScheduleService;
    protected $staffService;

    public function __construct(
        StaffScheduleService $staffScheduleService,
        StaffService $staffService
    ) {
        $this->middleware('permission:schedule.view', ['only' => ['index', 'show']]);
        $this->middleware('permission:schedule.create', ['only' => ['create', 'store']]);
        $this->middleware('permission:schedule.edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:schedule.delete', ['only' => ['destroy']]);
        
        $this->staffScheduleService = $staffScheduleService;
        $this->staffService = $staffService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $staffId = $request->query('staff_id');
            $dayOfWeek = $request->query('day_of_week');
            
            if ($staffId) {
                $schedules = $this->staffScheduleService->getSchedulesByStaff($staffId);
            } elseif ($dayOfWeek !== null) {
                $schedules = $this->staffScheduleService->getSchedulesByDay($dayOfWeek);
            } else {
                $schedules = $this->staffScheduleService->getAllSchedules();
            }
            
            $staff = $this->staffService->getActiveStaff();
            
            return Inertia::render('Backend/StaffSchedules/Index', [
                'schedules' => $schedules,
                'staff' => $staff,
                'filters' => [
                    'staff_id' => $staffId,
                    'day_of_week' => $dayOfWeek,
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load schedules: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            $staff = $this->staffService->getActiveStaff();
            
            return Inertia::render('Backend/StaffSchedules/Create', [
                'staff' => $staff,
                'days' => [
                    ['value' => 0, 'label' => 'Sunday'],
                    ['value' => 1, 'label' => 'Monday'],
                    ['value' => 2, 'label' => 'Tuesday'],
                    ['value' => 3, 'label' => 'Wednesday'],
                    ['value' => 4, 'label' => 'Thursday'],
                    ['value' => 5, 'label' => 'Friday'],
                    ['value' => 6, 'label' => 'Saturday'],
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load create form: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateStaffScheduleRequest $request)
    {
        try {
            $schedule = $this->staffScheduleService->create($request->validated());
            
            return redirect()->route('admin.staff-schedules.show', $schedule->id)
                ->with('success', 'Staff schedule created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create staff schedule: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(StaffSchedule $staffSchedule)
    {
        try {
            $staffSchedule->load(['staff', 'createdBy', 'updatedBy']);
            
            return Inertia::render('Backend/StaffSchedules/Show', [
                'schedule' => $staffSchedule
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.staff-schedules.index')
                ->with('error', 'Staff schedule not found: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StaffSchedule $staffSchedule)
    {
        try {
            $staffSchedule->load(['staff', 'createdBy', 'updatedBy']);
            $staff = $this->staffService->getActiveStaff();
            
            return Inertia::render('Backend/StaffSchedules/Edit', [
                'schedule' => $staffSchedule,
                'staff' => $staff,
                'days' => [
                    ['value' => 0, 'label' => 'Sunday'],
                    ['value' => 1, 'label' => 'Monday'],
                    ['value' => 2, 'label' => 'Tuesday'],
                    ['value' => 3, 'label' => 'Wednesday'],
                    ['value' => 4, 'label' => 'Thursday'],
                    ['value' => 5, 'label' => 'Friday'],
                    ['value' => 6, 'label' => 'Saturday'],
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.staff-schedules.index')
                ->with('error', 'Failed to load edit form: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStaffScheduleRequest $request, StaffSchedule $staffSchedule)
    {
        try {
            $updatedSchedule = $this->staffScheduleService->update($staffSchedule, $request->validated());
            
            return redirect()->route('admin.staff-schedules.show', $updatedSchedule->id)
                ->with('success', 'Staff schedule updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update staff schedule: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StaffSchedule $staffSchedule)
    {
        try {
            $this->staffScheduleService->delete($staffSchedule);
            
            return redirect()->route('admin.staff-schedules.index')
                ->with('success', 'Staff schedule deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete staff schedule: ' . $e->getMessage());
        }
    }

    /**
     * Bulk create staff schedules
     */
    public function bulkCreate(Request $request)
    {
        try {
            $request->validate([
                'schedules' => 'required|array',
                'schedules.*.staff_id' => 'required|exists:staff,id',
                'schedules.*.day_of_week' => 'required|integer|between:0,6',
                'schedules.*.start_time' => 'required|date_format:H:i',
                'schedules.*.end_time' => 'required|date_format:H:i|after:schedules.*.start_time',
                'schedules.*.is_available' => 'boolean',
            ]);
            
            $schedules = $this->staffScheduleService->bulkCreateSchedules($request->all());
            
            return redirect()->route('admin.staff-schedules.index')
                ->with('success', count($schedules) . ' staff schedules created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create staff schedules: ' . $e->getMessage());
        }
    }
}
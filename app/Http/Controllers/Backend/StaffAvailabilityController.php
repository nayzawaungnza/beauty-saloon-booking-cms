<?php

namespace App\Http\Controllers\Backend;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Staff;
use Illuminate\Http\Request;
use App\Models\StaffAvailability;
use App\Http\Controllers\Controller;
use App\Services\StaffAvailabilityService;
use App\Http\Requests\StaffAvailability\BatchStaffAvailabilityRequest;
use App\Http\Requests\StaffAvailability\CreateStaffAvailabilityRequest;
use App\Http\Requests\StaffAvailability\UpdateStaffAvailabilityRequest;

class StaffAvailabilityController extends Controller
{
    protected $staffAvailabilityService;
    public function __construct(StaffAvailabilityService $staffAvailabilityService)
    {
        $this->middleware('permission:staff_availability.view', ['only' => ['index', 'show']]);
        $this->middleware('permission:staff_availability.create', ['only' => ['create', 'store']]);
        $this->middleware('permission:staff_availability.edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:staff_availability.delete', ['only' => ['destroy']]);
        
        $this->staffAvailabilityService = $staffAvailabilityService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $staffAvailabilities = $this->staffAvailabilityService->getStaffAvailabilityEloquent();

        return Inertia::render('Backend/StaffAvailability/Index', [
            'staffAvailabilities' => $staffAvailabilities,
            'loading' => false,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $staff = Staff::where('is_active', true)->get(['id', 'name']);
        
        return Inertia::render('Backend/StaffAvailability/Create', [
            'staff' => $staff,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateStaffAvailabilityRequest $request)
    {
        $this->staffAvailabilityService->create($request->all());
        return redirect()->route('admin.staff_availability.index')->with('success', 'Staff availability created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(StaffAvailability $staffAvailability)
    {
        $staffAvailability->load([
            'staff:id,name,email',
            'createdBy:id,name,email', 
            'updatedBy:id,name,email'
        ]);

        return Inertia::render('Backend/StaffAvailability/Show', [
            'staffAvailability' => $staffAvailability,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StaffAvailability $staffAvailability)
    {
        $staffAvailability->load([
            'staff:id,name,email',
            'createdBy:id,name,email', 
            'updatedBy:id,name,email'
        ]);

         // Append formatted time attributes for the form
        $staffAvailability->append(['start_time_format', 'end_time_format']);
        
        
        $staff = Staff::where('is_active', true)->get(['id', 'name']);
        
        return Inertia::render('Backend/StaffAvailability/Edit', [
            'staffAvailability' => $staffAvailability,
            'staff' => $staff,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStaffAvailabilityRequest $request, StaffAvailability $staffAvailability)
    {
        $this->staffAvailabilityService->update($staffAvailability, $request->all());
        return redirect()->route('admin.staff_availability.index')->with('success', 'Staff availability updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StaffAvailability $staffAvailability)
    {
        $this->staffAvailabilityService->delete($staffAvailability);
        return redirect()->route('admin.staff_availability.index')->with('success', 'Staff availability deleted successfully');
    }

    public function createBatch()
    {
        $staff = Staff::where('is_active', true)->get(['id', 'name']);
        
        return Inertia::render('Backend/StaffAvailability/CreateBatch', [
            'staff' => $staff,
        ]);
    }

    /**
     * Store batch availabilities.
     */
    public function storeBatch(BatchStaffAvailabilityRequest $request)
    {
        try {
            $this->staffAvailabilityService->createBatch($request->validated());
            return redirect()->route('admin.staff_availability.index')->with('success', 'Staff availabilities created successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withInput()->with('error', $e->getMessage());
        }
    }

    /**
     * Generate default availability for a staff member.
     */
    public function generateDefault(Request $request, Staff $staff)
    {
        try {
            $this->staffAvailabilityService->generateDefaultAvailability($staff);
            return redirect()->route('admin.staffs.show', $staff->id)->with('success', 'Default availability generated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display availability in calendar view.
     */
    public function calendar(Request $request)
    {
        $staff = Staff::where('is_active', true)->get(['id', 'name']);
        $selectedStaffId = $request->input('staff_id');
        $startDate = $request->input('start_date', Carbon::now()->startOfWeek()->format('Y-m-d'));
        $endDate = $request->input('end_date', Carbon::now()->endOfWeek()->format('Y-m-d'));
        
        $availabilityData = [];
        
        if ($selectedStaffId) {
            $selectedStaff = Staff::find($selectedStaffId);
            if ($selectedStaff) {
                $availabilityData = $this->staffAvailabilityService->getAvailabilityForDateRange(
                    $selectedStaff, 
                    $startDate, 
                    $endDate
                );
            }
        }
        
        return Inertia::render('Backend/StaffAvailability/Calendar', [
            'staff' => $staff,
            'selectedStaffId' => $selectedStaffId,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'availabilityData' => $availabilityData,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Check staff availability for a specific time.
     */
    public function checkAvailability(Request $request)
    {
        $request->validate([
            'staff_id' => 'required|exists:staff,id',
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
        ]);
        
        $staff = Staff::findOrFail($request->staff_id);
        $isAvailable = $this->staffAvailabilityService->isStaffAvailableAt(
            $staff,
            $request->date,
            $request->start_time,
            $request->end_time
        );
        
        return response()->json([
            'is_available' => $isAvailable
        ]);
    }

    /**
     * Find available staff for a specific time.
     */
    public function findAvailableStaff(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required|after:start_time',
            'service_ids' => 'nullable|array',
            'service_ids.*' => 'exists:services,id',
        ]);
        
        $availableStaff = $this->staffAvailabilityService->findAvailableStaff(
            $request->date,
            $request->start_time,
            $request->end_time,
            $request->service_ids
        );
        
        return response()->json([
            'available_staff' => $availableStaff
        ]);
    }
}
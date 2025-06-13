<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Timeslot;
use Illuminate\Http\Request;
use App\Services\StaffService;
use App\Services\BranchService;
use App\Services\TimeslotService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Timeslot\CreateTimeslotRequest;
use App\Http\Requests\Timeslot\UpdateTimeslotRequest;
use App\Models\StaffSchedule;
use App\Models\StaffLeave;
use Carbon\Carbon;

class TimeslotController extends Controller
{
    protected $timeslotService;
    protected $staffService;
    protected $branchService;

    public function __construct(
        TimeslotService $timeslotService,
        StaffService $staffService,
        BranchService $branchService
    ) {
        $this->middleware('permission:timeslot.view', ['only' => ['index', 'show']]);
        $this->middleware('permission:timeslot.create', ['only' => ['create', 'store', 'preview', 'bulkCreateForm','bulkCreate', 'bulkStore']]);
        $this->middleware('permission:timeslot.edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:timeslot.delete', ['only' => ['destroy']]);
        
        $this->timeslotService = $timeslotService;
        $this->staffService = $staffService;
        $this->branchService = $branchService;
    }

    public function index(Request $request)
    {
        try {
            $staffId = $request->query('staff_id');
            $branchId = $request->query('branch_id');
            $date = $request->query('date');
            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');
            
            if ($staffId) {
                $timeslots = $this->timeslotService->getTimeslotsByStaff($staffId);
            } elseif ($branchId) {
                $timeslots = $this->timeslotService->getTimeslotsByBranch($branchId);
            } elseif ($date) {
                $timeslots = $this->timeslotService->getTimeslotsByDate($date);
            } elseif ($startDate && $endDate) {
                $timeslots = $this->timeslotService->getTimeslotsByDateRange($startDate, $endDate);
            } else {
                $timeslots = $this->timeslotService->getAllTimeslots();
            }
            
            $staff = $this->staffService->getActiveStaff();
            $branches = $this->branchService->getActiveBranches();
            
            return Inertia::render('Backend/Timeslots/Index', [
                'timeslots' => $timeslots,
                'staff' => $staff,
                'branches' => $branches,
                'filters' => [
                    'staff_id' => $staffId,
                    'branch_id' => $branchId,
                    'date' => $date,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load timeslots: ' . $e->getMessage());
        }
    }

    public function create()
    {
        try {
            $staff = $this->staffService->getActiveStaff();
            $branches = $this->branchService->getActiveBranches();
            
            return Inertia::render('Backend/Timeslots/Create', [
                'staff' => $staff,
                'branches' => $branches
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load create form: ' . $e->getMessage());
        }
    }

    public function store(CreateTimeslotRequest $request)
    {
        try {
            $timeslot = $this->timeslotService->create($request->validated());
            
            return redirect()->route('admin.timeslots.show', $timeslot->id)
                ->with('success', 'Timeslot created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create timeslot: ' . $e->getMessage());
        }
    }

    public function preview(Request $request)
    {
        $request->validate([
            'staff_id' => 'required|exists:staff,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => ['required', 'date', function ($attribute, $value, $fail) use ($request) {
                if (Carbon::parse($value)->lt(Carbon::parse($request->start_date))) {
                    $fail('The end date must be a date after or equal to the start date.');
                }
            }],
            'interval' => 'required|integer|in:15,30,45,60',
        ]);

        try {
            $staffId = $request->staff_id;
            $interval = (int) $request->interval;
            $allTimeslots = [];
            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);

            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                $dayOfWeek = $date->dayOfWeekIso;

                // $isOnLeave = StaffLeave::where('staff_id', $staffId)
                //     ->where('status', 'approved')
                //     ->whereDate('start_date', '<=', $date)
                //     ->whereDate('end_date', '>=', $date)
                //     ->exists();

                // if ($isOnLeave) {
                //     continue;
                // }

                $schedule = StaffSchedule::where('staff_id', $staffId)
                    ->where('day_of_week', $dayOfWeek)
                    ->where('is_available', true)
                    ->first();

                if (!$schedule) {
                    continue;
                }

                $startTime = Carbon::parse($date->toDateString() . ' ' . $schedule->start_time);
                $endTime = Carbon::parse($date->toDateString() . ' ' . $schedule->end_time);

                while ($startTime->lessThan($endTime)) {
                    $slotEndTime = $startTime->copy()->addMinutes($interval);
                    if ($slotEndTime->greaterThan($endTime)) {
                        break;
                    }
                    $allTimeslots[] = [
                        'date' => $date->toDateString(),
                        'start_time' => $startTime->format('H:i'),
                        'end_time' => $slotEndTime->format('H:i'),
                    ];
                    $startTime = $slotEndTime;
                }
            }

            return response()->json($allTimeslots, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate preview: ' . $e->getMessage()], 500);
        }
    }

    public function show(Timeslot $timeslot)
    {
        try {
            $timeslot->load(['staff', 'branch', 'createdBy', 'updatedBy']);
            
            return Inertia::render('Backend/Timeslots/Show', [
                'timeslot' => $timeslot
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.timeslots.index')
                ->with('error', 'Timeslot not found: ' . $e->getMessage());
        }
    }

    public function edit(Timeslot $timeslot)
    {
        try {
            $timeslot->load(['staff', 'branch', 'createdBy', 'updatedBy']);
            $staff = $this->staffService->getActiveStaff();
            $branches = $this->branchService->getActiveBranches();
            
            return Inertia::render('Backend/Timeslots/Edit', [
                'timeslot' => $timeslot,
                'staff' => $staff,
                'branches' => $branches
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.timeslots.index')
                ->with('error', 'Failed to load edit form: ' . $e->getMessage());
        }
    }

    public function update(UpdateTimeslotRequest $request, Timeslot $timeslot)
    {
        try {
            $updatedTimeslot = $this->timeslotService->update($timeslot, $request->validated());
            
            return redirect()->route('admin.timeslots.show', $updatedTimeslot->id)
                ->with('success', 'Timeslot updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update timeslot: ' . $e->getMessage());
        }
    }

    public function destroy(Timeslot $timeslot)
    {
        try {
            $this->timeslotService->delete($timeslot);
            
            return redirect()->route('admin.timeslots.index')
                ->with('success', 'Timeslot deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete timeslot: ' . $e->getMessage());
        }
    }
    public function bulkCreateForm()
{
    try {
        $staff = $this->staffService->getActiveStaff();
        $branches = $this->branchService->getActiveBranches();
        

        return Inertia::render('Backend/Timeslots/BulkCreate', [
            'staff' => $staff,
            'branches' => $branches
        ]);
    } catch (\Exception $e) {
        return redirect()->back()->with('error', 'Failed to load bulk create form: ' . $e->getMessage());
    }
}

    public function bulkCreate(Request $request)
    {
        $validatedData = $request->validate([
            'timeslots' => 'required|array',
            'timeslots.*.staff_id' => 'required|exists:staff,id',
            'timeslots.*.date' => 'required|date',
            'timeslots.*.start_time' => 'required|date_format:H:i',
            'timeslots.*.end_time' => 'required|date_format:H:i|after:timeslots.*.start_time',
            'timeslots.*.is_available' => 'required|boolean',
        ]);

        try {
            $timeslots = $this->timeslotService->bulkCreateTimeslots($validatedData['timeslots']);
            
            return redirect()->route('admin.timeslots.index')
                ->with('success', count($timeslots) . ' timeslots created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create timeslots: ' . $e->getMessage());
        }
    }
}
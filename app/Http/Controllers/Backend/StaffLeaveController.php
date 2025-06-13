<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\StaffLeave;
use Illuminate\Http\Request;
use App\Services\StaffService;
use App\Http\Controllers\Controller;
use App\Services\StaffLeaveService;
use App\Http\Requests\StaffLeave\CreateStaffLeaveRequest;
use App\Http\Requests\StaffLeave\UpdateStaffLeaveRequest;

class StaffLeaveController extends Controller
{
    protected $staffLeaveService;
    protected $staffService;

    public function __construct(
        StaffLeaveService $staffLeaveService,
        StaffService $staffService
    ) {
        $this->middleware('permission:staff.view', ['only' => ['index', 'show']]);
        $this->middleware('permission:staff.create', ['only' => ['create', 'store']]);
        $this->middleware('permission:staff.edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:staff.delete', ['only' => ['destroy']]);
        $this->middleware('permission:staff.approve', ['only' => ['approve', 'reject']]);
        
        $this->staffLeaveService = $staffLeaveService;
        $this->staffService = $staffService;
    }

    public function index(Request $request)
    {
        try {
            $staffId = $request->query('staff_id');
            
            if ($staffId) {
                $leaves = $this->staffLeaveService->getLeavesByStaff($staffId);
            } else {
                $leaves = $this->staffLeaveService->getAllLeaves();
            }
            
            $staff = $this->staffService->getActiveStaff();
            
            return Inertia::render('Backend/StaffLeaves/Index', [
                'leaves' => $leaves,
                'staff' => $staff,
                'filters' => [
                    'staff_id' => $staffId,
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load leaves: ' . $e->getMessage());
        }
    }

    public function create()
    {
        try {
            $staff = $this->staffService->getActiveStaff();
            
            return Inertia::render('Backend/StaffLeaves/Create', [
                'staff' => $staff
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load create form: ' . $e->getMessage());
        }
    }

    public function store(CreateStaffLeaveRequest $request)
    {
        try {
            $leave = $this->staffLeaveService->create($request->validated());
            
            return redirect()->route('admin.staff-leaves.show', $leave->id)
                ->with('success', 'Staff leave created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create staff leave: ' . $e->getMessage());
        }
    }

    public function show(StaffLeave $staffLeave)
    {
        try {
            $staffLeave->load(['staff', 'approvedBy', 'createdBy', 'updatedBy']);
            
            return Inertia::render('Backend/StaffLeaves/Show', [
                'leave' => $staffLeave
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.staff-leaves.index')
                ->with('error', 'Staff leave not found: ' . $e->getMessage());
        }
    }

    public function edit(StaffLeave $staffLeave)
    {
        try {
            $staffLeave->load(['staff', 'approvedBy', 'createdBy', 'updatedBy']);
            $staff = $this->staffService->getActiveStaff();
            
            return Inertia::render('Backend/StaffLeaves/Edit', [
                'leave' => $staffLeave,
                'staff' => $staff
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.staff-leaves.index')
                ->with('error', 'Failed to load edit form: ' . $e->getMessage());
        }
    }

    public function update(UpdateStaffLeaveRequest $request, StaffLeave $staffLeave)
    {
        try {
            $updatedLeave = $this->staffLeaveService->update($staffLeave, $request->validated());
            
            return redirect()->route('admin.staff-leaves.show', $updatedLeave->id)
                ->with('success', 'Staff leave updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update staff leave: ' . $e->getMessage());
        }
    }

    public function destroy(StaffLeave $staffLeave)
    {
        try {
            $this->staffLeaveService->delete($staffLeave);
            
            return redirect()->route('admin.staff-leaves.index')
                ->with('success', 'Staff leave deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete staff leave: ' . $e->getMessage());
        }
    }

    public function approve(StaffLeave $staffLeave)
    {
        try {
            $this->staffLeaveService->approve($staffLeave);
            
            return redirect()->back()->with('success', 'Staff leave approved successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to approve staff leave: ' . $e->getMessage());
        }
    }

    public function reject(StaffLeave $staffLeave)
    {
        try {
            $this->staffLeaveService->reject($staffLeave);
            
            return redirect()->back()->with('success', 'Staff leave rejected successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to reject staff leave: ' . $e->getMessage());
        }
    }
}
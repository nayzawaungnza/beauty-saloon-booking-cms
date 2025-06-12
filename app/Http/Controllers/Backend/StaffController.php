<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Staff;
use App\Models\Service;
use Illuminate\Http\Request;
use App\Services\StaffService;
use App\Services\BranchService;
use App\Services\ServiceService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Staff\CreateStaffRequest;
use App\Http\Requests\Staff\UpdateStaffRequest;

class StaffController extends Controller
{
    protected $staffService;
    protected $branchService;
    protected $serviceService;

    public function __construct(
        StaffService $staffService,
        BranchService $branchService,
        ServiceService $serviceService
    ) {
        $this->middleware('permission:staff.view', ['only' => ['index', 'show']]);
        $this->middleware('permission:staff.create', ['only' => ['create', 'store']]);
        $this->middleware('permission:staff.edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:staff.delete', ['only' => ['destroy']]);
        
        $this->staffService = $staffService;
        $this->branchService = $branchService;
        $this->serviceService = $serviceService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $staff = $this->staffService->getAllStaff();
            
            return Inertia::render('Backend/Staff/Index', [
                'staff' => $staff,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load staff: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            $branches = $this->branchService->getActiveBranches();
            $services = $this->serviceService->getServices();

            return Inertia::render('Backend/Staff/Create', [
                'branches' => $branches,
                'services' => $services
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load create form: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateStaffRequest $request)
    {
        try {
            $staff = $this->staffService->create($request->validated());
            
            return redirect()->route('admin.staff.show', $staff->slug)
                ->with('success', 'Staff member created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create staff member: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Staff $staff)
    {
        try {
            $staff->load(['branch', 'services', 'schedules', 'createdBy', 'updatedBy']);
            
            return Inertia::render('Backend/Staff/Show', [
                'staff' => $staff
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.staff.index')
                ->with('error', 'Staff member not found: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Staff $staff)
    {
        try {
            $staff->load(['branch', 'services', 'createdBy', 'updatedBy']);
            
            $branches = $this->branchService->getActiveBranches();
            $services = $this->serviceService->getServices();

            return Inertia::render('Backend/Staff/Edit', [
                'staff' => $staff,
                'branches' => $branches,
                'services' => $services
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.staff.index')
                ->with('error', 'Failed to load edit form: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStaffRequest $request, Staff $staff)
    {
        try {
            $updatedStaff = $this->staffService->update($staff, $request->validated());
            
            return redirect()->route('admin.staff.show', $updatedStaff->id)
                ->with('success', 'Staff member updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update staff member: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Staff $staff)
    {
        try {
            $this->staffService->delete($staff);
            
            return redirect()->route('admin.staff.index')
                ->with('success', 'Staff member deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete staff member: ' . $e->getMessage());
        }
    }

    /**
     * Change staff status
     */
    public function changeStatus(Request $request, Staff $staff)
    {
        try {
            $request->validate([
                'is_active' => 'required|boolean'
            ]);

            $this->staffService->changeStatus($staff);
            
            $status = $request->is_active ? 'activated' : 'deactivated';
            
            return redirect()->back()
                ->with('success', "Staff member {$status} successfully!");
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to change staff status: ' . $e->getMessage());
        }
    }

    /**
     * Restore soft deleted staff
     */
    public function restore($id)
    {
        try {
            $this->staffService->restoreStaff($id);
            
            return redirect()->route('admin.staff.index')
                ->with('success', 'Staff member restored successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to restore staff member: ' . $e->getMessage());
        }
    }

    /**
     * Search staff
     */
    public function search(Request $request)
    {
        try {
            $query = $request->get('q');
            $staff = $this->staffService->searchStaff($query);
            
            return response()->json([
                'staff' => $staff
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Search failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get staff by branch
     */
    public function getByBranch(Request $request, $branchId)
    {
        try {
            $staff = $this->staffService->getStaffByBranch($branchId);
            
            return response()->json([
                'staff' => $staff
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to get staff: ' . $e->getMessage()
            ], 500);
        }
    }
}
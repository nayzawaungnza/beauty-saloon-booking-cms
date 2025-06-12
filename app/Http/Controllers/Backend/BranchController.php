<?php

namespace App\Http\Controllers\Backend;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Branch;
use Illuminate\Http\Request;
use App\Services\BranchService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Branch\CreateBranchRequest;
use App\Http\Requests\Branch\UpdateBranchRequest;

class BranchController extends Controller
{
    protected $service;

    public function __construct(BranchService $service)
    {
        $this->middleware('permission:branch.view', ['only' => ['index', 'show']]);
        $this->middleware('permission:branch.create', ['only' => ['create', 'store']]);
        $this->middleware('permission:branch.edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:branch.delete', ['only' => ['destroy']]);
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $branches = $this->service->getBranches();
            
            return Inertia::render('Backend/Branches/Index', [
                'branches' => $branches,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load branches: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            $managers = User::where('is_active', true)
                ->whereHas('roles', function($query) {
                    $query->where('name', 'manager');
                })
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get();

            return Inertia::render('Backend/Branches/Create', [
                'managers' => $managers
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load create form: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateBranchRequest $request)
    {
        try {
            $branch = $this->service->createBranch($request->validated());
            
            return redirect()->route('admin.branches.show', $branch->slug)
                ->with('success', 'Branch created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create branch: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Branch $branch)
    {
        try {
            $branch->load(['manager', 'createdBy', 'updatedBy']);
            
            return Inertia::render('Backend/Branches/Show', [
                'branch' => $branch
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.branches.index')
                ->with('error', 'Branch not found: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Branch $branch)
    {
        try {
            $branch->load(['manager', 'createdBy', 'updatedBy']);
            
            $managers = User::where('is_active', true)
                ->whereHas('roles', function($query) {
                    $query->where('name', 'Manager');
                })
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get();

                //dd($managers);
            return Inertia::render('Backend/Branches/Edit', [
                'branch' => $branch,
                'managers' => $managers
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.branches.index')
                ->with('error', 'Failed to load edit form: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBranchRequest $request, Branch $branch)
    {
        try {
            $updatedBranch = $this->service->update($branch, $request->validated());
            
            return redirect()->route('admin.branches.show', $updatedBranch->slug)
                ->with('success', 'Branch updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update branch: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Branch $branch)
    {
        try {
            $this->service->delete($branch);
            
            return redirect()->route('admin.branches.index')
                ->with('success', 'Branch deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete branch: ' . $e->getMessage());
        }
    }

    /**
     * Change branch status
     */
    public function changeStatus(Request $request, Branch $branch)
    {
        try {
            $request->validate([
                'is_active' => 'required|boolean'
            ]);

            $this->service->changeStatus($branch);
            
            $status = $request->is_active ? 'activated' : 'deactivated';
            
            return redirect()->back()
                ->with('success', "Branch {$status} successfully!");
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to change branch status: ' . $e->getMessage());
        }
    }

    /**
     * Restore soft deleted branch
     */
    public function restore($id)
    {
        try {
            $this->service->restoreBranch($id);
            
            return redirect()->route('admin.branches.index')
                ->with('success', 'Branch restored successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to restore branch: ' . $e->getMessage());
        }
    }

    /**
     * Search branches
     */
    public function search(Request $request)
    {
        try {
            $query = $request->get('q');
            $branches = $this->service->searchBranches($query);
            
            return response()->json([
                'branches' => $branches
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Search failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
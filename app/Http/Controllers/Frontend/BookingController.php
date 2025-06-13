<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Requests\Frontend\BookingRequest;
use App\Services\BookingService;
use App\Services\BranchService;
use App\Services\ServiceService;
use App\Services\StaffService;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BookingController extends Controller
{
    protected $bookingService;
    protected $branchService;
    protected $serviceService;
    protected $staffService;

    public function __construct(
        BookingService $bookingService,
        BranchService $branchService,
        ServiceService $serviceService,
        StaffService $staffService
    ) {
        $this->bookingService = $bookingService;
        $this->branchService = $branchService;
        $this->serviceService = $serviceService;
        $this->staffService = $staffService;
    }

    public function booking() {
        $branches = $this->branchService->getActiveBranches();
        $services = $this->serviceService->getServices();
        $staff = $this->staffService->getActiveStaff();

        return Inertia::render('Frontend/Booking', [
            'branches' => $branches,
            'services' => $services,
            'staff' => $staff,
        ]);
    }

    public function store(BookingRequest $request)
    {
        try {
            $booking = $this->bookingService->create($request->validated());
            return redirect()->route('booking')->with('success', 'Booking created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function getAvailableTimeslots(Request $request)
    {
        $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'date' => 'required|date',
            'staff_id' => 'nullable|exists:staff,id',
        ]);

        $timeslots = $this->bookingService->getAvailableTimeslots(
            $request->branch_id,
            $request->date,
            $request->staff_id
        );

        return response()->json($timeslots);
    }
}
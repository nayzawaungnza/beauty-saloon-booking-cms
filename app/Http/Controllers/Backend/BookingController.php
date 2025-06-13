<?php

namespace App\Http\Controllers\Backend;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Services\StaffService;
use App\Services\BranchService;
use App\Services\BookingService;
use App\Services\ServiceService;
use App\Events\BookingStatusUpdated;
use App\Http\Controllers\Controller;
use App\Events\BookingStatusUpdatedEvent;
use Illuminate\Support\Facades\Notification;
use App\Http\Requests\Booking\CreateBookingRequest;
use App\Http\Requests\Booking\UpdateBookingRequest;

class BookingController extends Controller
{
    protected $bookingService;
    protected $staffService;
    protected $branchService;
    protected $serviceService;
    protected $userService;

    public function __construct(
        BookingService $bookingService,
        StaffService $staffService,
        BranchService $branchService,
        ServiceService $serviceService,
        UserService $userService
    ) {
        $this->middleware('permission:booking.view', ['only' => ['index', 'show']]);
        $this->middleware('permission:booking.create', ['only' => ['create', 'store']]);
        $this->middleware('permission:booking.edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:booking.delete', ['only' => ['destroy']]);
        
        $this->bookingService = $bookingService;
        $this->staffService = $staffService;
        $this->branchService = $branchService;
        $this->serviceService = $serviceService;
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        try {
            $customerId = $request->query('customer_id');
            $staffId = $request->query('staff_id');
            $branchId = $request->query('branch_id');
            $status = $request->query('status');
            $date = $request->query('date');
            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');
            
            if ($customerId) {
                $bookings = $this->bookingService->getBookingsByCustomer($customerId);
            } elseif ($staffId) {
                $bookings = $this->bookingService->getBookingsByStaff($staffId);
            } elseif ($branchId) {
                $bookings = $this->bookingService->getBookingsByBranch($branchId);
            } elseif ($status) {
                $bookings = $this->bookingService->getBookingsByStatus($status);
            } elseif ($date) {
                $bookings = $this->bookingService->getBookingsByDate($date);
            } elseif ($startDate && $endDate) {
                $bookings = $this->bookingService->getBookingsByDateRange($startDate, $endDate);
            } else {
                $bookings = $this->bookingService->getAllBookings();
            }
            
            $staff = $this->staffService->getActiveStaff();
            $branches = $this->branchService->getActiveBranches();
            //$customers = User::where('role', 'customer')->get(['id', 'name', 'email']);
            $customers = $this->userService->getCustomers();
            $statuses = Booking::getStatuses();
            
            return Inertia::render('Backend/Bookings/Index', [
                'bookings' => $bookings,
                'staff' => $staff,
                'branches' => $branches,
                'customers' => $customers,
                'statuses' => $statuses,
                'filters' => [
                    'customer_id' => $customerId,
                    'staff_id' => $staffId,
                    'branch_id' => $branchId,
                    'status' => $status,
                    'date' => $date,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load bookings: ' . $e->getMessage());
        }
    }

    public function create(Request $request)
    {
        try {
            $staff = $this->staffService->getActiveStaff();
            $branches = $this->branchService->getActiveBranches();
            //$customers = User::where('role', 'customer')->get(['id', 'name', 'email']);
            $customers = $this->userService->getCustomers();
            //$services = Service::active()->get(['id', 'name', 'duration', 'price', 'category']);
            $services = $this->serviceService->getServices();
            
            // Handle date and time from calendar
            $date = $request->query('date');
            $time = $request->query('time');
            
            return Inertia::render('Backend/Bookings/Create', [
                'staff' => $staff,
                'branches' => $branches,
                'customers' => $customers,
                'services' => $services,
                'preselectedDate' => $date,
                'preselectedTime' => $time,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load create form: ' . $e->getMessage());
        }
    }

    public function store(CreateBookingRequest $request)
    {
        try {
            $booking = $this->bookingService->create($request->validated());
            
            return redirect()->route('admin.bookings.show', $booking->id)
                ->with('success', 'Booking created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create booking: ' . $e->getMessage());
        }
    }

    public function show(Booking $booking)
    {
        try {
            $booking->load(['customer', 'staff', 'branch', 'timeslot', 'services', 'createdBy', 'updatedBy']);
            
            return Inertia::render('Backend/Bookings/Show', [
                'booking' => $booking
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.bookings.index')
                ->with('error', 'Booking not found: ' . $e->getMessage());
        }
    }

    public function edit(Booking $booking)
    {
        try {
            $booking->load(['customer', 'staff', 'branch', 'timeslot', 'services', 'createdBy', 'updatedBy']);
            $staff = $this->staffService->getActiveStaff();
            $branches = $this->branchService->getActiveBranches();
            //$customers = User::where('role', 'customer')->get(['id', 'name', 'email']);
            $customers = $this->userService->getCustomers();
            //$services = Service::active()->get(['id', 'name', 'duration', 'price', 'category']);
            $services = $this->serviceService->getServices();
            
            return Inertia::render('Backend/Bookings/Edit', [
                'booking' => $booking,
                'staff' => $staff,
                'branches' => $branches,
                'customers' => $customers,
                'services' => $services
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.bookings.index')
                ->with('error', 'Failed to load edit form: ' . $e->getMessage());
        }
    }

    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        try {
            $updatedBooking = $this->bookingService->update($booking, $request->validated());
            
            return redirect()->route('admin.bookings.show', $updatedBooking->id)
                ->with('success', 'Booking updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update booking: ' . $e->getMessage());
        }
    }

    public function destroy(Booking $booking)
    {
        try {
            $this->bookingService->delete($booking);
            
            return redirect()->route('admin.bookings.index')
                ->with('success', 'Booking deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete booking: ' . $e->getMessage());
        }
    }

    public function confirm(Booking $booking)
    {
        try {
            $previousStatus = $booking->status;

            $this->bookingService->confirmBooking($booking);
            $this->notifyStatusChange($booking, $previousStatus);
            return redirect()->back()
                ->with('success', 'Booking confirmed successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to confirm booking: ' . $e->getMessage());
        }
    }

    public function cancel(Booking $booking)
    {
        try {
            $previousStatus = $booking->status;

            $this->bookingService->cancelBooking($booking);
            $this->notifyStatusChange($booking, $previousStatus);
            return redirect()->back()
                ->with('success', 'Booking cancelled successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to cancel booking: ' . $e->getMessage());
        }
    }

    public function complete(Booking $booking)
    {
        try {
            $previousStatus = $booking->status;
            $this->bookingService->completeBooking($booking);
            $this->notifyStatusChange($booking, $previousStatus);
            return redirect()->back()
                ->with('success', 'Booking completed successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to complete booking: ' . $e->getMessage());
        }
    }

    public function checkAvailability(Request $request)
    {
        try {
            $request->validate([
                'branch_id' => 'required|exists:branches,id',
                'date' => 'required|date',
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
                'staff_id' => 'nullable|exists:staff,id',
                'exclude_booking_id' => 'nullable|exists:bookings,id',
            ]);

            $isAvailable = $this->bookingService->checkAvailability(
                $request->branch_id,
                $request->date,
                $request->start_time,
                $request->end_time,
                $request->staff_id,
                $request->exclude_booking_id
            );

            return response()->json([
                'available' => $isAvailable,
                'message' => $isAvailable ? 'Time slot is available' : 'Time slot is not available'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'available' => false,
                'message' => 'Error checking availability: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getAvailableTimeslots(Request $request)
    {
        try {
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

            return response()->json([
                'timeslots' => $timeslots
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error fetching available timeslots: ' . $e->getMessage()
            ], 500);
        }
    }

    protected function notifyStatusChange($booking, $previousStatus)
    {
        // Trigger real-time event
        event(new BookingStatusUpdatedEvent($booking, $previousStatus));
        
        // Send notification to user if registered
        if ($booking->customer) {
            $booking->customer->notify(
                new BookingStatusUpdated($booking, $previousStatus)
            );
        }
        
        // For guest bookings, send email notification
        if (!$booking->customer_id && $booking->email) {
            //use Illuminate\Support\Facades\Notification;
            Notification::route('mail', $booking->email)
                ->notify(new BookingStatusUpdated($booking, $previousStatus));
        }
    }
}
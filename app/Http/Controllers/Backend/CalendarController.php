<?php

namespace App\Http\Controllers\Backend;

use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\StaffService;
use App\Services\BranchService;
use App\Services\BookingService;
use App\Http\Controllers\Controller;

class CalendarController extends Controller
{
    protected $bookingService;
    protected $branchService;
    protected $staffService;

    public function __construct(
        BookingService $bookingService,
        BranchService $branchService,
        StaffService $staffService
    ) {
        $this->middleware('permission:booking.view', ['only' => ['index', 'getBookings']]);
        
        $this->bookingService = $bookingService;
        $this->branchService = $branchService;
        $this->staffService = $staffService;
    }

    public function index(Request $request)
    {
        try {
            $branches = $this->branchService->getActiveBranches();
            $staff = $this->staffService->getActiveStaff();
            
            $initialDate = $request->query('date', Carbon::now()->format('Y-m-d'));
            $initialView = $request->query('view', 'dayGridMonth');
            $branchId = $request->query('branch_id');
            $staffId = $request->query('staff_id');
            
            return Inertia::render('Backend/Calendar/Index', [
                'branches' => $branches,
                'staff' => $staff,
                'initialDate' => $initialDate,
                'initialView' => $initialView,
                'filters' => [
                    'branch_id' => $branchId,
                    'staff_id' => $staffId,
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to load calendar: ' . $e->getMessage());
        }
    }

    public function getBookings(Request $request)
    {
        try {
            $start = $request->query('start');
            $end = $request->query('end');
            $branchId = $request->query('branch_id');
            $staffId = $request->query('staff_id');
            
            $bookings = $this->bookingService->getBookingsByDateRange($start, $end);
            
            if ($branchId) {
                $bookings = $bookings->where('branch_id', $branchId);
            }
            
            if ($staffId) {
                $bookings = $bookings->where('staff_id', $staffId);
            }
            
            $events = [];
            
            foreach ($bookings as $booking) {
                $backgroundColor = $this->getStatusColor($booking->status);
                $borderColor = $backgroundColor;
                
                $events[] = [
                    'id' => $booking->id,
                    'title' => $this->formatBookingTitle($booking),
                    'start' => $booking->booking_date . 'T' . $booking->start_time,
                    'end' => $booking->booking_date . 'T' . $booking->end_time,
                    'backgroundColor' => $backgroundColor,
                    'borderColor' => $borderColor,
                    'textColor' => '#ffffff',
                    'extendedProps' => [
                        'booking_id' => $booking->id,
                        'customer_name' => $booking->customer ? $booking->customer->name : 'Unknown Customer',
                        'staff_name' => $booking->staff ? $booking->staff->name : 'Any Available Staff',
                        'branch_name' => $booking->branch ? $booking->branch->name : 'Unknown Branch',
                        'services' => $booking->services ? $booking->services->pluck('name')->join(', ') : 'No services',
                        'status' => $booking->status,
                        'total_price' => $booking->services ? $booking->services->sum('price') : 0,
                    ]
                ];
            }
            
            return response()->json($events);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to load bookings: ' . $e->getMessage()], 500);
        }
    }

    private function formatBookingTitle($booking)
    {
        $customerName = $booking->customer ? $booking->customer->name : 'Unknown Customer';
        $services = $booking->services && $booking->services->count() > 0 
            ? ' - ' . $booking->services->pluck('name')->first() . ($booking->services->count() > 1 ? ' +' . ($booking->services->count() - 1) : '')
            : '';
        
        return $customerName . $services;
    }

    private function getStatusColor($status)
    {
        switch ($status) {
            case 'pending':
                return '#f1b44c'; // warning
            case 'confirmed':
                return '#50a5f1'; // info
            case 'completed':
                return '#34c38f'; // success
            case 'cancelled':
                return '#f46a6a'; // danger
            default:
                return '#74788d'; // secondary
        }
    }
}
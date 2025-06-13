<?php

namespace App\Http\Controllers\Frontend;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\StaffService;
use App\Services\BranchService;
use App\Services\BookingService;
use App\Services\ServiceService;
use Illuminate\Support\Facades\DB;
use App\Events\BookingCreatedEvent;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Frontend\BookingRequest;

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

    // public function store(BookingRequest $request)
    // {
    //     try {
    //         $booking = $this->bookingService->create($request->validated());
    //         return redirect()->route('booking')->with('success', 'Booking created successfully.');
    //     } catch (\Exception $e) {
    //         return redirect()->back()->withErrors(['error' => $e->getMessage()]);
    //     }
    // }

    public function store(BookingRequest $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            
            // Handle guest user creation
            if (!auth()->check()) {
                $user = $this->createGuestUser($data);
                auth()->login($user);
                $data['customer_id'] = $user->id;
            } else {
                $data['customer_id'] = auth()->id();
            }

            $booking = $this->bookingService->create($data);
            
            // Trigger booking created event
            event(new BookingCreatedEvent($booking));
            
            DB::commit();
            
            return redirect()->route('booking.confirmation', $booking->id)
                ->with('success', 'Booking created successfully!');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
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

    protected function createGuestUser($data)
    {
        //$password = Str::random(12); // Generate random password
        $password = 'password';
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'is_guest' => true,
            'password' => isset($data['password']) ? Hash::make($data['password']) : Hash::make($password),
            'mobile' => $data['mobile'] ?? null,
            'is_active'   => isset($data['is_active']) ? $data['is_active'] : 1,
            //'is_admin' => isset($data['is_admin']) ? $data['is_admin'] : 0,
            //'address'   => isset($data['address']) ? $data['address'] : null,
            //'avatar'    => $avatar ?? null,
            'is_blocked' => isset($data['is_blocked']) ? $data['is_blocked'] : 0,
            'is_subscribed' => isset($data['is_subscribed']) ? $data['is_subscribed'] : 0,
            'created_by' => auth()->user()->id ?? null,
            'remember_token'   => isset($data['remember_token']) ? $data['remember_token'] : null,
            
        ]);

        // if(isset($data['roles']) && $data['roles']) {
        //     $user->assignRole($data['roles']);
        // }
        $user->assignRole('User');
        
        // Send welcome email with temporary password
        $user->notify(new GuestAccountCreated($password));
        
        return $user;
    }
}
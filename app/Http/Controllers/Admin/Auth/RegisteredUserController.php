<?php

namespace App\Http\Controllers\Admin\Auth;

use Exception;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;
use App\Http\Requests\User\CreateUserRequest;

class RegisteredUserController extends Controller
{
    
    public function __construct()
    {

    }
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Backend/Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(CreateUserRequest $request): RedirectResponse
    {
       
        try {
            $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'mobile' => $request->mobile,
            'is_active' => 0,
            'is_blocked' => 0,
            'is_subscribed' => 0
            ]);

            if ($request->is('admin/register')) {
                $user->assignRole('Admin'); // For admin registrations
            } else {
                $user->assignRole('User'); // For regular user registrations
            }
            
            event(new Registered($user));

            //Auth::login($user);

            return redirect(route('admin.login', absolute: false))->with('success', 'Registration success');
            
        } catch (Exception $e) {
           Log::error('Registration failed: ' . $e->getMessage());
            return back()->with('error', 'Registration failed. Please try again.');
        }

        
    }
}
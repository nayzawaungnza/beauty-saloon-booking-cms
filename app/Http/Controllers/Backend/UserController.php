<?php

namespace App\Http\Controllers\Backend;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\UserService;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\UpdateUserRequest;

class UserController extends Controller
{

    protected $userService;
    public function __construct(UserService $userService)
    {
        $this->middleware('permission:user.view', ['only' => ['index', 'show']]);
        $this->middleware('permission:user.create', ['only' => ['create', 'store']]);
        $this->middleware('permission:user.edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:user.delete', ['only' => ['destroy']]);
        
        $this->userService = $userService;
    }
    public function index(Request $request)
    {
        $users = $this->userService->getUserEloquent();
        //dd($users);
        return Inertia::render('Backend/Users/Index',[
            'users' => $users,
            'loading' => false,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create()
    {
        $allRoles = Role::where('name', '!=', 'Super Admin') // UserController.php
                        ->orderBy('name') // UserController.php
                        ->pluck('name') // UserController.php
                        ->toArray(); 
        return Inertia::render('Backend/Users/Create',[
            'allRoles' => $allRoles, // Pass all roles to the view
        ]);
    }

    public function edit(User $user)
    {
        $allRoles = Role::where('name', '!=', 'Super Admin') // UserController.php
                        ->orderBy('name') // UserController.php
                        ->pluck('name') // UserController.php
                        ->toArray(); 
        return Inertia::render('Backend/Users/Edit', [
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'mobile' => $user->mobile,
            'is_active' => $user->is_active,
            'is_blocked' => $user->is_blocked,
            'is_subscribed' => $user->is_subscribed,
            'profile_image' => $user->default_image
                                ? Storage::disk('public')->url($user->default_image->image_url)
                                : null,
            'roles' => $user->roles->pluck('name')->toArray(),
        ],
        'allRoles' => $allRoles,
    ]);
    }

    public function show(User $user)
    {
        //dd($user->roles()->pluck('name')->toArray());
        return Inertia::render('Backend/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'mobile' => $user->mobile,
                'is_active' => $user->is_active,
                'is_blocked' => $user->is_blocked,
                'is_subscribed' => $user->is_subscribed,
                'default_image' => $user->default_image
                                    ? Storage::disk('public')->url($user->default_image->image_url)
                                    : null,
                'roles' => $user->roles->pluck('name')->toArray(),
            ],
        ]);
    }


    public function store(CreateUserRequest $request)
    {
        $this->userService->create($request->all());
        
        return redirect()->route('admin.users.index')->with('success', 'User created successfully');
        
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        //dd($request->all());
        $this->userService->update($user, $request->all());
        // return Inertia::render('Backend/Users/Edit', [
        //     'user' => $user
        // ]);
        return redirect()->route('admin.users.index')->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        $this->userService->destroy($user);

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully');
    }

    public function changeStatus(User $user)
    {
            $result = $this->userService->changeStatus($user);

            return redirect()->route('admin.users.index')->with('success', 'User status updated successfully');        
    }

    public function block(Request $request)
    {
        //
    }
    
}
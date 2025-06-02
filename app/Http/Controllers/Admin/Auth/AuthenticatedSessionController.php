<?php

namespace App\Http\Controllers\Admin\Auth;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use App\Http\Requests\AdminAuth\LoginRequest;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Backend/Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            // Check if user exists and is active/verified before attempting authentication
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return back()
                    ->withInput($request->only('email', 'remember'))
                    ->with('error', 'These credentials do not match our records.');
            }

            if (!$user->is_active) {
                return back()
                    ->withInput($request->only('email', 'remember'))
                    ->with('error', 'Your account is not active. Please contact support.');
            }

            if (is_null($user->email_verified_at)) {
                return back()
                    ->withInput($request->only('email', 'remember'))
                    ->with('error', 'Your email address is not verified. Please verify your email.');
            }

            // Proceed with authentication
            $request->authenticate();
            $request->session()->regenerate();

            Log::info('Login successful', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip()
            ]);

            return redirect()
                ->intended(route('admin.dashboard', absolute: false))
                ->with('success', 'Login successful! Welcome back.');

        } catch (\Exception $e) {
            Log::error('Login failed: ' . $e->getMessage(), [
                'email' => $request->email,
                'ip' => $request->ip()
            ]);

            return back()
                ->withInput($request->only('email', 'remember'))
                ->with('error', 'These credentials do not match our records.');
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        try {
            $user = Auth::user();
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            Log::info('Logout successful', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            return redirect('/')->with('status', 'You have been logged out.');

        } catch (\Exception $e) {
            Log::error('Logout failed: ' . $e->getMessage());
            return redirect('/')->with('error', 'Logout failed. Please try again.');
        }
    }
}
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GuestMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            return redirect()->intended(
                $request->is('admin*') ? route('admin.dashboard') : route('dashboard')
            );
        }

        return $next($request);
    }
}
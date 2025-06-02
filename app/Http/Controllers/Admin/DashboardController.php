<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:dashboard.view', ['only' => ['index', 'show']]);
        // $this->middleware('permission:page.create', ['only' => ['create', 'store']]);
        // $this->middleware('permission:page.edit', ['only' => ['edit', 'update']]);
        // $this->middleware('permission:page.delete', ['only' => ['destroy']]);
    }
    
    public function index(){
        return Inertia::render('Backend/Dashboard/Index');
    }
}
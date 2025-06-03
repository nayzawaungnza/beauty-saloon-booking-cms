<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Service;
use Illuminate\Http\Request;
use App\Services\ServiceService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Service\CreateServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;

class ServiceController extends Controller
{

    protected $serviceService;
    public function __construct(ServiceService $serviceService)
    {
        $this->middleware('permission:service.view', ['only' => ['index', 'show']]);
        $this->middleware('permission:service.create', ['only' => ['create', 'store']]);
        $this->middleware('permission:service.edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:service.delete', ['only' => ['destroy']]);
        $this->serviceService = $serviceService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
       
        $services = $this->serviceService->getServiceEloquent();
        //dd($services->toArray());

        return Inertia::render('Backend/Services/Index',[
            'services' => $services,
            'loading' => false,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Backend/Services/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateServiceRequest $request)
    {
        //dd($request->all());
        $this->serviceService->create($request->all());
        return redirect()->route('admin.services.index')->with('success', 'Service created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        $service->load([
            'createdBy:id,name,email', 
            'updatedBy:id,name,email', 
            'default_image', 
            'gallery_images'
        ]);

        return Inertia::render('Backend/Services/Show', [
            'service' => $service,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        $service->load([
            'createdBy:id,name,email', 
            'updatedBy:id,name,email', 
            'default_image', 
            'gallery_images'
        ]);
        return Inertia::render('Backend/Services/Edit', [
            'service' => $service,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service)
    {
        //dd($request->all());
        $this->serviceService->update($service, $request->all());
        return redirect()->route('admin.services.index')->with('success', 'Service updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $this->serviceService->delete($service);
        return redirect()->route('admin.services.index')->with('success', 'Service deleted successfully');
    }

    public function changeStatus(Service $service){
        $this->serviceService->changeStatus($service);
        return redirect()->route('admin.services.index')->with('success', 'Service status changed successfully');
    }
}
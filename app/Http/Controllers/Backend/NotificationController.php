<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use App\Http\Requests\Notification\CreateNotificationRequest;
use App\Http\Requests\Notification\UpdateNotificationRequest;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->middleware('permission:notification.view', ['only' => ['index', 'show']]);
        $this->middleware('permission:notification.create', ['only' => ['create', 'store']]);
        $this->middleware('permission:notification.edit', ['only' => ['edit', 'update']]);
        $this->middleware('permission:notification.delete', ['only' => ['destroy']]);
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of the resource.
     */
    
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateNotificationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Notification $notification)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Notification $notification)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNotificationRequest $request, Notification $notification)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification)
    {
        //
    }

    public function index(Request $request)
    {
        $notifications = $this->notificationService->getUserNotifications($request->user());
        $unreadCount = $this->notificationService->getUnreadCount($request->user());

        return Inertia::render('Backend/Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $this->notificationService->markAsRead($id, $request->user());
        return response()->json(['success' => true]);
    }

    public function markAllAsRead(Request $request)
    {
        $this->notificationService->markAllAsRead($request->user());
        return response()->json(['success' => true]);
    }
}
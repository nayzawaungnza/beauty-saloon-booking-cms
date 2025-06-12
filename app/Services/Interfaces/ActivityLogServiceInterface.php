<?php

namespace App\Services\Interfaces;

use Illuminate\Http\Request;

interface ActivityLogServiceInterface
{
    public function getActivityLogs(Request $request);
}

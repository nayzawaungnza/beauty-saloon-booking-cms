<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PusherTestController extends Controller
{
    public function triggerEvent()
    {
        event(new \App\Events\MyEvent('Hello world'));
        return 'Event has been sent!';
    }
}
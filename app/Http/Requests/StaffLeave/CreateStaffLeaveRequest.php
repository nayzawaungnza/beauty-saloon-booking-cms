<?php

namespace App\Http\Requests\StaffLeave;

use Illuminate\Foundation\Http\FormRequest;

class CreateStaffLeaveRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'staff_id' => 'required|exists:staff,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:255',
            'status' => 'sometimes|in:pending,approved,rejected',
        ];
    }
}
<?php

namespace App\Http\Requests\StaffLeave;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStaffLeaveRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'staff_id' => 'sometimes|exists:staff,id',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'reason' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:pending,approved,rejected',
        ];
    }
}
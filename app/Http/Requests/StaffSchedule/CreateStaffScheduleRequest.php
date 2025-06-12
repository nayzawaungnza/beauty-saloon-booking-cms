<?php

namespace App\Http\Requests\StaffSchedule;

use Illuminate\Foundation\Http\FormRequest;

class CreateStaffScheduleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'staff_id' => 'required|exists:staff,id',
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_available' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'staff_id.required' => 'Staff member is required.',
            'staff_id.exists' => 'Selected staff member does not exist.',
            'day_of_week.required' => 'Day of week is required.',
            'day_of_week.between' => 'Day of week must be between 0 (Sunday) and 6 (Saturday).',
            'start_time.required' => 'Start time is required.',
            'start_time.date_format' => 'Start time must be in the format HH:MM.',
            'end_time.required' => 'End time is required.',
            'end_time.date_format' => 'End time must be in the format HH:MM.',
            'end_time.after' => 'End time must be after start time.',
        ];
    }
}
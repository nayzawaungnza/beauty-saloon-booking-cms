<?php

namespace App\Http\Requests\Timeslot;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTimeslotRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'staff_id' => 'sometimes|exists:staff,id',
            'branch_id' => 'sometimes|exists:branches,id',
            'date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'is_available' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'staff_id.exists' => 'Selected staff member does not exist.',
            'branch_id.exists' => 'Selected branch does not exist.',
            'date.date' => 'Date must be a valid date.',
            'start_time.date_format' => 'Start time must be in the format HH:MM.',
            'end_time.date_format' => 'End time must be in the format HH:MM.',
            'end_time.after' => 'End time must be after start time.',
        ];
    }
}
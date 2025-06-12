<?php

namespace App\Http\Requests\StaffAvailability;

use Illuminate\Foundation\Http\FormRequest;

class CreateStaffAvailabilityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'staff_id' => 'required|exists:staff,id',
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_available' => 'boolean',
            'effective_date' => 'nullable|date|after_or_equal:today',
            'expiry_date' => 'nullable|date|after_or_equal:effective_date',
            'is_recurring' => 'boolean',
            'recurrence_pattern' => 'nullable|array',
            'recurrence_end_date' => 'nullable|date|after_or_equal:effective_date',
            'priority' => 'nullable|integer|min:0',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages()
    {
        return [
            'staff_id.required' => 'Please select a staff member.',
            'staff_id.exists' => 'Selected staff member is invalid.',
            'day_of_week.required' => 'Day of week is required.',
            'day_of_week.between' => 'Day of week must be between 0 (Sunday) and 6 (Saturday).',
            'start_time.required' => 'Start time is required.',
            'start_time.date_format' => 'Start time must be in HH:MM format.',
            'end_time.required' => 'End time is required.',
            'end_time.date_format' => 'End time must be in HH:MM format.',
            'end_time.after' => 'End time must be after start time.',
            'effective_date.after_or_equal' => 'Effective date cannot be in the past.',
            'expiry_date.after_or_equal' => 'Expiry date must be after or equal to effective date.',
            'recurrence_end_date.after_or_equal' => 'Recurrence end date must be after or equal to effective date.',
            'priority.min' => 'Priority must be a positive number.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }
}
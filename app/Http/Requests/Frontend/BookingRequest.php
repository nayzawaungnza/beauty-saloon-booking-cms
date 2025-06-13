<?php

namespace App\Http\Requests\Frontend;

use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'branch_id' => 'required|exists:branches,id',
            'service_id' => 'required|exists:services,id',
            'staff_id' => 'required|exists:staff,id',
            'timeslot_id' => 'required|exists:timeslots,id',
            'booking_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'customer_name' => 'required_if:user_id,null|string|max:255',
            'customer_email' => 'required_if:user_id,null|email|max:255',
            'customer_phone' => 'required_if:user_id,null|string|max:20',
            'user_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ];
    }
}
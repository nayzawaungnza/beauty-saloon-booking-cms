<?php

namespace App\Http\Requests\Staff;

use App\Models\Staff;
use Illuminate\Foundation\Http\FormRequest;

class CreateStaffRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:staff,email',
            'phone' => 'nullable|string|max:20|unique:staff,phone',
            'branch_id' => 'nullable|exists:branches,id',
            'specialization' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'excerpt' => 'nullable|string|max:500',
            'is_active' => 'boolean|boolean|default:1',
            'services' => 'nullable|array',
            'services.*' => 'exists:services,id',
        ];
    }

   public function messages(): array
    {
        return [
            'name.required' => 'Staff name is required.',
            'name.max' => 'Staff name cannot exceed 255 characters.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email address is already in use.',
            'phone.unique' => 'This phone number is already in use.',
            'branch_id.exists' => 'Selected branch does not exist.',
            'services.*.exists' => 'One or more selected services do not exist.',
        ];
    }
}
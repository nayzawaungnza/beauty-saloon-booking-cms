<?php

namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|max:' . config('constants.STRING_DEFAULT_MAX_LENGTH') . '|unique:roles,name,' . $this->route('role')->id,
            'permission' => 'required|array',
            'permission.*' => 'exists:permissions,id'
        ];
    }
    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Role name is required',
            'name.unique' => 'Role name already exists',
            'permission.required' => 'At least one permission must be selected',
            'permission.*.exists' => 'Selected permission does not exist'
        ];
    }
}
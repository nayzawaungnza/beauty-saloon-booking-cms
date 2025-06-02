<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;

class CreateServiceRequest extends FormRequest
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
            'slug' => 'nullable|string|max:255|unique:services,slug',
            'description' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'duration' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'requires_buffer' => 'required|boolean',
            'is_active' => 'sometimes|boolean',
            'is_promotion' => 'sometimes|boolean',
            'discount_price' => 'nullable|numeric|min:0|required_if:is_promotion,1',
            'service_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages()
    {
        return [
            'name.required' => 'Name is required',
            'name.max' => 'Name is too long',
            'slug.unique' => 'Slug must be unique',
            'duration.required' => 'Duration is required',
            'duration.integer' => 'Duration must be a number',
            'duration.min' => 'Duration must be at least 1',
            'price.required' => 'Price is required',
            'price.numeric' => 'Price must be a number',
            'price.min' => 'Price cannot be negative',
            'is_promotion.boolean' => 'Promotion status must be true or false',
            'discount_price.numeric' => 'Discount price must be a number',
            'discount_price.min' => 'Discount price cannot be negative',
            'discount_price.required_if' => 'Discount price is required when service is promotional',
            'requires_buffer.required' => 'Buffer requirement is required',
            'requires_buffer.boolean' => 'Buffer requirement must be true or false',
            'service_image.image' => 'Service image must be an image',
            'service_image.mimes' => 'Service image must be a jpeg, png, jpg, or webp file',
            'service_image.max' => 'Service image is too large',
            'gallery_images.*.image' => 'Each gallery image must be an image',
            'gallery_images.*.mimes' => 'Gallery images must be jpeg, png, jpg, or webp files',
            'gallery_images.*.max' => 'Each gallery image is too large',
        ];
    }
}
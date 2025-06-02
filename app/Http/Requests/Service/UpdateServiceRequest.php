<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
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
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:services,slug,' . $this->route('services'),
            'description' => 'sometimes|string',
            'excerpt' => 'sometimes|string',
            'duration' => 'sometimes|integer|min:1',
            'price' => 'sometimes|numeric|min:0',
            'is_promotion' => 'sometimes|boolean',
            'discount_price' => 'nullable|numeric|min:0|required_if:is_promotion,1',
            'requires_buffer' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
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
            'name.max' => 'Name is too long',
            'name.unique' => 'Name must be unique',
            'slug.unique' => 'Slug must be unique',
            'duration.integer' => 'Duration must be a number',
            'duration.min' => 'Duration must be at least 1',
            'price.numeric' => 'Price must be a number',
            'price.min' => 'Price cannot be negative',
            'is_promotion.boolean' => 'Promotion status must be true or false',
            'discount_price.numeric' => 'Discount price must be a number',
            'discount_price.min' => 'Discount price cannot be negative',
            'discount_price.required_if' => 'Discount price is required when service is promotional',
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
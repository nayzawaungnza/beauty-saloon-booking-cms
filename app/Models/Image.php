<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Image extends Model
{
    use HasFactory,Uuids,SoftDeletes;

    protected $fillable = [
        'resourceable_type',
        'resourceable_id',
        'image_url',
        'is_default',
        'is_banner',
        
    ];

    public function resourceable()
    {
        return $this->MorphTo();
        
    }

    /**
     * Get the full URL for the image
     */
    public function getFullUrlAttribute()
    {
        return asset('storage/' . $this->image_url);
    }

    /**
     * Scope to get only default images
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope to get only banner images
     */
    public function scopeBanner($query)
    {
        return $query->where('is_banner', true);
    }

    /**
     * Scope to get only gallery images (non-default, non-banner)
     */
    public function scopeGallery($query)
    {
        return $query->where('is_default', false)->where('is_banner', false);
    }
    
}
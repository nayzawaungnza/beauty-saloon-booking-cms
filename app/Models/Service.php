<?php

namespace App\Models;

use App\Models\Image;
use App\Traits\Uuids;
use App\Models\Booking;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    use HasFactory, Notifiable, Uuids, SoftDeletes, HasSlug;
    protected $fillable = [
        'name',
        'slug',
        'description',
        'duration',
        'price',
        'excerpt',
        'is_promotion',
        'discount_price',
        'requires_buffer',
        'is_active',
        'created_by',
        'updated_by',
        'branch_id'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_promotion' => 'boolean',
        'requires_buffer' => 'boolean',
    ];
   
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(['name']) // Generate slug from multiple fields
            ->saveSlugsTo('slug')
            ->slugsShouldBeNoLongerThan(50)
            ->doNotGenerateSlugsOnUpdate() // Limit the length of the slug
            ->usingSeparator('-'); // Use underscore as separator
    }

    public function staff(): BelongsToMany
    {
        return $this->belongsToMany(Staff::class, 'staff_service');
    }

    // Relationship: A Service can be part of many Bookings
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function default_image()
    {
        return $this->morphOne(Image::class, 'resourceable', 'resourceable_type', 'resourceable_id')
            ->where('is_default', config('constants.STATUS_TRUE'))->where('is_banner', config('constants.STATUS_FALSE'));
    }

    public function gallery_images()
    {
        return $this->morphMany(Image::class, 'resourceable', 'resourceable_type', 'resourceable_id')
            ->where('is_default', config('constants.STATUS_FALSE'))
            ->orderBy('id', 'asc');
    }
    
}
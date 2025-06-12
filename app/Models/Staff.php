<?php

namespace App\Models;

use App\Traits\Uuids;
use App\Models\Service;
use Spatie\Sluggable\HasSlug;
use App\Models\StaffAvailability;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Staff extends Model
{
    use Uuids, HasSlug, SoftDeletes, Notifiable, HasFactory;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'slug',
        'branch_id',
        'specialization',
        'description',
        'excerpt',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
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
    public function availability(): HasMany
    {
        return $this->hasMany(StaffAvailability::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    // Relationship: A Staff member can perform many Services (Many-to-Many)
    public function services(): BelongsToMany
    {
        // Assumes pivot table name 'staff_service' and default foreign keys
        return $this->belongsToMany(Service::class, 'staff_service');
    }
    public function schedules(): HasMany
    {
        return $this->hasMany(StaffSchedule::class, 'staff_id');
    }

    public function timeslots()
    {
        return $this->hasMany(Timeslot::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    public function scopeByBranch($query, $branchId)
    {
        return $query->where('branch_id', $branchId);
    }

    public function getFullNameAttribute(): string
    {
        return $this->name;
    }

    public function getServicesListAttribute(): string
    {
        return $this->services->pluck('name')->join(', ');
    }
    
}
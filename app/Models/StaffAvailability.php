<?php

namespace App\Models;

use Carbon\Carbon;
use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StaffAvailability extends Model
{

    use HasFactory, Notifiable, Uuids, SoftDeletes;
    protected $fillable = [
        'staff_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
        'effective_date',
        'expiry_date',
        'is_recurring',
        'recurrence_pattern',
        'recurrence_end_date',
        'priority',
        'notes',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'is_available' => 'boolean',
        'is_recurring' => 'boolean',
        'effective_date' => 'date',
        'expiry_date' => 'date',
        'recurrence_end_date' => 'date',
        'priority' => 'integer',
        'recurrence_pattern' => 'array',
    ];


    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    /**
     * Scope a query to only include active availabilities.
     */
    public function scopeActive(Builder $query): Builder
    {
        $today = Carbon::today();
        return $query->where('is_available', true)
            ->where(function ($q) use ($today) {
                $q->whereNull('effective_date')
                  ->orWhere('effective_date', '<=', $today);
            })
            ->where(function ($q) use ($today) {
                $q->whereNull('expiry_date')
                  ->orWhere('expiry_date', '>=', $today);
            });
    }

    /**
     * Scope a query to only include availabilities for a specific date.
     */
    public function scopeForDate(Builder $query, $date): Builder
    {
        $dateObj = Carbon::parse($date);
        $dayOfWeek = $dateObj->dayOfWeek;
        
        return $query->where('day_of_week', $dayOfWeek)
            ->where(function ($q) use ($dateObj) {
                $q->whereNull('effective_date')
                  ->orWhere('effective_date', '<=', $dateObj);
            })
            ->where(function ($q) use ($dateObj) {
                $q->whereNull('expiry_date')
                  ->orWhere('expiry_date', '>=', $dateObj);
            })
            ->where(function ($q) use ($dateObj) {
                // Handle recurring patterns
                $q->where('is_recurring', false)
                  ->orWhere(function ($subQ) use ($dateObj) {
                      $subQ->where('is_recurring', true)
                           ->where(function ($recQ) use ($dateObj) {
                               $recQ->whereNull('recurrence_end_date')
                                   ->orWhere('recurrence_end_date', '>=', $dateObj);
                           });
                  });
            })
            ->orderBy('priority', 'desc'); // Higher priority first
    }

    /**
     * Check if this availability is active for a specific date.
     */
    public function isActiveForDate($date): bool
    {
        $dateObj = Carbon::parse($date);
        
        // Check day of week
        if ($this->day_of_week !== $dateObj->dayOfWeek) {
            return false;
        }
        
        // Check effective date
        if ($this->effective_date && $dateObj->lt($this->effective_date)) {
            return false;
        }
        
        // Check expiry date
        if ($this->expiry_date && $dateObj->gt($this->expiry_date)) {
            return false;
        }
        
        // Check recurrence
        if ($this->is_recurring && $this->recurrence_end_date && $dateObj->gt($this->recurrence_end_date)) {
            return false;
        }
        
        // Check recurrence pattern if applicable
        if ($this->is_recurring && !empty($this->recurrence_pattern)) {
            // Example: Check if this is the nth occurrence of the day in the month
            $weekOfMonth = ceil($dateObj->day / 7);
            if (isset($this->recurrence_pattern['week_of_month']) && 
                !in_array($weekOfMonth, $this->recurrence_pattern['week_of_month'])) {
                return false;
            }
        }
        
        return $this->is_available;
    }

    /**
     * Get the duration in minutes.
     */
    public function getDurationInMinutes(): int
    {
        $start = Carbon::parse($this->start_time);
        $end = Carbon::parse($this->end_time);
        
        return $end->diffInMinutes($start);
    }

    /**
     * Format the start time.
     */
    public function getFormattedStartTimeAttribute(): string
    {
        return Carbon::parse($this->start_time)->format('g:i A');
    }

    /**
     * Format the end time.
     */
    public function getFormattedEndTimeAttribute(): string
    {
        return Carbon::parse($this->end_time)->format('g:i A');
    }

    /**
     * Get the day name.
     */
    public function getDayNameAttribute(): string
    {
        $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return $days[$this->day_of_week] ?? 'Unknown';
    }

    /**
     * Get the start time in H:i format for forms.
     */
    public function getStartTimeFormatAttribute(): string
    {
        return $this->start_time ? substr($this->start_time, 0, 5) : '';
    }

    /**
     * Get the end time in H:i format for forms.
     */
    public function getEndTimeFormatAttribute(): string
    {
        return $this->end_time ? substr($this->end_time, 0, 5) : '';
    }
}
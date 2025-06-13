<?php

namespace App\Models;

use App\Traits\Uuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StaffLeave extends Model
{
    use Uuids, SoftDeletes, Notifiable, HasFactory;
    protected $fillable = [
            'staff_id',
            'start_date',
            'end_date',
            'leave_type',
            'is_half_day',
            'is_full_day',
            'reason',
            'status',
            'created_by',
            'updated_by'
    ];
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_half_day' => 'boolean',
        'is_full_day' => 'boolean',
    ];

    //status constants
    const PENDING = 'pending';
    const APPROVED = 'approved';
    const REJECTED = 'rejected';

    public function scopePending($query)
    {
        return $query->where('status', self::PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::APPROVED);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', self::REJECTED);
    }

    public function scopeByStaff($query, $staffId)
    {
        return $query->where('staff_id', $staffId);
    }
    

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
    public function branch()
    {
        return $this->hasOneThrough(Branch::class, Staff::class, 'id', 'id', 'staff_id', 'branch_id');
    }

}
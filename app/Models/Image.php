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
}
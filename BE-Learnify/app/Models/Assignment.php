<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    protected $fillable = [
        'id',
        'week_id',
        'title',
        'description',
        'deadline',
    ];
}

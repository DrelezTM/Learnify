<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceRecord extends Model
{
    protected $fillable = [
        'id',
        'session_id',
        'user_id',
        'status',
        'checked_in_at',
        'notes',
    ];
}

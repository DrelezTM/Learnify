<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance_Record extends Model
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

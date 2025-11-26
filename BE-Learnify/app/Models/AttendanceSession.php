<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceSession extends Model
{
    protected $fillable = [
        'id',
        'course_id',
        'week_id',
        'title',
        'start_time',
        'end_time',
    ];
}

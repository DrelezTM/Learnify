<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceSession extends Model
{
    protected $table = 'attendance_sessions';  // paksa Laravel ke nama yang benar

    protected $fillable = [
        'course_id',
        'week_id',
        'title',
        'start_time',
        'end_time',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class AttendanceSession extends Model
{
    protected $guarded = ['id'];
    
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function course() {
        return $this->belongsTo(Course::class);
    }
    
    public function records() {
        return $this->hasMany(AttendanceRecord::class, 'session_id');
    }
    
    public function getCurrentUserRecordAttribute() {
        return $this->records()
                    ->where('user_id', Auth::id())
                    ->first();
    }
}
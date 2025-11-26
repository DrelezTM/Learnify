<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceRecord extends Model
{
    use HasFactory;

    protected $table = 'attendance_records';
    
    protected $fillable = [
        'session_id', 
        'user_id', 
        'status', 
        'checked_in_at', 
        'notes'
    ];

    protected $casts = [
        'checked_in_at' => 'datetime',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'id',
        'user_id',
        'status',
        'check_in',
    ];
}

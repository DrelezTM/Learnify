<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'id',
        'title',
        'description',
        'code',
        'enrollment_key',
        'lecturer_id',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment_Submission extends Model
{
    protected $fillable = [
        'id',
        'assignment_id',
        'user_id',
        'file_path',
        'submitted_at',
        'grade',
        'feedback',
    ];
}

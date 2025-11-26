<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LetterType extends Model
{
    protected $fillable = [
        'key',
        'name',
        'need_lecture_approval'
    ];
}


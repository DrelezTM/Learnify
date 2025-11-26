<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Letter extends Model
{
    protected $fillable = [
        'user_id',
        'letter_type_key',
        'reason',
        'data',
        'uploaded_file',
        'status',
        'result_file'
    ];

    protected $casts = [
        'data' => 'array',
    ];
}

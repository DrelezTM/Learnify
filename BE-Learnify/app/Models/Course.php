<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'title',
        'description',
        'code',
        'enrollment_key',
        'lecturer_id',
        'slug',
    ];

    public function weeks() {
        return $this->hasMany(Week::class);
    }
}

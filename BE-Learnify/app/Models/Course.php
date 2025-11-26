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

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'course_user');
    }

    public function weeks()
    {
        return $this->hasMany(Week::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Week extends Model
{
    protected $fillable = [
        'id',
        'course_id',
        'title',
        'author_id'
    ];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function materials() {
        return $this->hasMany(Material::class);
    }

    public function assignments() {
        return $this->hasMany(Assignment::class);
    }
}

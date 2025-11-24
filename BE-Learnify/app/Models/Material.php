<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'id',
        'week_id',
        'author_id',
        'title',
        'content',
    ];

    public function week() {
        return $this->belongsTo(Week::class);
    }

    public function files() {
        return $this->hasMany(MaterialFile::class);
    }
}

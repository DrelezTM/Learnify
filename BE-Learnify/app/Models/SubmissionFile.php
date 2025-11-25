<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubmissionFile extends Model
{
    protected $fillable = [
        'submission_id',
        'file_path',
    ];

    public function assignmentSubmission() {
        return $this->belongsTo(AssignmentSubmission::class, 'submission_id');
    }
}

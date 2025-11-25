<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    protected $table = 'assignment_submissions';

    protected $fillable = [
        'id',
        'week_id',
        'assignment_id',
        'user_id',
        'submitted_at',
    ];

    public function submissionFiles() {
        return $this->hasMany(SubmissionFile::class, 'submission_id');
    }
}

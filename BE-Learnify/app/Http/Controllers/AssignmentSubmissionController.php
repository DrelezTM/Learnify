<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use App\Models\SubmissionFile;
use App\Models\Week;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AssignmentSubmissionController extends Controller
{
    public function store(Request $request, $courseId, $weekId, $assignmentId) {
        $validator = Validator::make($request->all(), [
            'files' => 'array',
            'files.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx,zip|max:2048'
        ]);

        if ($validator->fails()) return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);

        $course = Course::where('id', $courseId)->first();
        if (!$course) return response()->json([
            'success' => false,
            'message' => 'Course not found.'
        ], 404);

        $week = Week::find($weekId);
        if (!$week) return response()->json([
            'success' => false,
            'message' => 'Invalid week ID provided.'
        ], 404);

        $assignment = Assignment::where('id', $assignmentId)->first();
        if (!$assignment) return response()->json([
            'success' => false,
            'message' => 'Invalid assignment ID provided.'
        ], 404);

        $createAssignmentSubmission = AssignmentSubmission::create([
            'week_id' => $weekId,
            'assignment_id' => $assignmentId,
            'user_id' => Auth::id(),
            'submitted_at' => now(),
        ]);

        if (!$createAssignmentSubmission) return response()->json([
            'success' => false,
            'errors' => 'Failed to create assignment. Please try again.'
        ], 500);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filename = $file->getClientOriginalName();
                $path = $file->store('submission', 'public');

                SubmissionFile::create([
                    'submission_id' => $createAssignmentSubmission->id,
                    'file_name' => $filename,
                    'file_path' => $path
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Assignment created successfully.',
            'data' => $createAssignmentSubmission
        ], 201);
    }

    public function destroy(Request $request, $courseId, $weekId, $id) {
        $course = Course::where('id', $courseId)->first();
        if (!$course) return response()->json([
            'success' => false,
            'message' => 'Course not found.'
        ], 404);

        $assignmentSubmission = AssignmentSubmission::where('id', $id)->first();
        if (!$assignmentSubmission) return response()->json([
            'success' => false,
            'message' => 'Invalid assignment submission ID provided.'
        ], 400);

        $assignmentFiles = SubmissionFile::where('submission_id', $id)->get();
        foreach ($assignmentFiles as $file) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
        }

        $assignmentSubmission->delete();

        return response()->json([
            'success' => true,
            'message' => 'Assignment Submission and its associated files have been deleted successfully.'
        ], 200);
    }
}

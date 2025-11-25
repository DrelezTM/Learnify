<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AssignmentFile;
use App\Models\Course;
use App\Models\Week;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AssignmentController extends Controller
{
    public function store(Request $request, $courseId, $weekId) {
        if (!$request->user()->tokenCan('role:lecturer') && !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ], 403);

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'string',
            'deadline' => 'required|date_format:Y-m-d H:i:s',
            'files' => 'array',
            'files.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx,zip|max:2048'
        ]);

        if ($validator->fails()) return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);

        $validate = $validator->validate();

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

        $createAssignment = Assignment::create([
            'week_id' => $weekId,
            'author_id' => Auth::id(),
            'title' => $validate['title'],
            'description' => $validate['description'] ?? '',
            'deadline' => $validate['deadline']
        ]);

        if (!$createAssignment) return response()->json([
            'success' => false,
            'errors' => 'Failed to create assignment. Please try again.'
        ], 500);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filename = $file->getClientOriginalName();
                $path = $file->store('assignments', 'public');

                AssignmentFile::create([
                    'assignment_id' => $createAssignment->id,
                    'file_name' => $filename,
                    'file_path' => $path
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Assignment created successfully.',
            'data' => $createAssignment
        ], 201);
    }

    public function destroy(Request $request, $courseId, $weekId, $id) {
        if (!$request->user()->tokenCan('role:lecturer') && !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ], 403);

        $course = Course::where('id', $courseId)->first();
        if (!$course) return response()->json([
            'success' => false,
            'message' => 'Course not found.'
        ], 404);

        $assignment = Assignment::where('week_id', $weekId)->where('id', $id)->first();
        if (!$assignment) return response()->json([
            'success' => false,
            'message' => 'Invalid week ID provided.'
        ], 400);

        $assignmentFiles = AssignmentFile::where('assignment_id', $id)->get();
        foreach ($assignmentFiles as $file) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
        }

        $assignment->delete();
        return response()->json([
            'success' => true,
            'message' => 'Assignment and its associated files have been deleted successfully.'
        ], 200);
    }

    public function show(Request $request, $courseId, $weekId, $id) {
        $course = Course::where('id', $courseId)->first();
        if (!$course) return response()->json([
            'success' => false,
            'message' => 'Course not found.'
        ], 404);

        $material = Assignment::with(['files', 'assignmentSubmissions.submissionFiles'])->where('week_id', $weekId)->where('id', $id)->first();
        if (!$material) return response()->json([
            'success' => false,
            'message' => 'Invalid week ID provided.'
        ], 400);

        return response()->json([
            'success' => true,
            'message' => 'Material details retrieved successfully',
            'data' => $material
        ], 200);
    }
}

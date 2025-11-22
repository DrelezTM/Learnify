<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Traits\MakeEnrollmentKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CoursesController extends Controller
{
    use MakeEnrollmentKey;

    public function index()
    {
        $classes = Course::all();

        return response()->json([
            'success' => true,
            'message' => 'List of courses retrieved successfully',
            'data' => $classes
        ], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function show($id)
    {
        $class = Course::find($id);

        if (! $class) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found',
                'data' => null
            ], 404)
                ->header('Access-Control-Allow-Origin', '*');
        }

        return response()->json([
            'success' => true,
            'message' => 'Course details retrieved successfully',
            'data' => $class
        ], 200)
            ->header('Access-Control-Allow-Origin', '*');
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'description' => 'string',
            'major' => 'required|string',
            'study_program' => 'required|string',
            'class' => 'required|string',
            'batch' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $validate = $validator->validate();

        $createCourse = Course::create([
            'title' => $validate['title'],
            'description' => $validate['description'] ?? null,
            'code' => strtoupper($validate['study_program']).'-'.strtoupper($validate['class']).'-'.strtoupper($validate['batch']),
            'slug' => strtolower(str_replace(' ', '-', $validate['title'])).'-'.strtolower($validate['study_program']).'-'.strtolower($validate['class']).'-'.strtolower($validate['batch']),
            'enrollment_key' => $this->generateEnrollmentKey(),
            'lecturer_id' => Auth::id()
        ]);

        if (!$createCourse) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create course',
                'data' => null
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully',
            'data' => $createCourse
        ], 201);
    }

    public function update(Request $request, $id) {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found',
                'data' => null
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string',
            'description' => 'sometimes|string|nullable',
            'study_program' => 'sometimes|required|string',
            'class' => 'sometimes|required|string',
            'batch' => 'sometimes|required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $course->update([
            'title' => $validated['title'] ?? $course->title,
            'description' => $validated['description'] ?? $course->description,
            'code' => strtoupper($validated['study_program'] ?? $course->study_program) . '-' . strtoupper($validated['class'] ?? $course->class) . '-' . strtoupper($validated['batch'] ?? $course->batch),
            'slug' => strtolower(str_replace(' ', '-', $validated['title'] ?? $course->title)) . '-' . strtolower($validated['study_program'] ?? $course->study_program) . '-' . strtolower($validated['class'] ?? $course->class) . '-' . strtolower($validated['batch'] ?? $course->batch),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully',
            'data' => $course
        ], 200);
    }

    public function destroy($id) {
        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found',
                'data' => null
            ], 404);
        }

        $course->delete();
        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully',
            'data' => null
        ], 200);
    }
}

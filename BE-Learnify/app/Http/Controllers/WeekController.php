<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Week;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WeekController extends Controller
{
    public function index()
    {
        $weeks = Week::all();

        return response()->json([
            'success' => true,
            'message' => 'Weeks retrieved successfully',
            'data' => $weeks
        ], 200);
    }

    public function store(Request $request, $id) {
        if (!$request->user()->tokenCan('role:lecturer') && !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ], 403);

        $validator = Validator::make($request->all(), [ 'title' => 'required' ]);

        if ($validator->fails()) return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);

        $validate = $validator->validate();

        $course = Course::where('id', $id)->first();
        if (!$course) return response()->json([
            'success' => false,
            'message' => 'Course not found.'
        ], 404);

        $createWeek = Week::create([
            'title' => $validate['title'],
            'course_id' => $id
        ]);

        if (!$createWeek) return response()->json([
            'success' => false,
            'errors' => 'Failed to create week. Please try again.'
        ], 500);

        return response()->json([
            'success' => true,
            'message' => 'Week created successfully.',
            'data' => $createWeek
        ], 201);
    }

    public function update(Request $request, $courseId, $id) {
        if (!$request->user()->tokenCan('role:lecturer') && !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ], 403);

        $validator = Validator::make($request->all(), [ 'title' => 'required' ]);

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

        $week = Week::where('id', $id)->first();
        if (!$week) return response()->json([
            'success' => false,
            'message' => 'Week not found.'
        ], 404);

        $updateWeek = $week->update([ 'title' => $validate['title'] ]);
        if (!$updateWeek) return response()->json([
            'success' => false,
            'errors' => 'Failed to update week. Please try again.'
        ], 500);

        return response()->json([
            'success' => true,
            'message' => 'Week updated successfully.'
        ], 201);
    }

    public function destroy(Request $request, $id) {
        if (!$request->user()->tokenCan('role:lecturer') && !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ], 403);
        
        $course = Course::find($id);

        if (!$course) return response()->json([
            'success' => false,
            'message' => 'Week not found',
            'data' => null
        ], 404);

        $course->delete();
        return response()->json([
            'success' => true,
            'message' => 'Week deleted successfully',
        ], 200);
    }
}

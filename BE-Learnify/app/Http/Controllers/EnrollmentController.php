<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EnrollmentController extends Controller
{
    public function enrollCourse(Request $request, $id) {
        if (!$request->user()->tokenCan('role:student') || !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ]);

        $validator = Validator::make($request->all(), [ 'enrollment_key' => 'required|string' ]);

        if ($validator->fails()) return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);

        $validate = $validator->validate();

        $enrollment = Course::where('enrollment_key', $validate['enrollment_key'])->where('id', $id)->first();
        if (!$enrollment) return response()->json([
            'success' => false,
            'message' => 'Invalid enrollment key.'
        ], 404);

        $enrollmentExist = Enrollment::where('user_id', Auth::id())->where('course_id', $enrollment->id)->first();
        if ($enrollmentExist) return response()->json([
            'success' => false,
            'message' => 'You are already enrolled in this course.'
        ], 409);

        $joinEnrollment = Enrollment::create([
            'user_id' => Auth::id(),
            'course_id' => $enrollment->id
        ]);

        if (!$joinEnrollment) return response()->json([
            'success' => false,
            'message' => 'Failed to enroll in the course. Please try again later.'
        ], 500);
        
        return response()->json([
            'success' => true,
            'message' => 'Successfully enrolled in the course.',
            'data'    => $enrollment
        ], 201);
    
    }

    public function unenrollCourse(Request $request, $id) {
        if (!$request->user()->tokenCan('role:student') || !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ]);

        $course = Course::find($id);

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found.'
            ], 404);
        }

        $enrollment = Enrollment::where('user_id', Auth::id())->where('course_id', $id)->first();

        if (!$enrollment) return response()->json([
            'success' => false,
            'message' => 'You are not enrolled in this course.'
        ], 404);

        if (!$enrollment->delete()) return response()->json([
            'success' => false,
            'message' => 'Unable to leave the course. Please try again later.'
        ], 500);
        
        return response()->json([
            'success' => true,
            'message' => 'You have successfully left the course.'
        ], 200);
    }

    public function getMyCourses(Request $request) {
        if (!$request->user()->tokenCan('role:student') || !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ]);

        $courses = Enrollment::with('course')->where('user_id', Auth::id())->get();

        return response()->json([
            'success' => true,
            'message' => 'Courses retrieved successfully.',
            'data' => $courses
        ], 200);
    }
}

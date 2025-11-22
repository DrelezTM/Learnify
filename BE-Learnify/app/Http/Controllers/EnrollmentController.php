<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index()
    {
        $enrollments = Enrollment::all();

        return response()->json([
            'success' => true,
            'message' => 'Enrollments retrieved successfully',
            'data' => $enrollments
        ], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function show($id)
    {
        $enrollment = Enrollment::find($id);

        if (! $enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'Enrollment not found',
                'data' => null
            ], 404)
                ->header('Access-Control-Allow-Origin', '*');
        }

        return response()->json([
            'success' => true,
            'message' => 'Enrollment retrieved successfully',
            'data' => $enrollment
        ], 200)
            ->header('Access-Control-Allow-Origin', '*');
    }
}

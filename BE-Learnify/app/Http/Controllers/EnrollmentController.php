<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index()
    {
        $enrollments = Enrollment::all();

        return response()->json($enrollments, 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function show($id)
    {
        $enrollments = Enrollment::find($id);

        if (! $enrollments) {
            return response()->json(['message' => 'Not found'], 404)
                ->header('Access-Control-Allow-Origin', '*');
        }

        return response()->json($enrollments, 200)
            ->header('Access-Control-Allow-Origin', '*');
    }
}

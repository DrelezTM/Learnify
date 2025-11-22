<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function index()
    {
        $enrollments = Enrollment::all();
        return response()->json($enrollments, 200);
    }

    public function show($id)
    {
        $enrollments = Enrollment::find($id);

        if (! $enrollments) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($enrollments, 200);
    }
}

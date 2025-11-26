<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
    public function index(Request $request)  {
        $course = Enrollment::with('course')->where('user_id', Auth::id())->get();
        return response()->json([
            'status' => true,
            'data' => $course
        ], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{
    public function getSchedule(Request $request)  {
        $validator = Validator::make($request->all(), [
            'month' => 'required',
            'year' => 'required'
        ]);

        if ($validator->fails()) return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);

        $validate = $validator->validate();
        $course = Enrollment::with(['course.weeks.assignments' => function ($q) use ($validate) {
            $q->whereMonth('deadline', $validate['month'])->whereYear('deadline', $validate['year']);
        }])->where('user_id', Auth::id())->whereHas('course.weeks.assignments', function ($q) use ($validate) {
            $q->whereMonth('deadline', $validate['month'])->whereYear('deadline', $validate['year']);
        })->get();

        return response()->json([
            'status' => true,
            'data' => $course
        ], 200);
    }
}

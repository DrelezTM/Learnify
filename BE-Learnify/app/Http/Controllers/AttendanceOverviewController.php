<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;
use Illuminate\Support\Facades\Auth;

class AttendanceOverviewController extends Controller
{
    public function today()
    {
        $today = now()->format('Y-m-d');

        $sessions = AttendanceSession::with([
            'course.lecturer',
        ])
        ->whereDate('date', $today)
        ->get();

        return response()->json([
            'success' => true,
            'message' => 'Attendance sessions for today',
            'data' => $sessions
        ]);
    }
}


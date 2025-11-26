<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use App\Models\Enrollment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $today = Carbon::today();

        $enrolledCourseIds = Enrollment::where('user_id', $user->id)
            ->pluck('course_id'); 

        $sessions = AttendanceSession::with(['course.lecturer', 'records' => function($q) use ($user) {
                $q->where('user_id', $user->id);
            }])
            ->whereIn('course_id', $enrolledCourseIds) 
            ->whereDate('start_time', $today)
            ->orderBy('start_time', 'asc')
            ->get()
            ->map(function ($session) {
                $myRecord = $session->records->first();
                $now = now();
                
                $isOpen = $now->between($session->start_time->subMinutes(15), $session->end_time);

                return [
                    'id' => $session->id,
                    'matkul' => $session->course->title,
                    'dosen' => $session->course->lecturer->name ?? 'Dosen',
                    'jam' => $session->start_time->format('H:i') . ' - ' . $session->end_time->format('H:i') . ' WIB',
                    'lokasi' => 'Kampus Utama', 
                    'jenisPertemuan' => $session->title,
                    'can_attend' => $isOpen,
                    'has_attended' => $myRecord ? true : false,
                    'status_text' => $myRecord ? strtoupper($myRecord->status) : null,
                ];
            });

        return response()->json([
            'date' => $today->translatedFormat('l, d F Y'),
            'sessions' => $sessions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['session_id' => 'required|exists:attendance_sessions,id']);

        $user = Auth::user();
        $session = AttendanceSession::findOrFail($request->session_id);

        $isEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $session->course_id)
            ->exists();

        if (!$isEnrolled) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak terdaftar pada mata kuliah ini.'
            ], 403);
        }

        if ($session->records()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Anda sudah absen.'], 409);
        }

        $status = now()->gt($session->start_time->addMinutes(15)) ? 'late' : 'present';

        AttendanceRecord::create([
            'session_id' => $session->id,
            'user_id' => $user->id,
            'status' => $status,
            'checked_in_at' => now(),
            'notes' => '-',
        ]);

        return response()->json(['message' => 'Absensi berhasil!']);
    }
}
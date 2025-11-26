<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use App\Models\AttendanceRecord;
use App\Models\Enrollment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Course;

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

    public function createSession(Request $request)
    {
        if (!$request->user()->tokenCan('role:lecturer') && !$request->user()->tokenCan('role:admin')) {
             return response()->json(['success' => false, 'message' => 'Unauthorized. Hanya Dosen yang dapat membuat sesi.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'course_id'  => 'required|exists:courses,id',
            'week_id'    => 'required|exists:weeks,id',
            'title'      => 'required|string|max:255',
            'start_time' => 'required|date_format:Y-m-d H:i:s',
            'end_time'   => 'required|date_format:Y-m-d H:i:s|after:start_time',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false, 
                'message' => 'Data sesi tidak valid.', 
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $course = Course::find($request->course_id);
            if ($course->lecturer_id !== Auth::id() && !$request->user()->tokenCan('role:admin')) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Anda bukan dosen pengampu mata kuliah ini.'
                ], 403);
            }

            $session = AttendanceSession::create([
                'course_id'  => $request->course_id,
                'week_id'    => $request->week_id,
                'title'      => $request->title,
                'start_time' => $request->start_time,
                'end_time'   => $request->end_time,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Sesi absensi berhasil dibuat.',
                'data'    => $session
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat sesi: ' . $e->getMessage()
            ], 500);
        }
    }
}
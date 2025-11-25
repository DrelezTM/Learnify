<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\AttendanceRecord;
use App\Models\AttendanceSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function today(Request $request)
    {
        $today = Carbon::now()->toDateString();
        $userId = $request->user() ? $request->user()->id : $request->user_id;

        $sessions = AttendanceSession::with(['course.lecturer'])
            ->whereDate('start_time', $today)
            ->get();

        $sessions->transform(function ($session) use ($userId) {
            $session->attendance_status = null;

            if ($userId) {
                $record = AttendanceRecord::where('session_id', $session->id)
                    ->where('user_id', $userId)
                    ->first();
                
                if ($record) {
                    $session->attendance_status = $record->status; 
                }
            }

            return $session;
        });

        return response()->json([
            'success' => true,
            'data' => $sessions
        ], 200);
    }

    public function hadir(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:attendance_sessions,id',
            'user_id'    => 'required|exists:users,id',
        ]);

        $existing = AttendanceRecord::where('session_id', $request->session_id)
            ->where('user_id', $request->user_id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan presensi (Status: ' . $existing->status . ')',
            ], 422);
        }

        $session = AttendanceSession::findOrFail($request->session_id);
        $now = Carbon::now(); 
        
        $startTime = Carbon::parse($session->start_time);
        $endTime   = Carbon::parse($session->end_time);
        $lateThreshold = $startTime->copy()->addMinutes(15); 

        if ($now->lessThan($startTime)) {
            return response()->json(['message' => 'Kelas belum dimulai.'], 422);
        } 
        elseif ($now->greaterThan($endTime)) {
            $status = 'absent';
            $message = 'Waktu habis. Anda tercatat sebagai Alpa.';
        } 
        elseif ($now->greaterThan($lateThreshold)) {
            $status = 'late';
            $message = 'Presensi berhasil (Terlambat).';
        } 
        else {
            $status = 'present';
            $message = 'Presensi berhasil.';
        }

        $record = AttendanceRecord::create([
            'session_id'     => $request->session_id,
            'user_id'        => $request->user_id,
            'status'         => $status, 
            'checked_in_at'  => $now,
            'notes'          => ''
        ]);

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $record
        ], 201);
    }
}
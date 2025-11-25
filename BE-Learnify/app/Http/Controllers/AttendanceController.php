<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\AttendanceRecord;
use App\Models\AttendanceSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Tambahkan ini

class AttendanceController extends Controller
{
    public function today(Request $request)
    {
        $today = Carbon::now()->toDateString();

        // 1. Ambil ID User yang sedang login (dari Token)
        // Pastikan route ini dilindungi middleware 'auth:sanctum' di api.php
        $userId = $request->user() ? $request->user()->id : null;
        
        // Jika user_id null (misal testing tanpa token), coba ambil dari request query (opsional)
        if (!$userId && $request->has('user_id')) {
            $userId = $request->user_id;
        }

        $sessions = AttendanceSession::with(['course.lecturer'])
            ->whereDate('start_time', $today)
            ->get();

        // 2. MODIFIKASI DATA: Cek apakah user sudah hadir di sesi ini?
        $sessions->transform(function ($session) use ($userId) {
            // Default belum hadir
            $session->is_attended = false;

            if ($userId) {
                // Cek ke tabel attendance_records
                $exists = AttendanceRecord::where('session_id', $session->id)
                    ->where('user_id', $userId)
                    ->exists();
                
                $session->is_attended = $exists;
            }

            return $session;
        });

        return response()->json([
            'success' => true,
            'message' => 'Today attendance sessions',
            'data' => $sessions
        ], 200);
    }

    public function hadir(Request $request)
    {
        // Validasi agar user tidak bisa absen 2x (Double check di backend)
        $validated = $request->validate([
            'session_id' => 'required|exists:attendance_sessions,id',
            'user_id'    => 'required|exists:users,id',
        ]);

        // Cek apakah sudah pernah absen sebelumnya?
        $exists = AttendanceRecord::where('session_id', $request->session_id)
            ->where('user_id', $request->user_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan presensi untuk sesi ini.',
            ], 422); // 422 Unprocessable Entity
        }

        $record = AttendanceRecord::create([
            'session_id'     => $request->session_id,
            'user_id'        => $request->user_id,
            'status'         => 'present',
            'checked_in_at'  => now(),
            'notes'          => ''
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Attendance recorded',
            'data' => $record
        ], 201);
    }
}
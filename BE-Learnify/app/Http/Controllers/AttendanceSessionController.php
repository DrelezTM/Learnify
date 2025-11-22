<?php

namespace App\Http\Controllers;

use App\Models\Attendance_Session;

class AttendanceSessionController extends Controller
{
    public function index()
    {
        $items = Attendance_Session::all();

        return response()->json([
            'success' => true,
            'message' => 'Attendance sessions retrieved successfully',
            'data' => $items
        ], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function show($id)
    {
        $item = Attendance_Session::find($id);

        if (! $item) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance session not found',
                'data' => null
            ], 404)
                ->header('Access-Control-Allow-Origin', '*');
        }

        return response()->json([
            'success' => true,
            'message' => 'Attendance session retrieved successfully',
            'data' => $item
        ], 200)
            ->header('Access-Control-Allow-Origin', '*');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSession;

class AttendanceSessionController extends Controller
{
    public function index()
    {
        $items = AttendanceSession::all();

        return response()->json([
            'success' => true,
            'message' => 'Attendance sessions retrieved successfully',
            'data' => $items
        ], 200);
    }

    public function show($id)
    {
        $item = AttendanceSession::find($id);

        if (! $item) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance session not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Attendance session retrieved successfully',
            'data' => $item
        ], 200);
    }
}

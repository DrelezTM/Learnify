<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;

class AttendanceRecordController extends Controller
{
    public function index()
    {
        $items = AttendanceRecord::all();

        return response()->json([
            'success' => true,
            'message' => 'Attendance records retrieved successfully',
            'data' => $items
        ], 200);
    }

    public function show($id)
    {
        $item = AttendanceRecord::find($id);

        if (! $item) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance record not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Attendance record retrieved successfully',
            'data' => $item
        ], 200);
    }
}

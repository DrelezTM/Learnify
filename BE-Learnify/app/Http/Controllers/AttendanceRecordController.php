<?php

namespace App\Http\Controllers;

use App\Models\Attendance_Record;

class AttendanceRecordController extends Controller
{
    public function index()
    {
        $items = Attendance_Record::all();

        return response()->json([
            'success' => true,
            'message' => 'Attendance records retrieved successfully',
            'data' => $items
        ], 200);
    }

    public function show($id)
    {
        $item = Attendance_Record::find($id);

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

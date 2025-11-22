<?php

namespace App\Http\Controllers;

use App\Models\Attendance_Record;

class AttendanceRecordController extends Controller
{
    public function index()
    {
        $items = Attendance_Record::all();
        return response()->json($items, 200);
    }

    public function show($id)
    {
        $item = Attendance_Record::find($id);

        if (! $item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($item, 200);
    }
}

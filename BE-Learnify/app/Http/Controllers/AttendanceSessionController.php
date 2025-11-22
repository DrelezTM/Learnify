<?php

namespace App\Http\Controllers;

use App\Models\Attendance_Session;

class AttendanceSessionController extends Controller
{
    public function index()
    {
        $items = Attendance_Session::all();
        return response()->json($items, 200);
    }

    public function show($id)
    {
        $item = Attendance_Session::find($id);

        if (! $item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($item, 200);
    }
}

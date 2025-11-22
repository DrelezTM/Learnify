<?php

namespace App\Http\Controllers;

use App\Models\Week;

class WeekController extends Controller
{
    public function index()
    {
        $weeks = Week::all();

        return response()->json([
            'success' => true,
            'message' => 'Weeks retrieved successfully',
            'data' => $weeks
        ], 200);
    }

    public function show($id)
    {
        $week = Week::find($id);

        if (! $week) {
            return response()->json([
                'success' => false,
                'message' => 'Week not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Week retrieved successfully',
            'data' => $week
        ], 200);
    }
}

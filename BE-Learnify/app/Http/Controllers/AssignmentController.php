<?php

namespace App\Http\Controllers;

use App\Models\Assignment;

class AssignmentController extends Controller
{
    public function index()
    {
        $items = Assignment::all();

        return response()->json([
            'success' => true,
            'message' => 'Assignments retrieved successfully',
            'data' => $items
        ], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function show($id)
    {
        $item = Assignment::find($id);

        if (! $item) {
            return response()->json([
                'success' => false,
                'message' => 'Assignment not found',
                'data' => null
            ], 404)
                ->header('Access-Control-Allow-Origin', '*');
        }

        return response()->json([
            'success' => true,
            'message' => 'Assignment retrieved successfully',
            'data' => $item
        ], 200)
            ->header('Access-Control-Allow-Origin', '*');
    }
}

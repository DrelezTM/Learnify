<?php

namespace App\Http\Controllers;

use App\Models\Assignment;

class AssignmentController extends Controller
{
    public function index()
    {
        $assignments = Assignment::all();

        return response()->json([
            'success' => true,
            'message' => 'Assignments retrieved successfully',
            'data' => $assignments
        ], 200);
    }

    public function show($id)
    {
        $assignments = Assignment::find($id);

        if (! $assignments) {
            return response()->json([
                'success' => false,
                'message' => 'Assignment not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Assignment retrieved successfully',
            'data' => $assignments
        ], 200);
    }
}

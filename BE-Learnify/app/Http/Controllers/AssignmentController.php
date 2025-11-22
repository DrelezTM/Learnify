<?php

namespace App\Http\Controllers;

use App\Models\Assignment;

class AssignmentController extends Controller
{
    public function index()
    {
        $assignments = Assignment::all();

        return response()->json($assignments, 200);
    }

    public function show($id)
    {
        $assignments = Assignment::find($id);

        if (! $assignments) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($assignments, 200);
    }
}

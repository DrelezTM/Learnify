<?php

namespace App\Http\Controllers;

use App\Models\Assignment_Submission;

class AssignmentSubmissionController extends Controller
{
    public function index()
    {
        $items = Assignment_Submission::all();
        return response()->json($items, 200);
    }

    public function show($id)
    {
        $item = Assignment_Submission::find($id);

        if (! $item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($item, 200);
    }
}

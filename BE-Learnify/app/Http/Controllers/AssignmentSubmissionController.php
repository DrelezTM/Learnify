<?php

namespace App\Http\Controllers;

use App\Models\Assignment_Submission;

class AssignmentSubmissionController extends Controller
{
    public function index()
    {
        $items = Assignment_Submission::all();

        return response()->json([
            'success' => true,
            'message' => 'Assignment submissions retrieved successfully',
            'data' => []
        ], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function show($id)
    {
        $item = Assignment_Submission::find($id);

        if (! $item) {
            return response()->json([
                'success' => false,
                'message' => 'Assignment submission not found',
                'data' => null
            ], 404)
                ->header('Access-Control-Allow-Origin', '*');
        }

        return response()->json([
            'success' => true,
            'message' => 'Assignment submission retrieved successfully',
            'data' => $item
        ], 200)
            ->header('Access-Control-Allow-Origin', '*');
    }
}

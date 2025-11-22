<?php

namespace App\Http\Controllers;

use App\Models\Course;

class CourseController extends Controller
{
    public function index()
    {
        $items = Course::all();
        return response()->json($items, 200);
    }

    public function show($id)
    {
        $item = Course::find($id);

        if (! $item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($item, 200);
    }
}

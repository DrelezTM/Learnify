<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CoursesController extends Controller
{
    public function index()
    {
        $classes = Course::all();
        return response()->json($classes, 200);
    }

    public function show($id)
    {
        $class = Course::find($id);

        if (! $class) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($class, 200);
    }
}

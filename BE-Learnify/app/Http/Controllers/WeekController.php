<?php

namespace App\Http\Controllers;

use App\Models\Week;

class WeekController extends Controller
{
    public function index()
    {
        $items = Week::all();
        return response()->json($items, 200);
    }

    public function show($id)
    {
        $item = Week::find($id);

        if (! $item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($item, 200);
    }
}

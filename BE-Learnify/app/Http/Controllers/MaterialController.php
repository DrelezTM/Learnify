<?php

namespace App\Http\Controllers;

use App\Models\Material;

class MaterialController extends Controller
{
    public function index()
    {
        $items = Material::all();
        return response()->json($items, 200);
    }

    public function show($id)
    {
        $item = Material::find($id);

        if (! $item) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($item, 200);
    }
}

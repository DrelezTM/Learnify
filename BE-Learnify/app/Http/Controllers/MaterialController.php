<?php

namespace App\Http\Controllers;

use App\Models\Material;

class MaterialController extends Controller
{
    public function index()
    {
        $items = Material::all();

        return response()->json($items, 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function show($id)
    {
        $item = Material::find($id);

        if (! $item) {
            return response()->json(['message' => 'Not found'], 404)
                ->header('Access-Control-Allow-Origin', '*');
        }

        return response()->json($item, 200)
            ->header('Access-Control-Allow-Origin', '*');
    }
}

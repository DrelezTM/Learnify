<?php

namespace App\Http\Controllers;

use App\Models\Material;

class MaterialController extends Controller
{
    public function index()
    {
        $materials = Material::all();

        return response()->json([
            'success' => true,
            'message' => 'Materials retrieved successfully',
            'data' => $materials
        ], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function show($id)
    {
        $material = Material::find($id);

        if (! $material) {
            return response()->json([
                'success' => false,
                'message' => 'Material not found',
                'data' => null
            ], 404)
                ->header('Access-Control-Allow-Origin', '*');
        }

        return response()->json([
            'success' => true,
            'message' => 'Material retrieved successfully',
            'data' => $material
        ], 200)
            ->header('Access-Control-Allow-Origin', '*');
    }
}

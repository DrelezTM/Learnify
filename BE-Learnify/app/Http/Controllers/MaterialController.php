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
        ], 200);
    }

    public function show($id)
    {
        $material = Material::find($id);

        if (! $material) {
            return response()->json([
                'success' => false,
                'message' => 'Material not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Material retrieved successfully',
            'data' => $material
        ], 200);
    }
}

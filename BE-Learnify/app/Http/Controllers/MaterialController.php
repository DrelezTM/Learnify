<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\MaterialFile;
use App\Models\Week;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MaterialController extends Controller
{
    public function store(Request $request, $courseId, $weekId) {
        if (!$request->user()->tokenCan('role:lecturer') && !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ], 403);

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'content' => 'string',
            'files' => 'array',
            'files.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx,zip|max:2048'
        ]);

        if ($validator->fails()) return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);

        $validate = $validator->validate();

        $week = Week::find($weekId);
        if (!$week) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid week ID provided.'
            ], 400);
        }

        $createMaterials = Material::create([
            'week_id' => $weekId,
            'author_id' => Auth::id(),
            'title' => $validate['title'],
            'content' => $validate['content'] ?? ''
        ]);

        if (!$createMaterials) return response()->json([
            'success' => false,
            'errors' => 'Failed to create material. Please try again.'
        ], 500);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('materials', 'public');

                MaterialFile::create([
                    'material_id' => $createMaterials->id,
                    'file_path' => $path
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Material created successfully.',
            'data' => $createMaterials
        ], 201);
    }

    public function destroy(Request $request, $courseId, $weekId, $id) {
        if (!$request->user()->tokenCan('role:lecturer') && !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ], 403);

        $material = Material::where('week_id', $weekId)->where('id', $id)->first();
        $materialFiles = MaterialFile::where('material_id', $id)->get();
        foreach ($materialFiles as $file) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
        }

        $material->delete();

        return response()->json([
            'success' => true,
            'message' => 'Material and its associated files have been deleted successfully.'
        ], 200);
    }
}

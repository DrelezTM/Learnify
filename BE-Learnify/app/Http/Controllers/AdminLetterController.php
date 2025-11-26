<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\LetterLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class AdminLetterController extends Controller
{
    public function index()
    {
        return Letter::all();
    }

    public function show($id)
    {
        return Letter::findOrFail($id);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $letter = Letter::findOrFail($id);

        $letter->status = $request->status;
        $letter->save();

        return response()->json(['message' => 'Status updated']);
    }

    public function uploadResult(Request $request, $id)
    {
        $request->validate([
            'result_file' => 'required|file|max:2048'
        ]);

        $letter = Letter::findOrFail($id);

        $file = $request->file('result_file')->store('letters/results', 'public');

        $letter->result_file = $file;
        $letter->save();

        return response()->json(['message' => 'Result uploaded']);
    }
}


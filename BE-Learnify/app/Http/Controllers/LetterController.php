<?php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\LetterType;
use App\Models\LetterLog;
use App\Models\LectureApproval;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class LetterController extends Controller
{
    public function index()
    {
        return Letter::where('user_id', auth()->id())->get();
    }

    public function show($id)
    {
        return Letter::where('user_id', auth()->id())->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            
            'letter_type' => 'required|string',
            'reason' => 'nullable|string',
            'data' => 'nullable|array',
            'uploaded_file' => 'nullable|file|max:2048'
        ]);

       
        $type = LetterType::where('key', $request->letter_type)->first();

        
        $file = null;
        if ($request->hasFile('uploaded_file')) {
            $file = $request->file('uploaded_file')->store('letters/uploads', 'public');
        }

      
        $needApproval = $type ? $type->need_lecture_approval : 0;

        
        $letter = Letter::create([
            'user_id' => auth()->id(),
            'letter_type_key' => $request->letter_type,
            'reason' => $request->reason,
            'data' => $request->data,
            'uploaded_file' => $file,
            'status' => $needApproval ? 'waiting_lecture' : 'pending'
        ]);

        return response()->json([
            'message' => 'Letter created successfully',
            'data' => $letter
        ], 201);
    }
}

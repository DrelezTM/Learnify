<?php

namespace App\Http\Controllers;

use App\Models\LectureApproval;
use App\Models\Letter;
use App\Models\LetterLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LectureApprovalController extends Controller
{
    public function index()
    {
        return Letter::where('status', 'waiting_lecture')->get();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);

        $letter = Letter::findOrFail($id);

        if ($letter->status !== 'waiting_lecture') {
            return response()->json(['message' => 'Not eligible'], 400);
        }

        $letter->status = $request->status;
        $letter->save();

        return response()->json(['message' => 'Status updated']);
    }
}


<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json($users, 200);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($user, 200);
    }
}

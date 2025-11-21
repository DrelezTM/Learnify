<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();

        return response()->json($users, 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    public function show($id)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json(['message' => 'Not found'], 404)
                ->header('Access-Control-Allow-Origin', '*');
        }

        return response()->json($user, 200)
            ->header('Access-Control-Allow-Origin', '*');
    }
}

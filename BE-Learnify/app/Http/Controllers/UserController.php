<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->tokenCan('role:lecturer') && !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ], 403);

        $users = User::all();

        return response()->json([
            'success' => true,
            'message' => 'Users retrieved successfully',
            'data' => $users
        ], 200);
    }

    public function show(Request $request, $id)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'User retrieved successfully',
            'data' => $user
        ], 200);
    }

    public function register(Request $request) {
        if (!$request->user()->tokenCan('role:lecturer') && !$request->user()->tokenCan('role:admin')) return response()->json([
            'success' => false,
            'message' => 'Unauthorized. You do not have the required role to access this resource.'
        ], 403);

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|unique:users,email',
            'role' => 'required|in:admin,dosen,mahasiswa',
            'major' => 'required|string',
            'study_program' => 'required|string',
            'class' => 'required|string',
            'batch' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $validate = $validator->validate();

        $createUser = User::create([
            'name' => $validate['name'],
            'email' => $validate['email'],
            'role' => $validate['role'],
            'major' => $validate['major'],
            'study_program' => $validate['study_program'],
            'class' => $validate['class'],
            'batch' => $validate['batch'],
            'password' => Hash::make($validate['password']),
        ]);

        if (!$createUser) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'data' => null
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $createUser
        ], 201);
    }

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $validate = $validator->validate();

        $checkUser = User::where('email', $validate['email'])->first();
        if (!$checkUser || !Hash::check($validate['password'], $checkUser->password)) {
            return response()->json([
                'success' => false,
                'message' => 'User does not exist',
                'data' => null
            ], 404);
        }

        if ($checkUser->role == "lecturer") {
            $token = $checkUser->createToken('AuthToken', ['role:lecturer'])->plainTextToken;
            return response()->json([
                'success' => true,
                'message' => 'User successfully logged in',
                'data' => [
                    'user' => $checkUser,
                    'token' => $token
                ]
            ], 200);
        } else if ($checkUser->role == "admin") {
            $token = $checkUser->createToken('AuthToken', ['role:admin'])->plainTextToken;
            return response()->json([
                'success' => true,
                'message' => 'User successfully logged in',
                'data' => [
                    'user' => $checkUser,
                    'token' => $token
                ]
            ], 200);
        } else {
            $token = $checkUser->createToken('AuthToken', ['role:student'])->plainTextToken;
            return response()->json([
                'success' => true,
                'message' => 'User successfully logged in',
                'data' => [
                    'user' => $checkUser,
                    'token' => $token
                ]
            ], 200);
        }

    }

    public function logout(Request $request) {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'User successfully logged out',
        ], 200);
    }
}

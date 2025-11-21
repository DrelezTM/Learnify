<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClassesController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/classes', [ClassesController::class, 'index']);
Route::get('/api/classes/{id}', [ClassesController::class, 'show']);

Route::get('/api/enrollments', [EnrollmentController::class, 'index']);
Route::get('/api/enrollments/{id}', [EnrollmentController::class, 'show']);

Route::get('/api/attendances', [AttendanceController::class, 'index']);
Route::get('/api/attendances/{id}', [AttendanceController::class, 'show']);

Route::get('/api/users', [UserController::class, 'index']);
Route::get('/api/users/{id}', [UserController::class, 'show']);

Route::get('/classes/create', [ClassesController::class, 'create'])->name('classes.create');
Route::post('/classes', [ClassesController::class, 'store'])->name('classes.store');


<?php

use App\Http\Controllers\CoursesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WeekController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AssignmentSubmissionController;
use App\Http\Controllers\AttendanceSessionController;
use App\Http\Controllers\AttendanceRecordController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function() {
    // Auth
    Route::post('/login', [ UserController::class, 'login' ]);
    Route::post('/register', [ UserController::class, 'register' ]);
    Route::delete('/logout', [ UserController::class, 'logout' ])->middleware('auth:sanctum');

    // Courses
    Route::resource('/courses', CoursesController::class)
        ->except(['create', 'edit' ])
        ->middleware('auth:sanctum');

    // Weeks
    Route::resource('/weeks', WeekController::class);

    // Materials
    Route::resource('/materials', MaterialController::class);

    // Assignments
    Route::resource('/assignments', AssignmentController::class);
    Route::resource('/assignments/submissions', AssignmentSubmissionController::class);

    // Attendances
    Route::resource('/attendances/sessions', AttendanceSessionController::class);
    Route::resource('/attendances/records', AttendanceRecordController::class);
});




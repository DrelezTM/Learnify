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

Route::post('/api/users', [ UserController::class, 'store' ]);

Route::prefix('api')->group(function() {
    Route::resource('/courses', CoursesController::class)
        ->except(['create', 'edit' ])
        ->middleware('auth:sanctum');

    Route::resource('/weeks', WeekController::class);

    Route::resource('/materials', MaterialController::class);

    Route::resource('/assignments', AssignmentController::class);
    Route::resource('/assignment/submissions', AssignmentSubmissionController::class);

    Route::resource('/attendance/sessions', AttendanceSessionController::class);
    Route::resource('/attendance/records', AttendanceRecordController::class);
});




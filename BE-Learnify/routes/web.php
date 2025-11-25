<?php

use App\Http\Controllers\CoursesController;
use App\Http\Controllers\EnrollmentController;
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
    Route::post('/login', [ UserController::class, 'login' ]);
    Route::post('/register', [ UserController::class, 'register' ])->middleware('auth:sanctum');
    Route::delete('/logout', [ UserController::class, 'logout' ])->middleware('auth:sanctum');
    Route::get('/me', [ UserController::class, 'me' ])->middleware('auth:sanctum');
    Route::get('/user/show/{id}', [ UserController::class, 'show' ])->middleware('auth:sanctum');

    Route::post('/courses/{id}/join', [ EnrollmentController::class, 'enrollCourse' ])->middleware('auth:sanctum');
    Route::delete('/courses/{id}/leave', [ EnrollmentController::class, 'unenrollCourse' ])->middleware('auth:sanctum');
    Route::get('/courses/me', [ EnrollmentController::class, 'getMyCourses' ])->middleware('auth:sanctum');
    Route::resource('/courses', CoursesController::class)
        ->except(['create', 'edit' ])
        ->middleware('auth:sanctum');
    Route::resource('/courses/{courseId}/weeks', WeekController::class)->only(['store', 'update', 'destroy'])->middleware('auth:sanctum');
    Route::resource('/courses/{courseId}/weeks/{weekId}/materials', MaterialController::class)->middleware('auth:sanctum');

    // Assignments
    Route::resource('/assignments', AssignmentController::class);
    Route::resource('/assignments/submissions', AssignmentSubmissionController::class);

    // Attendances
    Route::resource('/attendances/sessions', AttendanceSessionController::class);
    Route::resource('/attendances/records', AttendanceRecordController::class);
});




<?php

use App\Http\Controllers\CoursesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
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

Route::get('/api/classes', [CoursesController::class, 'index']);
Route::get('/api/classes/{id}', [CoursesController::class, 'show']);

Route::get('/api/courses', [CourseController::class, 'index']);
Route::get('/api/courses/{id}', [CourseController::class, 'show']);

Route::get('/api/weeks', [WeekController::class, 'index']);
Route::get('/api/weeks/{id}', [WeekController::class, 'show']);

Route::get('/api/materials', [MaterialController::class, 'index']);
Route::get('/api/materials/{id}', [MaterialController::class, 'show']);

Route::get('/api/assignments', [AssignmentController::class, 'index']);
Route::get('/api/assignments/{id}', [AssignmentController::class, 'show']);

Route::get('/api/assignment-submissions', [AssignmentSubmissionController::class, 'index']);
Route::get('/api/assignment-submissions/{id}', [AssignmentSubmissionController::class, 'show']);

Route::get('/api/attendance-sessions', [AttendanceSessionController::class, 'index']);
Route::get('/api/attendance-sessions/{id}', [AttendanceSessionController::class, 'show']);

Route::get('/api/attendance-records', [AttendanceRecordController::class, 'index']);
Route::get('/api/attendance-records/{id}', [AttendanceRecordController::class, 'show']);



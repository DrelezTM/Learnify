<?php

use App\Http\Controllers\CoursesController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WeekController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AssignmentSubmissionController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AttendanceSessionController;
use App\Http\Controllers\AttendanceRecordController;
use App\Http\Controllers\LectureApprovalController;
use App\Http\Controllers\AdminLetterController;
use App\Http\Controllers\LetterController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function() {
    Route::post('/login', [ UserController::class, 'login' ]);
    Route::delete('/logout', [ UserController::class, 'logout' ])->middleware('auth:sanctum');
    Route::get('/me', [ UserController::class, 'me' ])->middleware('auth:sanctum');
    Route::get('/user/show/{id}', [ UserController::class, 'show' ])->middleware('auth:sanctum');

    Route::get('/attendance/today', [AttendanceController::class, 'index'])->middleware('auth:sanctum');
    Route::post('/attendance/session', [AttendanceController::class, 'createSession'])->middleware('auth:sanctum');
    Route::post('/attendance', [AttendanceController::class, 'store'])->middleware('auth:sanctum');

    Route::post('/courses/join', [ EnrollmentController::class, 'enrollCourse' ])->middleware('auth:sanctum');
    Route::delete('/courses/{id}/leave', [ EnrollmentController::class, 'unenrollCourse' ])->middleware('auth:sanctum');
    Route::get('/courses/me', [ EnrollmentController::class, 'getMyCourses' ])->middleware('auth:sanctum');

    Route::resource('/courses', CoursesController::class)
        ->except(['create', 'edit' ])
        ->middleware('auth:sanctum');

    Route::resource('/courses/{courseId}/weeks', WeekController::class)->only(['store', 'update', 'destroy'])->middleware('auth:sanctum');
    Route::resource('/courses/{courseId}/weeks/{weekId}/materials', MaterialController::class)->middleware('auth:sanctum')->only(['store', 'destroy', 'show']);
    
    Route::resource('/courses/{courseId}/weeks/{weekId}/assignments', AssignmentController::class)->only(['store', 'destroy', 'show'])->middleware('auth:sanctum');
    Route::resource('/courses/{courseId}/weeks/{weekId}/assignments/{assignmentId}/submissions', AssignmentSubmissionController::class)->middleware('auth:sanctum');

    Route::get('/schedules', [ ScheduleController::class, 'getSchedule' ])->middleware('auth:sanctum');

    // Attendances
    Route::resource('/attendances/sessions', AttendanceSessionController::class);
    Route::resource('/attendances/records', AttendanceRecordController::class);

    //letter
    Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
        Route::post('/letters', [LetterController::class, 'store']);
        Route::get('/letters', [LetterController::class, 'index']);
        Route::get('/letters/{id}', [LetterController::class, 'show']);
    });

    Route::middleware(['auth:sanctum', 'role:lecturer'])->group(function () {
        Route::get('/lecture/approvals', [LectureApprovalController::class, 'index']);
        Route::put('/lecture/approvals/{id}', [LectureApprovalController::class, 'update']);
    });

    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::get('/admin/letters', [AdminLetterController::class, 'index']);
        Route::get('/admin/letters/{id}', [AdminLetterController::class, 'show']);
        Route::post('/admin/letters/{id}/status', [AdminLetterController::class, 'updateStatus']);
        Route::post('/admin/letters/{id}/upload', [AdminLetterController::class, 'uploadResult']);
    });

    
});




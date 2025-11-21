<?php

use App\Http\Controllers\CoursesController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/classes', [CoursesController::class, 'index']);
Route::get('/api/classes/{id}', [CoursesController::class, 'show']);



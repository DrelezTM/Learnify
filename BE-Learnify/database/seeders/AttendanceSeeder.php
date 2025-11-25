<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $courseId = DB::table('courses')->insertGetId([
            'title' => 'Pemrograman Lanjut',
            'description' => 'Materi OOP, MVC dan Laravel',
            'slug' => 'pemrograman-lanjut',
            'code' => 'IF304',
            'enrollment_key' => 'abc123',
            'lecturer_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $weekId = DB::table('weeks')->insertGetId([
            'course_id' => $courseId,
            'author_id' => 1,
            'title' => 'Minggu 1',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $today = Carbon::now()->format('Y-m-d');

        DB::table('attendance_sessions')->insert([
            'course_id' => $courseId,
            'week_id'   => $weekId,
            'title'     => 'Pertemuan 1 - Pengenalan Laravel',
            'start_time' => $today . ' 08:00:00',
            'end_time'   => $today . ' 09:40:00',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('attendance_sessions')->insert([
            'course_id' => $courseId,
            'week_id'   => $weekId,
            'title'     => 'Pertemuan 1 - Praktikum Blade & Routing',
            'start_time' => $today . ' 10:00:00',
            'end_time'   => $today . ' 11:40:00',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}

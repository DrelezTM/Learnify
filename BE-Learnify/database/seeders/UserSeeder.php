<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // lecturer
        User::create([
            'id' => 2,
            'name' => 'lecture',
            'email' => 'lecture@gmail.com',
            'role' => 'lecturer',
            'password' => Hash::make('Lecture#123')
        ]);

        // student
        User::create([
            'id' => 3,
            'name' => 'student',
            'email' => 'student@gmail.com',
            'role' => 'student',
            'password' => Hash::make('Student#123')
        ]);
    }
}

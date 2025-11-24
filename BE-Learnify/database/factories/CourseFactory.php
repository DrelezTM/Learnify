<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(3);

        return [
            'title' => $title,
            'description' => $this->faker->paragraph(),
            'code' => strtoupper($this->faker->lexify('??')) . '-' . rand(1, 9) . '-' . rand(2020, 2025),
            'enrollment_key' => Str::upper(Str::random(8)),
            'lecturer_id' => 1,  // ID user dosen (atau random),
            'slug' => Str::slug($title) . '-' . $this->faker->lexify('??'),
        ];

    }
}

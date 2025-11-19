<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $gender = $this->faker->randomElement(['Male', 'Female']);

        return [
            'nis' => strtoupper($this->faker->unique()->bothify('NIS-####')),
            'name' => $this->faker->name($gender === 'Male' ? 'male' : 'female'),
            'gender' => $gender,
            'age' => $this->faker->numberBetween(7, 18),
            'lembaga_id' => \App\Models\Lembaga::factory(),
            'teacher_id' => null,
        ];
    }
}

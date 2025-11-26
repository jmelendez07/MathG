<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::truncate();
        
        $admin = User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@gamepa.com',
        ]);
        $admin->assignRole('administrador');

        $students = User::factory(514)->create();
        foreach ($students as $student) {
            $student->assignRole('estudiante');
        }

        $teachers = User::factory(106)->create();
        foreach ($teachers as $teacher) {
            $teacher->assignRole('docente');
        }
    }
}

<?php

namespace Database\Factories;

use App\Models\Exercise;
use App\Models\Hero;
use App\Models\Level;
use App\Models\Planet;
use App\Models\Stage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Fecha de registro aleatoria en los últimos 12 meses
        $createdAt = Carbon::now()->subMonths(rand(0, 12))->subDays(rand(0, 30));
        
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => $createdAt->copy()->addMinutes(rand(0, 60)),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function configure()
    {
        return $this->afterCreating(function (User $user) {
            $userCreatedAt = Carbon::parse($user->created_at);
            $currentTime = $userCreatedAt->copy();

            $allLevels = Level::all();
            $randomLevel = $allLevels->random();

            // Si es el primer nivel (order: 1), asignar progress_bar entre 0 y 40
            if ($randomLevel->order == 1) {
                $progressBar = rand(0, 40);
                $randomXp = 0;
            } else {
                $randomXp = rand(1, max($randomLevel->xp_required - 1, 1));
                $progressBar = $randomLevel->xp_required > 0
                    ? ($randomXp / $randomLevel->xp_required) * 100
                    : 0;
            }

            $profile = $user->profile()->create([
                'level_id' => $randomLevel->id,
                'avatar_url' => asset('https://res.cloudinary.com/dvibz13t8/image/upload/v1759418515/avatar_ldk2rr.png'),
                'progress_bar' => $progressBar,
                'total_xp' =>  $randomXp,
                'avatar_frame_url' => asset('https://res.cloudinary.com/dvibz13t8/image/upload/v1759413505/marco_M_hyzhg3.png'),
                'created_at' => $currentTime,
                'updated_at' => $currentTime,
            ]);

            $allHeroes = Hero::all();
            $randomHeroes = $allHeroes->random(rand(1, min(40, $allHeroes->count())));

            foreach ($randomHeroes as $hero) {
                // Avanzar tiempo aleatoriamente (entre 1 hora y 3 días)
                $currentTime->addHours(rand(1, 72));
                
                $user->heroes()->create([
                    'hero_id' => $hero->id,
                    'created_at' => $currentTime->copy(),
                    'updated_at' => $currentTime->copy(),
                ]);
            }

            $allPlanets = Planet::all();
            $ramdomNumberPlanets = rand(1, $allPlanets->count());

            for ($i = 0; $i < $ramdomNumberPlanets; $i++) {
                $planet = $allPlanets[$i];
                
                // Avanzar tiempo para desbloquear planeta (1-5 días)
                $currentTime->addDays(rand(1, 5));
                
                $profile->unlockedPlanets()->create([
                    'planet_id' => $planet->id,
                    'created_at' => $currentTime->copy(),
                    'updated_at' => $currentTime->copy(),
                ]);

                $planetStages = $planet->stages;

                foreach ($planetStages as $stage) {
                    // Avanzar tiempo para cada stage (6 horas a 2 días)
                    $currentTime->addHours(rand(6, 48));
                    
                    $profile->unlockedStages()->create([
                        'stage_id' => $stage->id,
                        'created_at' => $currentTime->copy(),
                        'updated_at' => $currentTime->copy(),
                    ]);
                    
                    $stageMissions = $stage->missions;
                    foreach ($stageMissions as $mission) {
                        if (rand(0, 1) === 1) {
                            // Avanzar tiempo para cada misión (1-12 horas)
                            $currentTime->addHours(rand(1, 12));
                            
                            $profile->completedMissions()->create([
                                'mission_id' => $mission->id,
                                'created_at' => $currentTime->copy(),
                                'updated_at' => $currentTime->copy(),
                            ]);
                        }
                    }
                }
            }

            $this->makeExercisesInteraccions($user, $currentTime);
        });
    }

    public function makeExercisesInteraccions($user, $currentTime)
    {
        $allExercises = Exercise::all();
        $totalXp = $user->profile->total_xp;

        // Calcular cuántos ejercicios ha completado basado en: 5 ejercicios = 30 XP
        $xpPerExercise = 6; // 30 XP / 5 ejercicios = 6 XP promedio por ejercicio
        $estimatedCompletedExercises = (int)($totalXp / $xpPerExercise);

        // Determinar rangos basados en el XP total
        if ($totalXp <= 30) { // 0-5 ejercicios completados
            $minAttempts = 1;
            $maxAttempts = 2;
            $numberOfExercises = min(rand(1, 5), $allExercises->count());
        } elseif ($totalXp <= 300) { // 5-50 ejercicios completados
            $minAttempts = 1;
            $maxAttempts = 5;
            $numberOfExercises = min(rand(5, 30), $allExercises->count());
        } elseif ($totalXp <= 3000) { // 50-500 ejercicios completados
            $minAttempts = 2;
            $maxAttempts = 20;
            $numberOfExercises = min(rand(30, 100), $allExercises->count());
        } elseif ($totalXp <= 30000) { // 500-5000 ejercicios completados
            $minAttempts = 10;
            $maxAttempts = 100;
            $numberOfExercises = min(rand(100, 300), $allExercises->count());
        } else { // Más de 5000 ejercicios completados
            $minAttempts = 50;
            $maxAttempts = 500;
            $numberOfExercises = $allExercises->count();
        }

        // Seleccionar ejercicios aleatorios
        $selectedExercises = $allExercises->random(min($numberOfExercises, $allExercises->count()));

        $remainingExercisesToComplete = $estimatedCompletedExercises;

        foreach ($selectedExercises as $exercise) {
            if ($remainingExercisesToComplete <= 0) break;

            // Calcular intentos para este ejercicio
            $attempts = rand($minAttempts, min($maxAttempts, max(1, (int)($remainingExercisesToComplete / count($selectedExercises)))));
            $attempts = max(1, $attempts); // Mínimo 1 intento
            
            $remainingExercisesToComplete -= $attempts;

            // Calcular acciones: cada ejercicio tiene aproximadamente 3 pasos con 4 opciones cada uno
            // El usuario promedio selecciona entre 1-3 opciones por paso antes de acertar
            $stepsPerExercise = 3;
            $avgActionsPerStep = rand(1, 3); // 1-3 intentos por paso
            $actionsPerAttempt = $stepsPerExercise * $avgActionsPerStep;
            
            $totalActions = $attempts * $actionsPerAttempt;
            // Agregar algo de variación aleatoria (±30%)
            $variation = rand(-30, 30) / 100;
            $totalActions = (int)($totalActions * (1 + $variation));
            $totalActions = max(3, $totalActions); // Mínimo 3 acciones (1 por paso)

            // Avanzar tiempo entre ejercicios (30 minutos a 4 horas)
            $currentTime->addMinutes(rand(30, 240));

            $user->exercises()->create([
                'exercise_id' => $exercise->id,
                'number_of_attempts' => $attempts,
                'number_of_actions' => $totalActions,
                'created_at' => $currentTime->copy(),
                'updated_at' => $currentTime->copy(),
            ]);
        }
    }
}

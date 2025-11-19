<?php

namespace Database\Factories;

use App\Models\Dificulty;
use App\Models\Exercise;
use App\Models\Galaxy;
use App\Models\Option;
use App\Models\Step;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Planet>
 */
class PlanetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [];
    }

    public function configure()
    {
        return $this->afterCreating(function ($planet) {
            $planet->galaxy()->associate(Galaxy::firstOrFail());
            $easy = Dificulty::where('name', 'Fácil')->first();
            $medium = Dificulty::where('name', 'Media')->first();
            $hard = Dificulty::where('name', 'Difícil')->first();

            // Ejercicios para nivel fácil
            $this->makeExercise1($easy->id, $planet->id);
            $this->makeExercise2($easy->id, $planet->id);
            $this->makeExercise3($easy->id, $planet->id);
            $this->makeExercise4($easy->id, $planet->id);
            $this->makeExercise5($medium->id, $planet->id);
            $this->makeExercise6($medium->id, $planet->id);
            $this->makeExercise7($hard->id, $planet->id);
            $this->makeExercise8($hard->id, $planet->id);
            $this->makeExercise9($hard->id, $planet->id);
            $this->makeExercise10($easy->id, $planet->id);
            $this->makeExercise11($easy->id, $planet->id);
            $this->makeExercise12($medium->id, $planet->id);
            $this->makeExercise13($hard->id, $planet->id);
            $this->makeExercise14($medium->id, $planet->id);
            $this->makeExercise15($medium->id, $planet->id);
            $this->makeExercise16($medium->id, $planet->id);
            $this->makeExercise17($easy->id, $planet->id);
            $this->makeExercise18($hard->id, $planet->id);
            $this->makeExercise19($medium->id, $planet->id);
            $this->makeExercise20($easy->id, $planet->id);
        });
    }

    public function makeExercise1($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 3x + 5",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);

        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Multiplicar los coeficientes segun las reglas de derivacion'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '3(0) + 5(1)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '3(1) + 5(0)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '3(1) + 5(1)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '3(0) + 5(0)',
            'is_correct' => false
        ]);

        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Resolver la multiplicacion'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '3 + 0',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '0 + 5',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '3 + 5',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '0 + 0',
            'is_correct' => false
        ]);

        $step3 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 3,
            'description' => 'Sumar los terminos'
        ]);
        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 5",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 8",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 3",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 0",
            'is_correct' => false
        ]);
    }

    public function makeExercise2($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 2x + 4",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);

        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Multiplicar los coeficientes segun las reglas de derivacion'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2(0) + 4(1)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2(0) + 4(0)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2(1) + 4(0)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => 'x + 4(0)',
            'is_correct' => false
        ]);

        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Resolver la multiplicacion'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '2 + 0',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '0 + 4',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '2 + 4',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '0 + 0',
            'is_correct' => false
        ]);

        $step3 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 3,
            'description' => 'Sumar los terminos'
        ]);
        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 4",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 0",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = x",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 2",
            'is_correct' => true
        ]);
    }

    public function makeExercise3($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = x^2",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);

        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar la regla de la potencia'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2x^(2-1)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2x^(2+1)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => 'x^(2-1)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => 'x^(2+2)',
            'is_correct' => false
        ]);

        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Simplificar la expresion'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '2x^1',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '2x^2',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => 'x^1',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => 'x^2',
            'is_correct' => false
        ]);

        $step3 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 3,
            'description' => 'Escribir la respuesta final'
        ]);
        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 1",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 2x",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = x",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = x^2",
            'is_correct' => false
        ]);
    }

    public function makeExercise4($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 2x^2",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);

        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar la regla de la potencia'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2*2x^(2+1)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2x^(2-1)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2x^(2+2)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2*2x^(2-1)',
            'is_correct' => true
        ]);

        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Simplificar la expresion'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '4x^1',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '2x^2',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '2x^1',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '4x^2',
            'is_correct' => false
        ]);

        $step3 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 3,
            'description' => 'Escribir la respuesta final'
        ]);
        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 2x",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 4x",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = x^2",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 2x^2",
            'is_correct' => false
        ]);
    }

    public function makeExercise5($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 1/x",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);

        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Desapejar la x de la fraccion usando las reglas del algebra'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '-1 * x^(-1)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '1 * x^(1)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '1 * x^(-1)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '1/x^(-1)',
            'is_correct' => false
        ]);

        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Aplicar la regla de la potencia'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '-1x^(-2)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '1x^(0)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '1x^(-2)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '-1x^(1)',
            'is_correct' => false
        ]);

        $step3 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 3,
            'description' => 'Escribir la respuesta final'
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 1/x^2",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = -1/x^2",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 1/x",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = -1/x",
            'is_correct' => false
        ]);
    }

    public function makeExercise6($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 5/x^3",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);

        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Desapejar la x de la fraccion usando las reglas del algebra'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '5 * x^3',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '5 * x^(-3)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '-5 * x^(-3)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '5 / x^(-3)',
            'is_correct' => false
        ]);

        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Aplicar la regla de la potencia'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '-15x^(-4)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '15x^(-2)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '5x^(-4)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '-5x^(-2)',
            'is_correct' => false
        ]);

        $step3 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 3,
            'description' => 'Escribir la respuesta final'
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 5/x^4",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = -15/x^4",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 5/x^3",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = -5/x^3",
            'is_correct' => false
        ]);
    }

    public function makeExercise7($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 2x^2 / 3x^6",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);

        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Desapejar la x de la fraccion usando las reglas del algebra'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(2/3)x^(2+6)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(3/2)x^(2-6)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(3/2)x^(2+6)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(2/3)x^(2-6)',
            'is_correct' => true
        ]);

        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Aplicar la regla de la potencia'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '(2/3)(-4)x^(-5)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '(2/3)(4)x^(-7)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '(3/2)(-4)x^(-5)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '(3/2)(4)x^(-7)',
            'is_correct' => false
        ]);

        $step3 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 3,
            'description' => 'Escribir la respuesta final'
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 8/3x^5",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = -8/3x^5",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 2/3x^6",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = -2/3x^6",
            'is_correct' => false
        ]);
    }

    public function makeExercise8($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 2x/x^2",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);

        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Desapejar la x de la fraccion usando las reglas del algebra'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2x^(1-2)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2x^(1+2)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => 'x^(1-2)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => 'x^(1+2)',
            'is_correct' => false
        ]);

        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Aplicar la regla de la potencia'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '2(-1)x^(-2)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '2(1)x^(0)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '1(-1)x^(-2)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '1(1)x^(0)',
            'is_correct' => false
        ]);

        $step3 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 3,
            'description' => 'Escribir la respuesta final'
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 2/x^2",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = -2/x^2",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 2/x",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = -2/x",
            'is_correct' => false
        ]);
    }

    public function makeExercise9($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = ∛x^2",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);

        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Reescribir la raiz como una potencia'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => 'x^(2/3)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => 'x^(3/2)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => 'x^(2*3)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => 'x^(3*2)',
            'is_correct' => false
        ]);

        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Aplicar la regla de la potencia'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '(2/3)x^(-1/3)',
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '(3/2)x^(1/3)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '(2/3)x^(1/3)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => '(3/2)x^(-1/3)',
            'is_correct' => false
        ]);

        $step3 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 3,
            'description' => 'Escribir la respuesta final'
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 2/3√x^2",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 2/3√x^(1/3)",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 3/2√x^2",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step3->id,
            'result' => "F'(x) = 3/2∛x",
            'is_correct' => false
        ]);
    }
    
    public function makeExercise10($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 5x^3",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);
        
        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar la Regla de la Potencia: Multiplicar el coeficiente (5) por el exponente (3) y restar 1 al exponente (3-1).'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(5 * 3)x^(3-1)', 
            'is_correct' => true
        ]);
        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(5 + 3)x^(3-1)', 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(5 * 3)x^(3+1)', 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(5 * 1)x^(3-1)', 
            'is_correct' => false
        ]);
        
        
        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Resolver la multiplicación y el exponente para obtener la derivada final.'
        ]);

        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 15x^2",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 8x^2", 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 15x^4", 
            'is_correct' => false
        ]);
        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 5x^2", 
            'is_correct' => false
        ]);
    }

    public function makeExercise11($dificultyId, $planetId)
    {
        
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 100",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId 
        ]);
        
        
        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar la Regla de la Constante: La derivada de cualquier número sin la variable (x) es 0.'
        ]);

        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => "F'(x) = 0", 
            'is_correct' => true
        ]);
        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => "F'(x) = 100", 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => "F'(x) = x", 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => "F'(x) = 1", 
            'is_correct' => false
        ]);
    }

    public function makeExercise12($dificultyId, $planetId)
    {
        
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = √x",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId 
        ]);
        
        
        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Reescribir √x como x^(1/2) y aplicar la Regla de la Potencia: (1/2) * x^((1/2) - 1)'
        ]);

        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(1/2)x^(-1/2)', 
            'is_correct' => true
        ]);
        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(2)x^(-1/2)', 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '-(1/2)x^(-1/2)', 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => 'x^(1/2)', 
            'is_correct' => false
        ]);
        
        
        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Reescribir el resultado final utilizando notación de raíz, recordando que x^(-n) = 1/(x^n)'
        ]);

        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 1 / (2√x)", 
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = -1 / (2√x)", 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 2 / √x", 
            'is_correct' => false
        ]);
        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = √x", 
            'is_correct' => false
        ]);
    }

    public function makeExercise13($dificultyId, $planetId)
    {
        
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = x^2 / (x + 1)",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId 
        ]);
        
        
        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar (v*u\' - u*v\') / v^2. u=x^2, v=x+1.'
        ]);

        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '((x+1)2x - x^2(1)) / (x+1)^2', 
            'is_correct' => true
        ]);
        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(x^2(1) - (x+1)2x) / (x+1)^2', 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '((x+1)2x + x^2(1)) / (x+1)^2', 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(2x - 1) / (x+1)^2', 
            'is_correct' => false
        ]);
        
        
        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Simplificar y agrupar términos en el numerador.'
        ]);

        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = (x^2 + 2x) / (x+1)^2",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = (2x^2 + 2x) / (x+1)^2", 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 2x / (x+1)^2", 
            'is_correct' => false
        ]);
        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = x / (x+1)^2", 
            'is_correct' => false
        ]);
    }
    public function makeExercise14($dificultyId, $planetId)
    {
        
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = (2x)(x^2 + 1)",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId 
        ]);
        
        
        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar u\'v + uv\'. u=2x, v=x^2+1.'
        ]);

        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(2)(x^2 + 1) + (2x)(2x)', 
            'is_correct' => true
        ]);
        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(2)(x^2 + 1) - (2x)(2x)', 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(2x)(x^2 + 1) + (2)(2x)', 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(2) + (2x)', 
            'is_correct' => false
        ]);
        
        
        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Simplificar y agrupar términos semejantes (x^2).'
        ]);

        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 6x^2 + 2",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 4x^2 + 2", 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 2x^2 + 2", 
            'is_correct' => false
        ]);
        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 6x^2", 
            'is_correct' => false
        ]);
    
    }
    public function makeExercise15($dificultyId, $planetId)
    {
        
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = (x^2 + 4)^(1/2)",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId 
        ]);
        
        
        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar la Regla de la Cadena: Derivada externa * Derivada interna.'
        ]);

        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(1/2)(x^2 + 4)^(-1/2) * (2x)', 
            'is_correct' => true
        ]);
        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(1/2)(x^2 + 4)^(-1/2) * (2x + 4)', 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '-(1/2)(x^2 + 4)^(-1/2) * (2x)', 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(1/2)(x^2 + 4)^(1/2) * (2x)', 
            'is_correct' => false
        ]);
        
        
        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Simplificar multiplicando (1/2) * (2x) y reescribir con notación de raíz.'
        ]);

        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = x / √x^2 + 4",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 1 / √x^2 + 4", 
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 2x / √x^2 + 4", 
            'is_correct' => false
        ]);
        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = x", 
            'is_correct' => false
        ]);
    }
    public function makeExercise16($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 5 * cos(x)",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);
        
        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar que d/dx[cos(x)] = -sin(x), manteniendo la constante (5).'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '5 * (-sin(x))',
            'is_correct' => true
        ]);
        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '5 * (sin(x))',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '-5 * (-sin(x))',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '0 * (-sin(x))',
            'is_correct' => false
        ]);
        
        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Resolver la multiplicación para obtener el resultado final.'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = -5sin(x)",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 5sin(x)",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = -sin(x)",
            'is_correct' => false
        ]);
        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 5cos(x)",
            'is_correct' => false
        ]);
    }
    public function makeExercise17($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = x^4 + 7",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);
        
        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar la Regla de la Potencia al primer término y la Regla de la Constante al segundo.'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '4x^(4-1) + 0',
            'is_correct' => true
        ]);
        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => 'x^(4-1) + 0',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '4x^(4-1) + 7',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '4x^(4-1) + 1',
            'is_correct' => false
        ]);
        
        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Simplificar el exponente y sumar los términos.'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 4x^3",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 4x^3 + 7",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = x^3",
            'is_correct' => false
        ]);
        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 4x^4",
            'is_correct' => false
        ]);
    }
    public function makeExercise18($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 2x^2 + 3x",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);
        
        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar la Regla de la Potencia a ambos términos: 2(2x^(2-1)) + 3(1).'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '4x^1 + 3x^0',
            'is_correct' => true
        ]);
        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '4x^2 + 3x',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '2x^1 + 3x^0',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '4x^1 + 0',
            'is_correct' => false
        ]);
        
        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Simplificar el exponente y sumar los términos (recuerda $x^0 = 1$).'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 4x + 3",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 7x",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 4x + 3x",
            'is_correct' => false
        ]);
        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 4x",
            'is_correct' => false
        ]);
    
    }
    public function makeExercise19($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = sin^3(2x)",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);
        
        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar la Regla de la Cadena para la potencia y la función trigonométrica: (Derivada externa) * (Derivada media).'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '3 * sin^2(2x) * cos(2x) * (2)',
            'is_correct' => true
        ]);
        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '3 * sin^2(2x) * cos(2x) * (1)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '3 * cos^2(2x) * sin(2x) * (2)',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '3 * sin^2(2x) * (2)',
            'is_correct' => false
        ]);
        
        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Multiplicar las constantes para obtener el resultado final.'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 6sin^2(2x)cos(2x)",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 3sin^2(2x)cos(2x)",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 6cos^2(2x)sin(2x)",
            'is_correct' => false
        ]);
        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 6sin(2x)",
            'is_correct' => false
        ]);
    }
    public function makeExercise20($dificultyId, $planetId)
    {
        $exercise = Exercise::factory()->create([
            'operation' => "f'(x) = 6 * ln(x) - 1",
            'planet_id' => $planetId,
            'difficulty_id' => $dificultyId
        ]);
        
        $step1 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 1,
            'description' => 'Aplicar d/dx[ln(x)] = 1/x y d/dx[c] = 0.'
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '6 * (1/x) - 0',
            'is_correct' => true
        ]);
        
        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '6 * (x) - 1',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '6 * (1/x) - 1',
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step1->id,
            'result' => '(1/x) - 0',
            'is_correct' => false
        ]);
        
        $step2 = Step::factory()->create([
            'exercise_id' => $exercise->id,
            'order' => 2,
            'description' => 'Multiplicar y simplificar para obtener el resultado final.'
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 6 / x",
            'is_correct' => true
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 6x",
            'is_correct' => false
        ]);

        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 1 / x",
            'is_correct' => false
        ]);
        
        Option::factory()->create([
            'step_id' => $step2->id,
            'result' => "F'(x) = 6x - 1",
            'is_correct' => false
        ]);
    }
}




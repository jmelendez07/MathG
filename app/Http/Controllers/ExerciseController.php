<?php

namespace App\Http\Controllers;

use App\Models\Dificulty;
use App\Models\Exercise;
use App\Models\Planet;
use App\Traits\LogsUserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExerciseController extends Controller
{
    use LogsUserActivity;

    public function index()
    {
        $exercises = Exercise::with(['planet', 'difficulty'])->orderByDesc('created_at')->get();
        $difficulties = Dificulty::all();
        $planets = Planet::all();

        return Inertia::render('dashboard/exercises/index', [
            'exercises' => $exercises,
            'difficulties' => $difficulties,
            'planets' => $planets
        ]);
    }

    public function create()
    {
        return redirect()->route('exercises.index');
    }

    public function store(Request $request)
    {
        $startTime = microtime(true);

        $request->validate([
            'operation' => 'required|string',
            'planet_id' => 'required|exists:planets,id',
            'difficulty_id' => 'required|exists:dificulties,id',
        ]);

        $exercise = Exercise::create([
            'operation' => $request->operation,
            'planet_id' => $request->planet_id,
            'difficulty_id' => $request->difficulty_id,
        ]);

        $user = Auth::user();
        $this->logActivity(
            $request,
            'Nuevo ejercicio ' . $exercise->operation . ' creado',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->route('exercises.index')->with('success', 'Ejercicio creado exitosamente.');
    }

    public function show($exerciseId)
    {
        $exercise = Exercise::with(['planet', 'difficulty', 'steps.options'])->findOrFail($exerciseId);
        return Inertia::render('dashboard/exercises/show', [
            'exercise' => $exercise
        ]);
    }

    public function edit($exerciseId)
    {
        return redirect()->route('exercises.index');
    }

    public function update(Request $request, $exerciseId)
    {
        $startTime = microtime(true);
        $exercise = Exercise::findOrFail($exerciseId);

        $request->validate([
            'operation' => 'required|string',
            'planet_id' => 'required|exists:planets,id',
            'difficulty_id' => 'required|exists:dificulties,id',
        ]);

        $exercise->update([
            'operation' => $request->operation,
            'planet_id' => $request->planet_id,
            'difficulty_id' => $request->difficulty_id,
        ]);

        $user = Auth::user();
        $this->logActivity(
            $request,
            'Ejercicio ' . $exercise->operation . ' actualizado',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->route('exercises.index')->with('success', 'Ejercicio actualizado exitosamente.');
    }

    public function destroy(Request $request, $exerciseId)
    {
        $startTime = microtime(true);

        $exercise = Exercise::findOrFail($exerciseId);
        $exercise->delete();

        $user = Auth::user();
        $this->logActivity(
            $request,
            'Ejercicio ' . $exercise->operation . ' eliminado',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->route('exercises.index')->with('success', 'Ejercicio eliminado exitosamente.');
    }
}

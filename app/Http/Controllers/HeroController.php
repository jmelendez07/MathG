<?php

namespace App\Http\Controllers;

use App\Models\Hero;
use App\Traits\LogsUserActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class HeroController extends Controller
{
    use LogsUserActivity;

    public function index()
    {
        $heroes = Hero::orderByDesc('updated_at')->get();

        return Inertia::render('dashboard/heroes/index', [
            'heroes' => $heroes,
        ]);
    }

    public function store(Request $request)
    {
        $startTime = microtime(true);

        $request->validate([
            'name' => 'required|string|max:255|unique:heroes,name',
            'spritesheet' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'health' => 'required|integer|min:1',
        ]);

        $hero = Hero::create([
            'name' => $request->name,
            'spritesheet' => asset('storage/' . $request->file('spritesheet')->store('heroes', 'public')),
            'health' => $request->health,
        ]);

        $user = Auth::user();
        $this->logActivity(
            $request,
            'Nuevo heroe ' . $hero->name . ' creado',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->route('heroes.index')->with('success', 'Heroe ' . $hero->name . ' creado exitosamente.');
    }

    public function update(Request $request, $heroId)
    {
        $startTime = microtime(true);

        $request->validate([
            'name' => 'required|string|max:255|unique:heroes,name,' . $heroId,
            'spritesheet' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'health' => 'required|integer|min:1',
        ]);

        $hero = Hero::findOrFail($heroId);
        $hero->update([
            'name' => $request->name,
            'spritesheet' => $request->file('spritesheet') ? asset('storage/' . $request->file('spritesheet')->store('heroes', 'public')) : $hero->spritesheet,
            'health' => $request->health,
        ]);

        $user = Auth::user();
        $this->logActivity(
            $request,
            'Heroe ' . $hero->name . ' creado',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->route('heroes.index')->with('success', 'Heroe ' . $hero->name . ' actualizado exitosamente.');
    }

    public function destroy(Request $request, $heroId)
    {
        $startTime = microtime(true);
        $hero = Hero::findOrFail($heroId);
        $hero->delete();

        $user = Auth::user();
        $this->logActivity(
            $request,
            'Heroe ' . $hero->name . ' eliminado',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->route('heroes.index')->with('success', 'Heroe ' . $hero->name . ' eliminado exitosamente.');
    }

    public function options() 
    {
        if (Auth::user()->heroes()->exists()) {
            return redirect()->route('gameplay.index');
        }

        $heroes = Hero::all();

        return Inertia::render('gameplay/heroes/options', [
            'heroes' => $heroes,
        ]);
    }

    public function select(Request $request) 
    {
        $request->validate([
            'id' => 'required|string|exists:heroes,id'
        ]);

        $hero = Hero::findOrFail($request->id);
        Auth::user()->heroes()->attach($hero->id);

        return redirect()->route('gameplay.index');
    }
}

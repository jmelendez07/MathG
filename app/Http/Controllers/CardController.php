<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Exercise;
use App\Models\TypeCard;
use App\Traits\LogsUserActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CardController extends Controller
{
    use LogsUserActivity;

    public function index()
    {
        $cards = Card::with('type')->get();
        $types = TypeCard::all();

        return Inertia::render('dashboard/cards/index', [
            'cards' => $cards,
            'types' => $types,
        ]);
    }

    public function create()
    {
        return redirect()->route('cards.index');
    }

    public function store(Request $request)
    {
        $startTime = microtime(true);

        $request->validate([
            'name' => 'required|string|max:255|unique:cards',
            'energy_cost' => 'required|integer|min:0',
            'stats' => 'required|integer|min:0',
            'type_id' => 'required|exists:type_cards,_id',
        ]);

        $card = Card::create([
            'name' => $request->name,
            'energy_cost' => $request->energy_cost,
            'stats' => $request->stats,
            'type_card_id' => $request->type_id,
        ]);

        $user = Auth::user();

        $this->logActivity(
            $request,
            'Nueva carta ' . $card->name . ' creada',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->route('cards.index')->with('success', 'Carta creada exitosamente.');
    }

    public function show($cardId)
    {
        $card = Card::with(['type', 'exercises.difficulty', 'exercises.planet', 'exercises.steps'])->findOrFail($cardId);
        $exercises = Exercise::with(['difficulty', 'planet', 'steps'])->orderBy('updated_at', 'desc')->get();
        $types = TypeCard::all();

        return Inertia::render('dashboard/cards/show', [
            'card' => $card,
            'availableExercises' => $exercises,
            'types' => $types,
        ]);
    }

    public function edit($cardId)
    {
        return redirect()->route('cards.index');
    }

    public function update(Request $request, $cardId)
    {
        $startTime = microtime(true);

        $request->validate([
            'name' => 'required|string|max:255|unique:cards,name,' . $cardId,
            'energy_cost' => 'required|integer|min:0',
            'stats' => 'required|integer|min:0',
            'type_id' => 'required|exists:type_cards,_id',
        ]);

        $card = Card::findOrFail($cardId);
        $card->update([
            'name' => $request->name,
            'energy_cost' => $request->energy_cost,
            'stats' => $request->stats,
            'type_card_id' => $request->type_id,
        ]);

        $user = Auth::user();

        $this->logActivity(
            $request,
            'Carta ' . $card->name . ' actualizada',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->back()->with('success', 'Carta actualizada exitosamente.');
    }

    public function destroy(Request $request, $cardId)
    {
        $startTime = microtime(true);

        $card = Card::findOrFail($cardId);
        $card->delete();

        $user = Auth::user();

        $this->logActivity(
            $request,
            'Carta ' . $card->name . ' eliminada',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->route('cards.index')->with('success', 'Carta eliminada exitosamente.');
    }

    public function assignExercise($cardId, $exerciseId)
    {
        $card = Card::findOrFail($cardId);
        $exercise = Exercise::findOrFail($exerciseId);

        $card->exercises()->attach($exercise);

        return redirect()->back()->with('success', "Ejercicio {$exercise->operation} asignado.");
    }

    public function unassignExercise($cardId, $exerciseId)
    {
        $card = Card::findOrFail($cardId);
        $exercise = Exercise::findOrFail($exerciseId);

        $card->exercises()->detach($exercise);

        return redirect()->back()->with('success', "Ejercicio {$exercise->operation} desasignado.");
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Enemy;
use App\Models\Dificulty;
use App\Models\Exercise;
use App\Models\Galaxy;
use App\Models\Stage;
use App\Traits\LogsUserActivity;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GameplayController extends Controller
{
    use LogsUserActivity;

    public function index()
    {
        $galaxy = Galaxy::firstOrFail();
        $easy = Dificulty::where('name', 'Fácil')->first()->id;
        $hero = Auth::user()->heroes()->first();
        $heroCards = $hero->cards()->with('type')->get();
        $cards = [];
        
        foreach ($heroCards as $card) {
            $card->exercise = $this->randomExercise($easy);
            $cards[] = $card;
        }

        return redirect()->route('gameplay.galaxy', $galaxy->id);
    }

    public function galaxy(Request $request, $galaxyId)
    {
        $startTime = microtime(true);

        $galaxy = Galaxy::with(['planets.stages'])->findOrFail($galaxyId);
        $profile = Auth::user()->profile;

        $user = Auth::user();
        $this->logActivity(
            $request,
            'El usuario esta en el menu de la galaxia ' . $galaxy->name,
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );
        
        return Inertia::render('gameplay/galaxies/show', [
            'galaxy' => $galaxy,
            'unlocked_planets' => $profile->unlockedPlanets,
            'unlocked_stages' => $profile->unlockedStages,
        ]);
    }

    public function stage(Request $request, $stageId)
    {
        $startTime = microtime(true);

        $stage = Stage::with(['points', 'missions'])->findOrFail($stageId);
        $heroes = Auth::user()->heroes()->with(['cards.type', 'heroAnimations', 'heroRole'])->get();
        $easy = Dificulty::where('name', 'Fácil')->firstOrFail()->id;

        $enemies = [];

        $orcEnemy = Enemy::with('type')->where('name', 'Orc')->first();
        if ($orcEnemy) {
            $enemies[] = $orcEnemy;
        }

        $DragonEnemy = Enemy::with('type')->where('name', 'Dragon')->first();
        if ($DragonEnemy) {
            $enemies[] = $DragonEnemy;
        }

        $cards = [];

        foreach($heroes as $hero){
            foreach($hero->cards as $card) {
                $card->exercise = $this->randomExercise($easy);
                $cards[] = $card;
            }
        }

        shuffle($cards);
    
        $user = Auth::user();
        $this->logActivity(
            $request,
            'Ha empezado el juego en ' . $stage->name,
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );
        
        return Inertia::render('gameplay/stages/show', [
            'stage' => $stage,
            'heroes' => $heroes,
            'enemies' => $enemies,
            'cards' => $cards,
        ]);
    }
    
    public function nextStage(Request $request)
    {
        $startTime = microtime(true);

        $profile = Auth::user()->profile;
        $currentStage = $profile->unlockedStages()->orderByDesc('number')->firstOrFail();
        $nextStage = Stage::where('number', '>', $currentStage->number)
            ->orderBy('number', 'asc')
            ->first();

        if ($nextStage) {
            $profile->unlockedStages()->attach($nextStage->id);
            if ($currentStage->planet_id !== $nextStage->planet_id) {
                $profile->unlockedPlanets()->attach($nextStage->planet_id);
            }
        }

        $user = Auth::user();
        $this->logActivity(
            $request,
            'Ha paso al siguiente lugar: ' . $nextStage->name,
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );
        
        return back()->with([
            'success' => true,
            'next_stage' => $nextStage
        ], 200);
    }

    public function randomExercise($difficultyId)
    {
        $exercises = Exercise::with('steps.options')
            ->where('difficulty_id', $difficultyId)
            ->get();
        
        return $exercises->random();
    }
}

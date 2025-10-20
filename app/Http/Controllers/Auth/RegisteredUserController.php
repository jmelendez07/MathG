<?php

namespace App\Http\Controllers\Auth;

use App\Traits\LogsUserActivity;
use App\Http\Controllers\Controller;
use App\Models\Hero;
use App\Models\Level;
use App\Models\Planet;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    use LogsUserActivity;

    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $startTime = microtime(true);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('estudiante');

        $levelOneId = Level::where('order', 1)->first()->id;

        $profile = Profile::create([
            'user_id' => $user->id,
            'level_id' => $levelOneId,
            'avatar_url' => asset('https://res.cloudinary.com/dvibz13t8/image/upload/v1759418515/avatar_ldk2rr.png'),
            'progress_bar' => 0,
            'total_xp' => 0,
            'avatar_frame_url' => asset('https://res.cloudinary.com/dvibz13t8/image/upload/v1759413505/marco_M_hyzhg3.png')
        ]);

        $heroes = Hero::whereIn('name', ['Warrior', 'Ninja'])->get();
        $warrior = $heroes->firstWhere('name', 'Warrior');
        $ninja = $heroes->firstWhere('name', 'Ninja');
        if (!$warrior || !$ninja) {
            throw new \Exception('Required heroes not found');
        }

        $user->heroes()->attach([$warrior->id, $ninja->id]);

        $firstPlanet = Planet::orderBy('number', 'asc')->firstOrFail();
        $profile->unlockedPlanets()->attach($firstPlanet->id);

        $firstStage = $firstPlanet->stages()->orderBy('number', 'asc')->firstOrFail();
        $profile->unlockedStages()->attach($firstStage->id);

        event(new Registered($user));

        Auth::login($user);

        $this->logActivity(
            $request,
            'Nuevo usuario registrado',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        if (Auth::user()->hasRole('administrador')) {
            return redirect()->intended(route('dashboard'));
        } else if (Auth::user()->hasRole('docente')) {
            return redirect()->intended(route('rooms.index'));
        } else {
            return redirect()->intended(route('gameplay.index'));
        }
    }
}

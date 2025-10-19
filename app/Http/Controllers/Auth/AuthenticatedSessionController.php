<?php

namespace App\Http\Controllers\Auth;

use App\Traits\LogsUserActivity;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    use LogsUserActivity;

    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $startTime = microtime(true);
        $request->authenticate();
        $request->session()->regenerate();
        $user = Auth::user();

        $this->logActivity(
            $request,
            'Nuevo inicio de sesión',
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
            return redirect()->intended(route('heroes.options'));
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        $startTime = microtime(true);
        $user = Auth::user();

        if ($user) {
            $this->logActivity(
                $request,
                'Cierre de sesión',
                ['user_id' => $user->id],
                [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->pluck('name')->first(),
                    'date' => now()->toDateTimeString(),
                ],
                $startTime
            );
        }

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}

<?php

use App\Http\Controllers\CardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PlanetController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\StepController;
use App\Http\Controllers\OptionController;
use App\Http\Controllers\EnemyController;
use App\Http\Controllers\GalaxyController;
use App\Http\Controllers\GameplayController;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\StageController;
use App\Http\Controllers\StageVectorPointController;
use App\Http\Controllers\UserLogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/loading', function () {
    return Inertia::render('test-loading');
})->name('loading');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(['role:estudiante'])->group(function () {
        Route::get('heroes/opciones', [HeroController::class, 'options'])->name('heroes.options');
        Route::post('heroes/seleccionar', [HeroController::class, 'select'])->name('heroes.select');

        Route::middleware(['check_user_hero'])->group(function () {
            Route::get('gameplay/galaxia/{galaxyId}', [GameplayController::class, 'galaxy'])->name('gameplay.galaxy');
            Route::get('gameplay/lugar/{stageId}', [GameplayController::class, 'stage'])->name('gameplay.stage');
            Route::post('gameplay/next-stage', [GameplayController::class, 'nextStage'])->name('gameplay.next-stage');
            Route::resource('gameplay', GameplayController::class)->names('gameplay')->except(['show']);
        });
    });

    Route::post('profile/update-xp', [ProfileController::class, 'updateXp'])->name('profile.update-xp');

    Route::middleware(['role:docente'])->group(function () {
        Route::resource('salas', RoomController::class)->names('rooms');
    });

    Route::middleware(['role:docente,estudiante'])->group(function () {
        Route::get('salas/jugar/{pin}', [RoomController::class, 'join'])->name('rooms.join');
    });

    Route::middleware(['role:administrador'])->group(function () {
        Route::get('panel', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('users', UserController::class)->names('users');
        Route::resource('docentes', TeacherController::class)->names('teachers');
        Route::post('docentes/bulk-destroy', [TeacherController::class, 'bulkDestroy'])->name('teachers.bulk-destroy');
        Route::resource('galaxias', GalaxyController::class)->names('galaxies');
        Route::resource('planetas', PlanetController::class)->names('planets');
        Route::resource('ejercicios', ExerciseController::class)->names('exercises');
        Route::resource('cartas', CardController::class)->names('cards');

        Route::post('cartas/{carta}/ejercicios/{ejercicio}', [CardController::class, 'assignExercise'])->name('cards.exercises.assign');
        Route::delete('cartas/{carta}/ejercicios/{ejercicio}', [CardController::class, 'unassignExercise'])->name('cards.exercises.unassign');

        Route::resource('pasos', StepController::class)->names('steps');
        Route::resource('opciones', OptionController::class)->names('options');
        Route::resource('enemigos', EnemyController::class)->names('enemies');
        Route::resource('heroes', HeroController::class)->names('heroes');
        Route::resource('lugares', StageController::class)->names('stages');
        Route::post('lugares/{stageId}/puntos-vectoriales/sync', [StageVectorPointController::class, 'syncMany'])->name('stages.points.sync-many');
        Route::get('monitoreo', [UserLogController::class, 'index'])->name('logs.index');
        Route::get('monitoreo/usuario/{id}', [UserLogController::class, 'user'])->name('logs.user');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

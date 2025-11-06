<?php

namespace App\Http\Controllers;

use App\Models\Galaxy;
use App\Traits\LogsUserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GalaxyController extends Controller
{
    use LogsUserActivity;

    public $folder;

    public function __construct()
    {
        $this->folder = env('CLOUDINARY_FOLDER', 'gamepa');
    }

    public function index()
    {
        $galaxies = Galaxy::all();
        return Inertia::render('dashboard/galaxies/index', [
            'galaxies' => $galaxies
        ]);
    }

    public function create()
    {
        return redirect()->route('galaxies.index');
    }

    public function store(Request $request)
    {
        $startTime = microtime(true);

        $request->validate([
            'name' => 'required|string|max:255|unique:galaxies,name',
            'image' => 'required|image|max:2048',
        ]);

        $cloudinaryImage = cloudinary()->uploadApi()->upload($request->file('image')->getRealPath(), [
            'folder' => $this->folder . '/galaxies'
        ]);

        $galaxy = Galaxy::create([
            'name' => $request->name,
            'number' => Galaxy::max('number') + 1,
            'image_url' => $cloudinaryImage['secure_url'],
            'image_public_id' => $cloudinaryImage['public_id'],
        ]);

        $user = Auth::user();
        $this->logActivity(
            $request,
            'Nueva galaxia ' . $galaxy->name . ' creada',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->route('galaxies.index')->with('success', 'Galaxia ' . $galaxy->name . ' creada exitosamente.');
    }

    public function show($galaxyId)
    {
        return redirect()->route('galaxies.index');
    }

    public function edit($galaxyId)
    {
        return redirect()->route('galaxies.index');
    }

    public function update(Request $request, $galaxyId)
    {
        $startTime = microtime(true);
        $galaxy = Galaxy::findOrFail($galaxyId);

        $request->validate([
            'name' => 'required|max:255|unique:galaxies,name,' . $galaxy->_id,
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            
            if ($galaxy->image_public_id) {
                cloudinary()->uploadApi()->destroy($galaxy->image_public_id);
            }

            $cloudinaryImage = cloudinary()->uploadApi()->upload($request->file('image')->getRealPath(), [
                'folder' => $this->folder . '/galaxies'
            ]);
            $galaxy->image_url = $cloudinaryImage['secure_url'];
            $galaxy->image_public_id = $cloudinaryImage['public_id'];
        }

        $galaxy->name = $request->name;
        $galaxy->save();

        $user = Auth::user();
        $this->logActivity(
            $request,
            'Galaxia ' . $galaxy->name . ' actualizada',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->route('galaxies.index')->with('success', 'Galaxia ' . $galaxy->name . ' actualizada exitosamente.');
    }

    public function destroy(Request $request, $galaxyId)
    {
        $startTime = microtime(true);
        $galaxy = Galaxy::findOrFail($galaxyId);

        if ($galaxy->image_public_id) {
            cloudinary()->uploadApi()->destroy($galaxy->image_public_id);
        }

        foreach (Galaxy::where('number', '>', $galaxy->number)->get() as $g) {
            $g->number -= 1;
            $g->save();
        }

        $galaxy->delete();

        $user = Auth::user();
        $this->logActivity(
            $request,
            'Galaxia ' . $galaxy->name . ' eliminada',
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'date' => now()->toDateTimeString(),
            ],
            $startTime
        );

        return redirect()->route('galaxies.index')->with('success', 'Galaxia ' . $galaxy->name . ' eliminada exitosamente.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Galaxy;
use Inertia\Inertia;
use App\Models\Planet;
use Illuminate\Http\Request;

class PlanetController extends Controller
{
    public $folder;

    public function __construct()
    {
        $this->folder = env('CLOUDINARY_FOLDER', 'gamepa');
    }

    public function index()
    {
        $planets = Planet::with(['galaxy'])->orderByDesc('created_at')->get();
        $galaxies = Galaxy::all();

        return Inertia::render('dashboard/planets/index', [
            'planets' => $planets,
            'galaxies' => $galaxies
        ]);
    }

    public function create()
    {
        return redirect()->route('planets.index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:planets|string|max:255',
            'galaxy_id' => 'required|exists:galaxies,id',
            'image' => 'required|image|max:2048',
            'description' => 'nullable|string',
        ]);

        $cloudinaryImage = cloudinary()->uploadApi()->upload($request->file('image')->getRealPath(), [
            'folder' => $this->folder . '/planets'
        ]);

        Planet::create([
            'name' => $request->name,
            'number' => Planet::max('number') + 1,
            'galaxy_id' => $request->galaxy_id,
            'image_url' => $cloudinaryImage['secure_url'],
            'image_public_id' => $cloudinaryImage['public_id'],
            'description' => $request->description,
        ]);

        return redirect()->route('planets.index')->with('success', 'Planeta creado exitosamente.');
    }

    public function show($planetId)
    {
        $planet = Planet::with(['galaxy', 'stages'])->findOrFail($planetId);
        
        return Inertia::render('dashboard/planets/show', [
            'planet' => $planet
        ]);
    }

    public function edit($planetId)
    {
        return redirect()->route('planets.index');
    }

    public function update(Request $request, $planetId)
    {
        $planet = Planet::findOrFail($planetId);

        $request->validate([
            'name' => 'required|string|max:255|unique:planets,name,' . $planet->id,
            'galaxy_id' => 'required|exists:galaxies,id',
            'image' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            if ($planet->image_public_id) {
                cloudinary()->uploadApi()->destroy($planet->image_public_id);
            }

            $cloudinaryImage = cloudinary()->uploadApi()->upload($request->file('image')->getRealPath(), [
                'folder' => $this->folder . '/planets'
            ]);

            $planet->image_url = $cloudinaryImage['secure_url'];
            $planet->image_public_id = $cloudinaryImage['public_id'];
        }

        $planet->name = $request->name;
        $planet->description = $request->description;
        $planet->galaxy_id = $request->galaxy_id;
        $planet->save();

        return redirect()->route('planets.index')->with('success', 'Planeta actualizado exitosamente.');
    }

    public function destroy($planetId)
    {
        $planet = Planet::findOrFail($planetId);
        
        if ($planet->image_public_id) {
            cloudinary()->uploadApi()->destroy($planet->image_public_id);
        }

        foreach (Planet::where('number', '>', $planet->number)->get() as $p) {
            $p->number -= 1;
            $p->save();
        }

        $planet->delete();

        return redirect()->route('planets.index')->with('success', 'Planeta eliminado exitosamente.');
    }
}

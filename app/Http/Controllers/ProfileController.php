<?php

namespace App\Http\Controllers;

use App\Models\Level;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Profile $profile)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Profile $profile)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Profile $profile)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Profile $profile)
    {
        //
    }

    public function updateXp(Request $request)
    {
        $request->validate([
            'total_xp' => 'required|integer|min:0',
        ]);

        $profile = Profile::where('user_id', Auth::id())->first();

        if (!$profile) {
            return back()->withErrors(['error' => 'Profile not found']);
        }

        $profile->total_xp += $request->input('total_xp');

        $newLevel = Level::where('xp_required', '<=', $profile->total_xp)
            ->orderBy('xp_required', 'desc')
            ->first();

        if ($newLevel) {
            $profile->level_id = $newLevel->id;
        }

        $profile->save();
        $profile->load('level');

        return back()->with([
            'message' => 'Experience updated successfully',
            'updatedProfile' => $profile,
        ]);
    }
}

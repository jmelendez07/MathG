<?php

namespace App\Models;

use Laravel\Scout\Attributes\SearchUsingPrefix;
use Laravel\Scout\Searchable;
use MongoDB\Laravel\Eloquent\Model;

class Profile extends Model
{
    use Searchable;
    protected $connection = 'mongodb';
    protected $collection = 'profiles';

    protected $fillable = [
        'user_id',
        'level_id',
        'avatar_url',
        'progress_bar',
        'total_xp',
        'avatar_frame_url'
    ];

    #[SearchUsingPrefix(['user_id'])]
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'level' => $this->level,
            'avatar_url' => $this->avatar_url,
            'progress_bar' => $this->progress_bar
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function unlockedPlanets() 
    {
        return $this->hasMany(UserPlanet::class, 'profile_id', 'id');
    }

    public function unlockedStages()
    {
        return $this->hasMany(StageUser::class, 'profile_id', 'id');
    }

    public static function getAverageProgress(): float
    {
        $totalPlanets = Planet::count();
        
        if ($totalPlanets === 0) {
            return 0;
        }

        $profiles = self::with('unlockedPlanets')->get();
        
        if ($profiles->isEmpty()) {
            return 0;
        }

        $totalProgress = $profiles->sum(function ($profile) use ($totalPlanets) {
            $unlockedCount = $profile->unlockedPlanets->count();
            return ($unlockedCount / $totalPlanets) * 100;
        });

        return round($totalProgress / $profiles->count(), 2);
    }
    
    public function completedMissions()
    {
        return $this->hasMany(UserMission::class, 'profile_id', 'id');
    }
}

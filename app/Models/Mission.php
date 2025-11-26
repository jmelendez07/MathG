<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Mission extends Model
{
    /** @use HasFactory<\Database\Factories\MissionFactory> */
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'missions';

    protected $fillable = [
        'name',
        'description',
        'number_actions',
        'stage_id',
    ];

    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }

    public function completedMissions()
    {
        return $this->hasMany(UserMission::class, 'mission_id', 'id');
    }
}

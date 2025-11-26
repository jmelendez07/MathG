<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class UserPlanet extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'user_planet';

    protected $fillable = [
        'profile_id',
        'planet_id',
    ];

    public function userProfile()
    {
        return $this->belongsTo(Profile::class, 'profile_id', 'id');
    }

    public function planet()
    {
        return $this->belongsTo(Planet::class);
    }
}

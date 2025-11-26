<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class UserMission extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'user_missions';

    protected $fillable = [
        'profile_id',
        'mission_id',
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    public function mission()
    {
        return $this->belongsTo(Mission::class);
    }
}

<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class StageUser extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'stage_user';

    protected $fillable = [
        'profile_id',
        'stage_id',
    ];

    public function userProfile()
    {
        return $this->belongsTo(Profile::class, 'profile_id', 'id');
    }

    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }
}

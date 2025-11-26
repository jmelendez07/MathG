<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Stage extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'stages';

    protected $fillable = [
        'name',
        'number',
        'planet_id',
        'image_url',
        'image_public_id',
    ];

    public function planet()
    {
        return $this->belongsTo(Planet::class);
    }

    public function points()
    {
        return $this->hasMany(StageVectorPoint::class)->orderBy('number');
    }
    
    public function profiles()
    {
        return $this->hasMany(StageUser::class, 'stage_id', 'id');
    }

    public function missions()
    {
        return $this->hasMany(Mission::class);
    }
}

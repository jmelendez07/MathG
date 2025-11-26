<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;
use MongoDB\Laravel\Eloquent\Model;
use Laravel\Scout\Attributes\SearchUsingPrefix;

class Planet extends Model
{
    use Searchable;
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'planets';

    protected $fillable = [
        'name',
        'number',
        'image_url',
        'image_public_id',
        'galaxy_id',
        'description',
    ];

    #[SearchUsingPrefix(['name', 'description'])]
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
        ];
    }

    public function galaxy()
    {
        return $this->belongsTo(Galaxy::class);
    }

    public function exercises()
    {
        return $this->hasMany(Exercise::class);
    }

    public function stages()
    {
        return $this->hasMany(Stage::class);
    }

    public function profiles()
    {
        return $this->hasMany(UserPlanet::class, 'planet_id', 'id');
    }
}

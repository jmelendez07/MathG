<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;
use MongoDB\Laravel\Eloquent\Model;
use Laravel\Scout\Attributes\SearchUsingPrefix;

class Hero extends Model
{
    use Searchable;
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'heroes';

    protected $fillable = [
        'name',
        'spritesheet',
        'health',
        'hero_role_id',
        'avatar_url',
    ];

    #[SearchUsingPrefix(['name', 'health'])]
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'health' => $this->health,
            'avatar_url' => $this->avatar_url,
        ];
    }

    public function users()
    {
        return $this->hasMany(HeroUser::class, 'hero_id', 'id');
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }

    public function heroAnimations()
    {
        return $this->hasMany(HeroAnimations::class);
    }

    public function heroRole()
    {
        return $this->belongsTo(HeroRole::class);
    }
}

<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class HeroUser extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'hero_users';

    protected $fillable = [
        'user_id',
        'hero_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function hero()
    {
        return $this->belongsTo(Hero::class, 'hero_id');
    }
}

<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class UserExercise extends Model
{
    protected $fillable = [
        'user_id',
        'exercise_id',
        'number_of_attempts',
        'number_of_actions',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}

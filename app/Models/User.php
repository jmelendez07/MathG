<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;
use Laravel\Scout\Attributes\SearchUsingPrefix;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, Searchable, HasRoles;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    #[SearchUsingPrefix(['name', 'email'])]
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
        ];
    }

    /**
     * Get the user's sessions
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }

    /**
     * Get the user's active sessions
     */
    public function activeSessions(): HasMany
    {
        return $this->sessions()->where('last_activity', '>=', now()->subMinutes(5)->timestamp);
    }

    public function heroes()
    {
        return $this->hasMany(HeroUser::class, 'user_id', 'id');
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function logs()
    {
        return $this->hasMany(UserLog::class);
    }

    public function exercises()
    {
        return $this->hasMany(UserExercise::class);
    }
}

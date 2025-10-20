<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class UserLog extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'user_logs';

    protected $fillable = [
        'user_id',
        'action',
        'route',
        'ip_address',
        'user_agent',
        'status_code',
        'execution_time',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}

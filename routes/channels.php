<?php

use App\Enums\Roles;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('log.stream', function ($user) {
    return $user->hasRole(Roles::ADMIN); 
});

Broadcast::channel('log.stream.{userId}', function ($user, $userId) {
    return $user->hasRole(Roles::ADMIN); 
});
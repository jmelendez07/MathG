<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserLogController extends Controller
{
    public function index()
    {
        $logs = UserLog::with(['user'])->orderByDesc('created_at')->take(10)->get();
        $logsCount = UserLog::count();
        
        return Inertia::render('dashboard/logs/index', [
            'logs' => $logs,
            'logsCount' => $logsCount,
        ]);
    }

    public function user($id) 
    {
        $user = User::with(['logs' => function ($query) {
            $query->orderByDesc('created_at');
        }])->findOrFail($id);

        return Inertia::render('dashboard/logs/user/index', [
            'user' => $user,
        ]);
    }
}

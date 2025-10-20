<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserActivityStreamed implements ShouldBroadcast   
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $log;

    public function __construct($log)
    {
        $this->log = $log;
    }

    public function broadcastOn(): array
    {
        $channels = [
            new PrivateChannel('log.stream'),
        ];

        if (isset($this->log->user_id)) {
            $channels[] = new PrivateChannel('log.stream.' . $this->log->user_id);
        }

        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'user.activity.streamed';
    }

    public function broadcastWith(): array
    {
        return ['log' => $this->log];
    }
}

<?php

namespace App\Traits;

use App\Jobs\SendKafkaLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

trait LogsUserActivity
{
    protected function logActivity(
        Request $request,
        string $action,
        $response = null,
        array $additionalMetadata = [],
        float $startTime = null
    ): void {
        $executionTime = $startTime ? round((microtime(true) - $startTime) * 1000, 2) : null;
        $topic = config('kafka.log_topic', 'user-logs');

        $logData = [
            'user_id' => Auth::id(),
            'action' => $action,
            'route' => $request->route()?->getName() ?? $request->path(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status_code' => $this->getStatusCode($response),
            'execution_time' => $executionTime,
            'metadata' => array_merge([
                'referer' => $request->header('referer'),
                'url' => $this->getFullUrl($request),
                'method' => $request->method(),
            ], $additionalMetadata)
        ];

        SendKafkaLog::dispatch($topic, $logData, 'user-' . (Auth::id() ?? 'guest'));
    }

    private function getFullUrl(Request $request): string
    {
        $url = $request->fullUrl();
        
        if ($request->header('X-Forwarded-Proto') === 'https' && str_starts_with($url, 'http://')) {
            $url = 'https://' . substr($url, 7);
        }
        
        return $url;
    }

    private function sanitizeRequestData(array $data): array
    {
        $sensitiveKeys = ['password', 'password_confirmation', 'token', 'api_key', 'secret'];
        
        foreach ($sensitiveKeys as $key) {
            if (isset($data[$key])) {
                $data[$key] = '***REDACTED***';
            }
        }

        return $data;
    }

    private function sanitizeResponseData($response): ?array
    {
        if (!$response) {
            return null;
        }

        if (is_array($response)) {
            return $response;
        }

        if (is_object($response) && method_exists($response, 'getData')) {
            return (array) $response->getData();
        }

        return null;
    }

    private function getStatusCode($response): ?int
    {
        if (is_array($response)) {
            return 200;
        }

        if (is_object($response)) {
            if (method_exists($response, 'status')) {
                return $response->status();
            }

            if (method_exists($response, 'getStatusCode')) {
                return $response->getStatusCode();
            }
        }

        return 200;
    }
}
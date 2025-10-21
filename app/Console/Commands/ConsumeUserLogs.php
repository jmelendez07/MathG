<?php

namespace App\Console\Commands;

use App\Events\UserActivityStreamed;
use App\Models\UserLog;
use Illuminate\Console\Command;
use RdKafka\Conf;
use RdKafka\KafkaConsumer;
use RdKafka\Message;
use Illuminate\Support\Facades\Log;

class ConsumeUserLogs extends Command
{
    protected $signature = 'kafka:consume-logs {--once : Consume only one message and exit}';
    protected $description = 'Consume messages from Kafka user-logs topic and save to database';

    public function handle()
    {
        $this->info('🎯 Listening for user logs from Kafka...');
        $this->info('Press Ctrl+C to stop');
        $this->newLine();

        try {
            $conf = new Conf();
            
            $conf->set('metadata.broker.list', config('kafka.brokers'));
            $conf->set('security.protocol', config('kafka.securityProtocol'));
            $conf->set('sasl.mechanism', config('kafka.sasl.mechanisms'));
            $conf->set('sasl.username', config('kafka.sasl.username'));
            $conf->set('sasl.password', config('kafka.sasl.password'));
            
            $conf->set('group.id', config('kafka.consumer_group_id', 'laravel-consumer'));
            $conf->set('enable.auto.commit', 'true');
            $conf->set('auto.commit.interval.ms', '1000');
            $conf->set('auto.offset.reset', 'earliest');
            $conf->set('session.timeout.ms', '30000');
            $conf->set('enable.ssl.certificate.verification', config('kafka.sasl.ssl'));
            $conf->set('log_level', (string) LOG_ERR);

            $consumer = new KafkaConsumer($conf);
            $consumer->subscribe([config('kafka.log_topic', 'user-logs')]);

            $messageCount = 0;

            while (true) {
                $message = $consumer->consume(120 * 1000);
                
                switch ($message->err) {
                    case RD_KAFKA_RESP_ERR_NO_ERROR:
                        $this->handleMessage($message);
                        $messageCount++;
                        
                        if ($this->option('once')) {
                            $this->info("✅ {$messageCount} mensaje(s) consumido(s). Saliendo...");
                            $consumer->close();
                            return 0;
                        }
                        break;
                        
                    case RD_KAFKA_RESP_ERR__PARTITION_EOF:
                        $this->comment('⏳ Esperando nuevos mensajes...');
                        break;
                }
            }
        } catch (\Exception $e) {
            $this->error('❌ Error al consumir mensajes: ' . $e->getMessage());
            Log::error('Error en consumidor de Kafka', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 1;
        } finally {
            if (isset($consumer)) {
                $consumer->close();
                $this->info('🔌 Consumidor cerrado');
            }
        }
    }

    private function handleMessage(Message $message): void
    {
        try {
            $payload = json_decode($message->payload, true);
            
            if (!$payload) {
                $this->warn('⚠️  Payload vacío o inválido');
                return;
            }

            $userLog = UserLog::create([
                'user_id' => $payload['user_id'] ?? null,
                'action' => $payload['action'] ?? 'N/A',
                'route' => $payload['route'] ?? null,
                'ip_address' => $payload['ip_address'] ?? null,
                'user_agent' => $payload['user_agent'] ?? null,
                'status_code' => $payload['status_code'] ?? null,
                'execution_time' => $payload['execution_time'] ?? null,
                'metadata' => array_merge(
                    $payload['metadata'] ?? [],
                    [
                        'logged_at' => $payload['logged_at'] ?? now()->toIso8601String(),
                        'consumed_at' => now()->toIso8601String(),
                    ]
                ),
            ]);

            $userLog->load('user');

            event(new UserActivityStreamed($userLog));

            Log::info('✅ Log de Kafka guardado en BD', [
                'log_id' => $userLog->id,
                'action' => $userLog->action,
                'user_id' => $userLog->user_id
            ]);

        } catch (\Exception $e) {
            $this->error('❌ Error al procesar mensaje: ' . $e->getMessage());
            Log::error('Error al guardar log de Kafka en BD', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $message->payload ?? 'N/A'
            ]);
        }
    }
}
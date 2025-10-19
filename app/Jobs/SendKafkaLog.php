<?php

namespace App\Jobs;

use Exception;
use RdKafka\Conf;
use RdKafka\Producer;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendKafkaLog implements ShouldQueue
{
    use Queueable;

    public $topic;
    public $data;
    public $key;

    public function __construct(string $topic, array $data, string $key)
    {
        $this->topic = $topic;
        $this->data = $data;
        $this->key = $key;
    }

    public function handle(): void
    {
        try {
            $conf = new Conf();
            $conf->set('metadata.broker.list', config('kafka.brokers'));
            $conf->set('security.protocol', config('kafka.securityProtocol'));
            $conf->set('sasl.mechanism', config('kafka.sasl.mechanisms'));
            $conf->set('sasl.username', config('kafka.sasl.username'));
            $conf->set('sasl.password', config('kafka.sasl.password'));
            $conf->set('socket.timeout.ms', '60000');
            $conf->set('request.timeout.ms', '60000');
            $conf->set('message.timeout.ms', '120000');
            $conf->set('message.send.max.retries', config('kafka.flush_retries'));
            $conf->set('retry.backoff.ms', '1000');
            $conf->set('enable.ssl.certificate.verification', config('kafka.sasl.ssl'));

            $producer = new Producer($conf);
            $producer->setLogLevel(LOG_ERR);
            $kafkaTopic = $producer->newTopic($this->topic);

            $payload = json_encode($this->data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

            $kafkaTopic->produce(RD_KAFKA_PARTITION_UA, 0, $payload, $this->key);
            $producer->poll(0);
            $producer->flush(10000);

            Log::info('Mensaje enviado a Kafka exitosamente', [
                'topic' => $this->topic,
                'data_preview' => array_slice($this->data, 0, 3)
            ]);
        } catch (Exception $e) {
            Log::error('Error al enviar mensaje a Kafka', [
                'topic' => $this->topic,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}

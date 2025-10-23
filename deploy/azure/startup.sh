cp /home/default /etc/nginx/sites-enabled/default; service nginx restart
apt-get install -y supervisor librdkafka-dev
cp /home/laravel-worker.conf /etc/supervisor/conf.d/laravel-worker.conf
service supervisor start
supervisorctl reread
supervisorctl update
supervisorctl start laravel-worker:*
FROM php:8.2-cli

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_HOME=/app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      git \
      unzip \
      libzip-dev \
      libpq-dev && \
    docker-php-ext-install pdo pdo_pgsql && \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR ${APP_HOME}

COPY docker/backend/start.sh /usr/local/bin/start-backend.sh
RUN chmod +x /usr/local/bin/start-backend.sh

COPY . ${APP_HOME}

EXPOSE 8000
CMD ["start-backend.sh"]

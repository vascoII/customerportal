
FROM php:8.3-cli

LABEL maintainer="Techem Customer Portal"

WORKDIR /var/www/backend

# Install system dependencies and PHP extensions commonly used by Symfony
RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  unzip \
  libicu-dev \
  libzip-dev \
  libpq-dev \
  libonig-dev \
  zlib1g-dev \
  libxml2-dev \
  && docker-php-ext-configure intl \
  && docker-php-ext-install -j"$(nproc)" \
  intl \
  pdo_mysql \
  zip \
  opcache \
  && rm -rf /var/lib/apt/lists/*

# Install Composer (v2) from the official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Environment defaults for Symfony
ENV APP_ENV=dev \
  COMPOSER_ALLOW_SUPERUSER=1 \
  PHP_OPCACHE_VALIDATE_TIMESTAMPS=1 \
  PHP_OPCACHE_MAX_ACCELERATED_FILES=20000

# Expose the dev server port
EXPOSE 8000

# Default command: start PHP built-in server for Symfony (dev use only)
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]



#!/usr/bin/env bash
# setup.sh — Configura o backend Laravel após composer install
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "==> Gerando APP_KEY..."
php artisan key:generate --ansi

echo "==> Descobrindo pacotes..."
php artisan package:discover --ansi

echo "==> Limpando caches..."
php artisan optimize:clear

echo ""
echo "Backend pronto. Para iniciar o servidor:"
echo "php artisan serve"

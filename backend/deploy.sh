#!/bin/bash

# ============================================
# Script de Deploy - Laravel Backend
# ============================================
# Prepara uma pasta com tudo pronto para upload via FTP

set -e  # Para em caso de erro


# Diretório base
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
DEPLOY_DIR="$BASE_DIR/deploy"

# Limpar deploy anterior
if [ -d "$DEPLOY_DIR" ]; then
    echo "Limpando deploy anterior..."
    rm -rf "$DEPLOY_DIR"
fi

# Criar diretório de deploy
echo "Criando estrutura de deploy..."
mkdir -p "$DEPLOY_DIR"

# Verificar se existe composer.lock
if [ ! -f "$BASE_DIR/composer.lock" ]; then
    echo "Erro: composer.lock não encontrado!"
    echo "Execute 'composer install' primeiro."
    exit 1
fi

# Instalar/atualizar dependências de produção
echo "Instalando dependências de produção..."
cd "$BASE_DIR"
composer install --no-dev --optimize-autoloader --no-interaction

# Limpar caches com paths absolutos antes de copiar
echo "Limpando caches com paths absolutos..."
rm -f "$BASE_DIR/bootstrap/cache/config.php"
rm -f "$BASE_DIR/bootstrap/cache/routes-v7.php"

# Copiar arquivos essenciais
echo "Copiando arquivos do projeto..."

# Diretórios principais
cp -r "$BASE_DIR/app" "$DEPLOY_DIR/"
cp -r "$BASE_DIR/bootstrap" "$DEPLOY_DIR/"
cp -r "$BASE_DIR/config" "$DEPLOY_DIR/"
cp -r "$BASE_DIR/public" "$DEPLOY_DIR/"
cp -r "$BASE_DIR/resources" "$DEPLOY_DIR/"
cp -r "$BASE_DIR/routes" "$DEPLOY_DIR/"
cp -r "$BASE_DIR/vendor" "$DEPLOY_DIR/"

# Criar estrutura de storage (sem arquivos temporários)
echo "Criando estrutura de storage..."
mkdir -p "$DEPLOY_DIR/storage/app/public"
mkdir -p "$DEPLOY_DIR/storage/app/data"
mkdir -p "$DEPLOY_DIR/storage/framework/cache/data"
mkdir -p "$DEPLOY_DIR/storage/framework/sessions"
mkdir -p "$DEPLOY_DIR/storage/framework/views"
mkdir -p "$DEPLOY_DIR/storage/logs"

# Criar arquivos .gitkeep para garantir que pastas sejam enviadas via FTP
echo "Criando arquivos .gitkeep nas pastas do storage..."
touch "$DEPLOY_DIR/storage/app/public/.gitkeep"
touch "$DEPLOY_DIR/storage/app/data/.gitkeep"
touch "$DEPLOY_DIR/storage/framework/cache/.gitkeep"
touch "$DEPLOY_DIR/storage/framework/cache/data/.gitkeep"
touch "$DEPLOY_DIR/storage/framework/sessions/.gitkeep"
touch "$DEPLOY_DIR/storage/framework/views/.gitkeep"
touch "$DEPLOY_DIR/storage/logs/.gitkeep"

# Criar index.html em pastas sensíveis para evitar listagem
cat > "$DEPLOY_DIR/storage/framework/views/index.html" << 'EOF'
<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body><h1>Forbidden</h1></body></html>
EOF

# Copiar api-docs se existir
if [ -d "$BASE_DIR/storage/api-docs" ]; then
    cp -r "$BASE_DIR/storage/api-docs" "$DEPLOY_DIR/storage/"
fi

# Copiar arquivos raiz necessários
cp "$BASE_DIR/artisan" "$DEPLOY_DIR/"
cp "$BASE_DIR/composer.json" "$DEPLOY_DIR/"
cp "$BASE_DIR/composer.lock" "$DEPLOY_DIR/"

# Verificar e copiar .env existente
echo "Copiando arquivo .env..."
if [ ! -f "$BASE_DIR/.env" ]; then
    echo "Erro: arquivo .env não encontrado!"
    echo "Crie um arquivo .env na pasta backend antes de executar o deploy."
    exit 1
fi

cp "$BASE_DIR/.env" "$DEPLOY_DIR/"
echo "Arquivo .env copiado com sucesso!"

# Nota: Não geramos caches aqui pois eles contêm caminhos absolutos do ambiente de desenvolvimento
# O Laravel irá gerar os caches automaticamente no servidor quando necessário

# Criar arquivo .htaccess para proteção (se não existir)
if [ ! -f "$DEPLOY_DIR/public/.htaccess" ]; then
    echo "Criando .htaccess..."
    cat > "$DEPLOY_DIR/public/.htaccess" << 'EOF'
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
EOF
fi

# Criar arquivo de proteção para diretórios sensíveis
echo "Protegendo diretórios sensíveis..."
echo "deny from all" > "$DEPLOY_DIR/storage/.htaccess"
echo "deny from all" > "$DEPLOY_DIR/bootstrap/cache/.htaccess"

# Criar arquivo com informações do deploy
cat > "$DEPLOY_DIR/deploy-info.txt" << EOF
Deploy gerado em: $(date)
Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
Commit: $(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
PHP Version: $(php -v | head -n 1)
Laravel Version: $(cd "$BASE_DIR" && php artisan --version)
EOF

# Comprimir para facilitar upload
echo "Comprimindo arquivos para deploy..."
cd "$BASE_DIR"
zip -r deploy.zip deploy/ -q

DEPLOY_SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)
ZIP_SIZE=$(du -sh "$BASE_DIR/deploy.zip" | cut -f1)


# Restaurar dependências de desenvolvimento
echo "Restaurando dependências de desenvolvimento..."
cd "$BASE_DIR"
composer install --quiet
echo "Deploy preparado com sucesso!"
#!/usr/bin/env bash
# Builda e envia imagens Docker para o Nexus local
# Uso: ./scripts/build-push.sh [backend|frontend-web|all] [versao]
# Exemplo: ./scripts/build-push.sh all 1.0.0

set -euo pipefail

REGISTRY="localhost:8082"
SERVICE="${1:-all}"
VERSION="${2:-latest}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

login_registry() {
  echo ">>> Autenticando no registry ${REGISTRY}"
  docker login "${REGISTRY}" || {
    echo "ERRO: Falha ao autenticar no Nexus. Verifique se o serviço está rodando: docker compose up -d nexus"
    exit 1
  }
}

build_and_push() {
  local name=$1
  local context="${PROJECT_ROOT}/${name}"
  local image="${REGISTRY}/clinic/${name}:${VERSION}"

  echo ">>> Building ${image}"
  nice -n 10 docker build -t "$image" "$context"

  echo ">>> Pushing ${image}"
  docker push "$image"

  if [ "$VERSION" != "latest" ]; then
    docker tag "$image" "${REGISTRY}/clinic/${name}:latest"
    docker push "${REGISTRY}/clinic/${name}:latest"
  fi

  echo "✓ ${name} publicado: ${image}"
}

cd "$PROJECT_ROOT"

login_registry

case "$SERVICE" in
  backend)
    build_and_push "backend"
    ;;
  frontend-web)
    build_and_push "frontend-web"
    ;;
  all)
    build_and_push "backend"
    build_and_push "frontend-web"
    ;;
  *)
    echo "Uso: $0 [backend|frontend-web|all] [versao]"
    exit 1
    ;;
esac

echo ""
echo "Imagens disponíveis no Nexus: http://localhost:8081"

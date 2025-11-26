# Executando Testes com Docker

Este projeto inclui suporte para executar os testes usando Docker, garantindo um ambiente consistente e isolado.

## Pré-requisitos

- Docker instalado
- Docker Compose instalado (geralmente vem com Docker Desktop)

## Executando Testes Localmente com Docker

### Usando Docker Compose (Recomendado)

```bash
# Executar os testes
npm run test:docker

# Ou diretamente com docker-compose
docker-compose up --build
```

Os resultados dos testes serão salvos nas pastas:
- `test-results/` - Resultados JSON e screenshots
- `playwright-report/` - Relatório HTML
- `allure-results/` - Resultados do Allure

### Usando Docker diretamente

```bash
# Build da imagem
docker build -t dog-api-tests:latest .

# Executar os testes
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/playwright-report:/app/playwright-report \
  -v $(pwd)/allure-results:/app/allure-results \
  dog-api-tests:latest
```

### Limpar volumes e containers

```bash
npm run test:docker:clean

# Ou diretamente
docker-compose down -v
```

## Estrutura Docker

- **Dockerfile**: Imagem baseada no Playwright oficial com Node.js
- **docker-compose.yml**: Configuração para desenvolvimento local
- **.dockerignore**: Arquivos excluídos do build para otimização

## GitHub Actions

O workflow do GitHub Actions (`/.github/workflows/api-tests.yml`) executa automaticamente os testes em:
- Push para branches `main` ou `develop`
- Pull Requests para `main` ou `develop`
- Execução manual via `workflow_dispatch`

Os resultados são salvos como artefatos no GitHub Actions e podem ser baixados após a execução.


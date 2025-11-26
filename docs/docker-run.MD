# Docker Setup

Este diretório contém informações sobre a configuração Docker do projeto de testes de API.

## Imagem Base

A imagem Docker utiliza a imagem oficial do Playwright da Microsoft:
- `mcr.microsoft.com/playwright:v1.40.0-focal`

Esta imagem já inclui:
- Node.js
- Playwright
- Dependências do sistema necessárias

## Build da Imagem

```bash
docker build -t dog-api-tests:latest .
```

### Rebuild da Imagem

Para reconstruir a imagem Docker, você pode usar os seguintes comandos:

**Rebuild simples (usa cache quando possível):**
```bash
docker build -t dog-api-tests:latest .
```

O Dockerfile está otimizado para cache:
- Dependências (`package*.json`) são copiadas primeiro
- A layer de `npm ci` só é reconstruída se `package.json` mudar
- O código fonte é copiado por último, invalidando apenas essa layer quando necessário

**Rebuild completo (sem cache, mais lento mas garante tudo novo):**
```bash
docker build --no-cache -t dog-api-tests:latest .
```

**Usando docker-compose:**
```bash
docker-compose build --no-cache
```

## Execução

### Todos os testes
```bash
docker run --rm dog-api-tests:latest
```

### Com volumes para resultados
```bash
docker run --rm \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/playwright-report:/app/playwright-report \
  -v $(pwd)/allure-results:/app/allure-results \
  dog-api-tests:latest
```

## Docker Compose

O `docker-compose.yml` facilita a execução com volumes pré-configurados:

```bash
# Executar testes
docker-compose up --build

# Ou usando npm
npm run test:docker
```

### Limpar containers e volumes

```bash
npm run test:docker:clean

# Ou diretamente
docker-compose down -v
```

## Otimizações de Cache

O Dockerfile está otimizado para aproveitar o cache de layers:

1. **Ordem de layers**: `package*.json` é copiado antes do código
2. **Cache de dependências**: A layer de `npm ci` só é reconstruída se `package.json` mudar
3. **Flags npm**: `--prefer-offline --no-audit` para acelerar instalação

### Cache no GitHub Actions

O workflow do GitHub Actions usa cache do Docker:
- `cache-from: type=gha` - Lê cache do GitHub Actions
- `cache-to: type=gha,mode=max` - Salva cache no GitHub Actions

Isso acelera significativamente os builds em CI/CD.

## Troubleshooting

### Erro de permissão
Se encontrar erros de permissão ao salvar resultados:
```bash
sudo chown -R $USER:$USER test-results playwright-report allure-results
```

### Limpar imagens antigas
```bash
docker rmi dog-api-tests:latest
docker system prune -a
```

### Verificar cache
Para verificar se o cache está sendo usado:
```bash
docker build --progress=plain -t dog-api-tests:latest .
```

As layers que aparecem como `CACHED` estão sendo reutilizadas.

## Estrutura de Resultados

Após a execução, os seguintes diretórios serão criados:

- **`test-results/`**: Contém resultados JSON, screenshots (se houver falhas) e traces
- **`playwright-report/`**: Contém o relatório HTML interativo
- **`allure-results/`**: Contém resultados do Allure (se configurado)

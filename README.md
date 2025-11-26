# Dog API Tests

## 📋 Descrição

Projeto de testes automatizados de API para a [Dog API](https://dog.ceo/dog-api/documentation/) utilizando Playwright e TypeScript. O projeto foi desenvolvido seguindo as melhores práticas de testes de API, com arquitetura baseada em Service Layer, fixtures customizadas e validações robustas.

## 🎯 Objetivo

Garantir a qualidade e confiabilidade da integração com a Dog API através de testes automatizados que validam:
- Estrutura e schema das respostas
- Status HTTP e headers
- Dados retornados
- Cenários positivos e negativos
- Tratamento de erros

## 📊 Endpoints Testados

### 1. GET /breeds/list/all
Lista todas as raças de cães disponíveis, incluindo sub-raças.

**Cenários:**
- ✅ Schema válido da resposta
- ✅ Raças com sub-raças
- ✅ Raças sem sub-raças
- ✅ Raças conhecidas específicas
- ✅ Erro 404 para endpoint inexistente
- ✅ Erro para método HTTP incorreto

### 2. GET /breeds/image/random
Retorna uma URL de imagem aleatória de qualquer raça.

**Cenários:**
- ✅ Status HTTP 200
- ✅ Schema válido
- ✅ URL válida de imagem
- ✅ Content-Type JSON
- ✅ Aleatoriedade (múltiplas chamadas)
- ✅ Erro para método HTTP incorreto
- ✅ Erro 404 para endpoint inexistente

### 3. GET /breed/{breed}/images/random
Retorna uma URL de imagem aleatória de uma raça específica.

**Cenários:**
- ✅ Status HTTP 200 para raça válida
- ✅ Schema válido
- ✅ URL válida que pertence à raça
- ✅ Múltiplas raças válidas
- ✅ Erro 404 para raça inexistente
- ✅ Erro para método HTTP incorreto

## 🏗️ Arquitetura

O projeto segue uma arquitetura organizada e escalável:

```
dog-api-tests/
├── tests/              # Arquivos de teste (.test.ts)
├── services/           # API Clients (Service Layer)
│   ├── list-all/      # Service para listar raças
│   └── random-image/  # Service para imagens aleatórias
├── fixtures/           # Fixtures customizadas do Playwright
├── utils/              # Utilitários, validadores e constantes
├── docs/               # Documentação do projeto
└── .github/workflows/  # GitHub Actions workflows
```

### Padrões Implementados

- **Service Layer**: Encapsula chamadas à API em classes reutilizáveis
- **Fixtures Customizadas**: Disponibiliza services nos testes via fixtures
- **Validadores**: Funções reutilizáveis para validação de estruturas complexas
- **Separação de Responsabilidades**: Services fazem chamadas, testes fazem validações

## 📚 Documentação

### Planejamento dos Testes

Para entender a estratégia de testes, os cenários escolhidos e a justificativa técnica das decisões:

📄 **[Plano de Testes](./docs/test-plan.MD)**

Este documento detalha:
- Os endpoints testados e cenários implementados
- A escolha da tecnologia Playwright para testes de API
- A arquitetura do projeto (Service Layer, Fixtures)
- A estratégia de cobertura e validação

### Observações do Projeto

Para entender as decisões técnicas, adaptações implementadas e configurações:

📄 **[Observações do Projeto](./docs/observations.MD)**

Este documento aborda:
- Decisões arquiteturais e suas justificativas
- Estrutura de Services e métodos
- Configuração de Base URL e constantes
- Otimizações de cache (Docker e GitHub Actions)
- Estratégias de validação

### Boas Práticas

Para conhecer as boas práticas implementadas e recomendações de desenvolvimento:

📄 **[Boas Práticas](./docs/best-practices.MD)**

Este documento detalha:
- Estrutura de pastas e organização do projeto
- Separação de responsabilidades entre Services e testes
- Padrões para uso de expects e validações
- Convenções de nomenclatura e organização de código
- Diretrizes para manutenção e evolução do projeto

### Como Executar o Projeto

Para configurar e executar o projeto em sua máquina local:

📄 **[Como Executar o Projeto](./docs/run-project.MD)**

Este documento inclui:
- Instruções de instalação para macOS, Linux e Windows
- Configuração de pré-requisitos (Node.js, npm, Git)
- Comandos para executar testes em diferentes modos
- Troubleshooting e soluções para problemas comuns

### Execução via Docker

Para executar os testes em ambiente containerizado:

📄 **[Execução via Docker](./docs/docker-run.MD)**

Este documento inclui:
- Como construir a imagem Docker
- Como executar testes no Docker
- Como usar docker-compose
- Otimizações de cache
- Troubleshooting

## 🚀 Início Rápido

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Git

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd dog-api-tests

# Instale as dependências
npm install

# Execute os testes
npm test
```

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo debug
npm run test:debug

# Visualizar relatório HTML
npm run test:report

# Executar testes com Docker
npm run test:docker

# Limpar containers Docker
npm run test:docker:clean

# Lint do código
npm run lint

# Formatar código
npm run format
```

## 🐳 Docker

O projeto inclui suporte completo para execução via Docker:

```bash
# Executar testes com Docker Compose
npm run test:docker

# Ou diretamente
docker-compose up --build
```

**Vantagens:**
- Ambiente isolado e consistente
- Não requer instalação local dos browsers
- Fácil integração com CI/CD
- Cache otimizado para builds rápidos

Para mais detalhes, consulte a [documentação de Docker](./docs/docker-run.MD).

## 🔄 CI/CD - GitHub Actions

Os testes são executados automaticamente via **GitHub Actions** em:
- Push para branch `main`
- Pull Requests para qualquer branch
- Execução manual via `workflow_dispatch`

### Recursos do GitHub Actions

- ✅ Execução automática de testes em cada push/PR
- ✅ Build otimizado com cache de Docker
- ✅ Execução em ambiente isolado (Docker)
- ✅ Geração automática de relatórios HTML
- ✅ Upload de artefatos para download:
  - `test-results` - Resultados completos
  - `test-results-json` - JSON dos resultados
  - `playwright-html-report` - Relatório HTML interativo
- ✅ Retenção de artefatos por 30 dias

### Visualizar Resultados

1. Acesse a aba **"Actions"** no repositório GitHub
2. Selecione o workflow **"Api Tests"**
3. Baixe os artefatos para visualizar relatórios detalhados

## 🧪 Estrutura de Testes

### Exemplo de Teste

```typescript
test('deve retornar schema válido da resposta', async ({ listAll }) => {
  const response = await listAll.getAllBreeds();
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
  
  const data = await listAll.parseBreedsListResponse(response);
  expect(data.status).toBe('success');
  expect(validateBreedsListResponse(data)).toBeTruthy();
});
```

### Padrões de Teste

- ✅ Um teste por cenário
- ✅ Validações explícitas (sem helpers que escondem expects)
- ✅ Testes positivos e negativos
- ✅ Uso de validadores para estruturas complexas

## 📦 Tecnologias

- **Playwright** - Framework de testes (API Testing)
- **TypeScript** - Type-safety e melhor DX
- **Docker** - Containerização e CI/CD
- **GitHub Actions** - Integração contínua
- **Allure** - Relatórios avançados (opcional)

## 📈 Resultados

Após a execução dos testes, os seguintes diretórios são criados:

- **`test-results/`** - Resultados JSON, screenshots (se houver falhas) e traces
- **`playwright-report/`** - Relatório HTML interativo
- **`allure-results/`** - Resultados do Allure (se configurado)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🔗 Links Úteis

- [Dog API Documentation](https://dog.ceo/dog-api/documentation/)
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

Desenvolvido com ❤️ para garantir a qualidade da integração com a Dog API

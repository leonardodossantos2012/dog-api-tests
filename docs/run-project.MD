# Como Executar o Projeto

Este guia explica como configurar e executar o projeto de testes de API localmente.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Git** (para clonar o repositório)

## Configuração por Sistema Operacional

### macOS

#### Instalação do Node.js

**Opção 1: Usando Homebrew (recomendado)**
```bash
# Instalar Homebrew (se ainda não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node
```

**Opção 2: Download direto**
- Acesse [nodejs.org](https://nodejs.org/) e baixe o instalador para macOS
- Execute o instalador e siga as instruções

#### Verificar instalação
```bash
node --version
npm --version
```

#### Instalação do Playwright
Após instalar as dependências do projeto, instale os browsers (opcional para testes de API):
```bash
npm install
npx playwright install
```

**Nota**: Para testes de API, os browsers não são obrigatórios, mas podem ser úteis para testes integrados.

### Linux

#### Instalação do Node.js

**Ubuntu/Debian:**
```bash
# Atualizar pacotes
sudo apt update

# Instalar Node.js e npm
sudo apt install nodejs npm

# Ou instalar versão mais recente via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Fedora/RHEL/CentOS:**
```bash
# Instalar Node.js e npm
sudo dnf install nodejs npm

# Ou via NodeSource
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

**Arch Linux:**
```bash
sudo pacman -S nodejs npm
```

### Windows

#### Instalação do Node.js

**Opção 1: Download direto (recomendado)**
- Acesse [nodejs.org](https://nodejs.org/)
- Baixe o instalador LTS para Windows
- Execute o instalador e siga as instruções
- Certifique-se de marcar a opção "Add to PATH" durante a instalação

**Opção 2: Usando Chocolatey**
```powershell
# Instalar Chocolatey (se ainda não tiver)
# Execute no PowerShell como Administrador:
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar Node.js
choco install nodejs
```

**Opção 3: Usando Winget**
```powershell
winget install OpenJS.NodeJS.LTS
```

#### Verificar instalação
Abra o **PowerShell** ou **Prompt de Comando** e execute:
```powershell
node --version
npm --version
```

## Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd dog-api-tests
```

### 2. Instale as dependências

```bash
npm install
```

Este comando instalará todas as dependências do projeto listadas no `package.json`, incluindo:
- `@playwright/test` - Framework de testes
- `typescript` - Compilador TypeScript
- `@types/node` - Tipos TypeScript para Node.js
- `allure-playwright` - Integração com Allure

### 3. Instale os browsers do Playwright (opcional)

Para testes de API, os browsers não são obrigatórios, mas podem ser úteis:

```bash
npx playwright install
```

## Executando os Testes Localmente

### Executar todos os testes

```bash
npm test
```

ou

```bash
npx playwright test
```

### Executar testes em modo debug

```bash
npm run test:debug
```

Abre o Playwright Inspector para debug interativo dos testes.

### Executar testes específicos

```bash
# Apenas testes de lista de raças
npx playwright test tests/breeds.list.test.ts

# Apenas testes de imagens aleatórias
npx playwright test tests/random.image.test.ts

# Apenas testes de imagens de raça específica
npx playwright test tests/breed.images.test.ts
```

### Executar testes com filtro

```bash
npx playwright test --grep "deve retornar status 200"
```

### Visualizar relatório de testes

Após executar os testes, você pode visualizar o relatório HTML:

```bash
npm run test:report
```

O relatório será aberto automaticamente no navegador, mostrando:
- Resultados dos testes (passou/falhou)
- Tempo de execução
- Traces para debug
- Screenshots (se houver falhas)

## Estrutura de Resultados

Após a execução dos testes, os seguintes diretórios serão criados:

- **`test-results/`**: Contém resultados JSON, screenshots (se houver falhas) e traces
- **`playwright-report/`**: Contém o relatório HTML interativo
- **`allure-results/`**: Contém resultados do Allure (se configurado)

## Execução via Docker

Para executar os testes em um ambiente containerizado com Docker, consulte a documentação completa:

📄 **[Execução via Docker](./docker-run.MD)**

A documentação de Docker inclui:
- Como construir a imagem Docker
- Como executar testes no Docker
- Como usar docker-compose
- Troubleshooting e soluções de problemas comuns
- Comandos para rebuild da imagem

**Comandos rápidos:**

```bash
# Executar testes com Docker Compose
npm run test:docker

# Limpar containers e volumes
npm run test:docker:clean
```

**Vantagens da execução via Docker:**
- Ambiente isolado e consistente
- Não requer instalação local dos browsers
- Fácil integração com CI/CD
- Mesmo ambiente em diferentes máquinas

## GitHub Actions

O projeto inclui um workflow do GitHub Actions que executa automaticamente os testes em:
- Push para branch `main`
- Pull Requests para qualquer branch
- Execução manual via `workflow_dispatch`

Os resultados são salvos como artefatos e podem ser baixados após a execução.

## Estrutura do Projeto

```
dog-api-tests/
├── tests/              # Arquivos de teste
├── services/           # API Clients (Services)
├── fixtures/           # Fixtures do Playwright
├── utils/              # Utilitários e validadores
├── docs/               # Documentação
├── Dockerfile          # Imagem Docker
├── docker-compose.yml  # Configuração Docker Compose
└── playwright.config.ts # Configuração do Playwright
```

## Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro de permissão (Docker)
```bash
sudo chown -R $USER:$USER test-results playwright-report allure-results
```

### Limpar cache do npm
```bash
npm cache clean --force
```

### Verificar versão do Node.js
```bash
node --version  # Deve ser 18 ou superior
```

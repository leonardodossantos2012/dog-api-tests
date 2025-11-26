# Dog API Tests

Projeto de testes automatizados de API para a [Dog API](https://dog.ceo/dog-api/documentation/) utilizando Playwright e TypeScript.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico de QA, com o objetivo de garantir a qualidade da integração com a Dog API. A aplicação permite que os usuários visualizem imagens de diferentes raças de cães e aprendam sobre as raças disponíveis.

## 🏗️ Estrutura do Projeto

```
dog-api-tests/
├── api/                    # Cliente da API
│   └── dog-api.client.ts   # Cliente encapsulado para interação com a API
├── fixtures/               # Fixtures do Playwright
│   └── api.fixture.ts      # Fixture customizada com API client
├── tests/                  # Testes automatizados
│   ├── breeds-list.test.ts      # Testes para GET /breeds/list/all
│   ├── breed-images.test.ts     # Testes para GET /breed/{breed}/images
│   └── random-image.test.ts     # Testes para GET /breeds/image/random
├── types/                  # Definições de tipos TypeScript
│   └── api.types.ts        # Tipos para respostas da API
├── utils/                  # Utilitários e helpers
│   ├── validators.ts       # Funções de validação
│   └── test-helpers.ts     # Helpers para testes
├── playwright.config.ts    # Configuração do Playwright
├── tsconfig.json           # Configuração do TypeScript
└── package.json           # Dependências do projeto
```

## 🚀 Configuração do Ambiente

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd dog-api-tests
```

2. Instale as dependências:
```bash
npm install
```

3. Instale os browsers do Playwright (se necessário):
```bash
npx playwright install
```

## 🧪 Executando os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes com interface gráfica
```bash
npm run test:ui
```

### Executar testes em modo debug
```bash
npm run test:debug
```

### Executar testes específicos
```bash
# Testes de lista de raças
npx playwright test tests/breeds-list.test.ts

# Testes de imagens de raça
npx playwright test tests/breed-images.test.ts

# Testes de imagem aleatória
npx playwright test tests/random-image.test.ts
```

### Executar testes em modo headed (com browser visível)
```bash
npm run test:headed
```

## 📊 Relatórios

### Relatório HTML do Playwright
Após executar os testes, visualize o relatório HTML:
```bash
npm run test:report
```

O relatório será aberto automaticamente no navegador, mostrando:
- Resultados de cada teste (sucesso/falha)
- Tempo de execução
- Screenshots de falhas (quando aplicável)
- Traces de requisições
- Logs detalhados

### Relatório Allure
Para gerar relatório Allure:
```bash
npm run test:allure
```

## 📝 Endpoints Testados

### 1. GET /breeds/list/all
Retorna uma lista completa de todas as raças de cães disponíveis, incluindo sub-raças.

**Testes implementados:**
- ✅ Validação de status HTTP 200
- ✅ Validação da estrutura de resposta
- ✅ Verificação de presença de raças
- ✅ Validação de raças conhecidas
- ✅ Verificação de raças com sub-raças
- ✅ Validação de consistência entre chamadas
- ✅ Validação de tempo de resposta

### 2. GET /breed/{breed}/images
Retorna uma lista de URLs de imagens para uma raça específica.

**Testes implementados:**
- ✅ Validação de status HTTP 200 para raças válidas
- ✅ Validação da estrutura de resposta
- ✅ Verificação de URLs válidas de imagens
- ✅ Testes com múltiplas raças válidas
- ✅ Tratamento de erros (404 para raças inexistentes)
- ✅ Validação de URLs com domínio correto
- ✅ Validação de tempo de resposta
- ✅ Testes de casos negativos (raça vazia, caracteres especiais)

### 3. GET /breeds/image/random
Retorna uma URL de imagem aleatória de um cão.

**Testes implementados:**
- ✅ Validação de status HTTP 200
- ✅ Validação da estrutura de resposta
- ✅ Verificação de URL válida de imagem
- ✅ Validação de aleatoriedade (imagens diferentes)
- ✅ Validação de tempo de resposta
- ✅ Testes de requisições simultâneas
- ✅ Validação de formatos de imagem

## 🎯 Boas Práticas Implementadas

### Arquitetura
- **Separação de responsabilidades**: Cliente da API, validadores, helpers e testes em módulos separados
- **Page Object Pattern**: Cliente da API encapsula todas as interações
- **Fixtures customizadas**: API client disponível em todos os testes via fixture
- **TypeScript**: Tipagem forte para maior segurança e autocompletar

### Qualidade de Código
- **Validações robustas**: Funções de validação reutilizáveis
- **Testes abrangentes**: Casos positivos e negativos
- **Documentação**: Código documentado com JSDoc
- **Linting e formatação**: ESLint e Prettier configurados

### Testes
- **Testes independentes**: Cada teste pode ser executado isoladamente
- **Assertions claras**: Mensagens de erro descritivas
- **Validação de performance**: Testes de tempo de resposta
- **Casos de borda**: Testes para cenários de erro

## 🔧 Configurações

### Playwright Config
O arquivo `playwright.config.ts` contém:
- Base URL da API: `https://dog.ceo/api`
- Configuração de retries em CI
- Múltiplos reporters (HTML, JSON, Allure)
- Traces e screenshots em caso de falha

### TypeScript Config
Configuração estrita do TypeScript para:
- Detecção de erros em tempo de compilação
- Melhor suporte de IDE
- Type safety completo

## 📈 Resultados dos Testes

Após a execução, os resultados são salvos em:
- `playwright-report/` - Relatório HTML interativo
- `test-results/` - Screenshots, vídeos e traces
- `allure-results/` - Dados para relatório Allure

## 🐛 Troubleshooting

### Erros comuns

**Erro: "Cannot find module"**
```bash
npm install
```

**Erro: "Playwright browsers not installed"**
```bash
npx playwright install
```

**Testes falhando por timeout**
- Verifique sua conexão com a internet
- A API pode estar temporariamente indisponível

## 📚 Documentação Adicional

- [Documentação da Dog API](https://dog.ceo/dog-api/documentation/)
- [Documentação do Playwright](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

Desenvolvido como parte de um desafio técnico de QA.

---

**Nota**: Este projeto é apenas para fins de teste e demonstração. A Dog API é um serviço gratuito, então por favor use com moderação.

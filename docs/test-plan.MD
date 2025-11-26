# Plano de Testes - Dog API

## Contexto do Projeto

Este projeto implementa testes automatizados de API para a [Dog API](https://dog.ceo/dog-api/documentation/), uma API pública que fornece imagens e informações sobre raças de cães.

## Endpoints Testados

### 1. GET /breeds/list/all
Retorna uma lista completa de todas as raças de cães disponíveis, incluindo sub-raças.

**Cenários implementados:**
- ✅ Validação de schema válido da resposta
- ✅ Validação de raça com sub-raças
- ✅ Validação de raça sem sub-raças
- ✅ Validação de raças conhecidas específicas
- ✅ Erro 404 para endpoint inexistente
- ✅ Erro para método HTTP incorreto

### 2. GET /breeds/image/random
Retorna uma URL de imagem aleatória de qualquer raça.

**Cenários implementados:**
- ✅ Status HTTP 200
- ✅ Schema válido da resposta
- ✅ URL válida de imagem
- ✅ Content-Type JSON
- ✅ Aleatoriedade (múltiplas chamadas retornam URLs diferentes)
- ✅ Erro para método HTTP incorreto
- ✅ Erro 404 para endpoint inexistente

### 3. GET /breed/{breed}/images/random
Retorna uma URL de imagem aleatória de uma raça específica.

**Cenários implementados:**
- ✅ Status HTTP 200 para raça válida
- ✅ Schema válido para raça válida
- ✅ URL válida que pertence à raça especificada
- ✅ Imagem válida para múltiplas raças
- ✅ Erro 404 para raça inexistente
- ✅ Erro para método HTTP incorreto

## Escolha da Tecnologia: Playwright

### Por que Playwright para testes de API?

O **Playwright** foi escolhido como ferramenta de automação pelos seguintes motivos:

#### 1. **Unificação de Ferramentas**
- Permite testar tanto frontend quanto API na mesma ferramenta
- Reduz dependências e complexidade do projeto
- Facilita testes integrados (API + UI)

#### 2. **API Testing Nativo**
- Suporte nativo para requisições HTTP via `APIRequestContext`
- Não requer bibliotecas adicionais (axios, fetch, etc.)
- TypeScript nativo com type-safety

#### 3. **Recursos Avançados**
- Interceptação de requisições de rede
- Validação de status codes, headers e payloads
- Suporte a autenticação e headers customizados
- Trace viewer para debug detalhado

#### 4. **Ecossistema Robusto**
- Comunidade ativa e crescente
- Documentação excelente
- Integração com CI/CD
- Suporte oficial e atualizações frequentes

#### 5. **Performance e Confiabilidade**
- Execução rápida de testes de API
- Auto-retry configurável
- Relatórios detalhados

## Arquitetura do Projeto

### Padrão Service Layer

O projeto utiliza o padrão **Service Layer** para organizar as chamadas à API:

```typescript
// Service: services/list-all/dog.list.ts
export class DogListAll {
  async getAllBreeds(): Promise<APIResponse> {
    return await this.request.get('breeds/list/all');
  }
}
```

**Vantagens:**
- Separação de responsabilidades
- Reutilização de código
- Facilita manutenção
- Testes mais limpos

### Fixtures Customizadas

Fixtures do Playwright disponibilizam os services nos testes:

```typescript
// fixtures/api.fixture.ts
export const test = base.extend<TestFixtures>({
  listAll: async ({}, use): Promise<void> => {
    const apiRequest = await request.newContext({
      baseURL: API_BASE_URL,
    });
    const client = new DogListAll(apiRequest);
    await use(client);
    await apiRequest.dispose();
  },
});
```

**Uso nos testes:**
```typescript
test('exemplo', async ({ listAll }) => {
  const response = await listAll.getAllBreeds();
  // ...
});
```

### Validadores

Funções de validação reutilizáveis para estruturas complexas:

```typescript
// utils/validators.ts
export function validateBreedsListResponse(data: BreedsListResponse): boolean {
  return (
    data.status === 'success' &&
    typeof data.message === 'object' &&
    data.message !== null &&
    !Array.isArray(data.message)
  );
}
```

## Estratégia de Testes

### Cobertura de Cenários

Cada endpoint é testado com:

1. **Cenários Positivos:**
   - Status HTTP correto
   - Schema válido
   - Dados corretos
   - Estrutura de resposta esperada

2. **Cenários Negativos:**
   - Endpoints inexistentes (404)
   - Métodos HTTP incorretos (405)
   - Dados inválidos
   - Estrutura de erro esperada

### Princípios Aplicados

1. **Um teste por cenário**: Cada teste valida um único aspecto
2. **Validações explícitas**: Expects diretos, sem helpers que escondem validações
3. **Reutilização**: Services e validadores são reutilizados
4. **Manutenibilidade**: Código limpo e bem organizado

## Integração com CI/CD

O projeto inclui:

- **Docker**: Ambiente isolado e consistente
- **GitHub Actions**: Execução automática de testes
- **Cache otimizado**: Builds mais rápidos
- **Artefatos**: Resultados salvos automaticamente

## Conclusão

A escolha do Playwright e da arquitetura implementada proporciona:

- ✅ **Cobertura completa** dos endpoints principais
- ✅ **Base sólida** para expansão futura
- ✅ **Ferramenta moderna** e poderosa
- ✅ **Manutenibilidade** e escalabilidade
- ✅ **Integração** com CI/CD

Esta abordagem garante que os testes sejam confiáveis, rápidos e fáceis de manter, enquanto cobrem os casos de uso mais críticos da API.

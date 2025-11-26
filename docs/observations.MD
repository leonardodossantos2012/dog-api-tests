# Observações sobre o Projeto

## Estrutura e Organização

### Separação de Responsabilidades

O projeto segue uma arquitetura clara que separa:

1. **Services** (`services/`): Responsáveis apenas por fazer chamadas à API
2. **Testes** (`tests/`): Responsáveis por validações e expects
3. **Validadores** (`utils/validators.ts`): Funções de validação reutilizáveis
4. **Fixtures** (`fixtures/`): Configuração e setup dos services

### Por que não usar helpers de expect?

1. **Transparência**: Deixa explícito o que está sendo validado
2. **Simplicidade**: Menos abstração, mais direto
3. **Controle**: Cada teste tem controle total sobre suas validações
4. **Manutenibilidade**: Menos camadas de abstração para manter

**Exceção**: Mantivemos apenas `delay()` em `test-helpers.ts` para casos específicos de rate limiting.

## Configuração de Base URL

### Constante Compartilhada

A base URL da API está centralizada em `utils/constants.ts`:

```typescript
export const API_BASE_URL = 'https://dog.ceo/api/';
```

Esta constante é usada em:
- `playwright.config.ts` (para testes de browser, se necessário)
- `fixtures/api.fixture.ts` (para APIRequestContext)

**Vantagens:**
- Fácil manutenção (mudança em um único lugar)
- Consistência entre configurações
- Facilita testes em diferentes ambientes (futuro)

### Trailing Slash

A base URL inclui trailing slash (`/`) porque:
- Quando usando `baseURL` no Playwright, paths sem leading slash são anexados
- Exemplo: `baseURL: 'https://dog.ceo/api/'` + path `'breeds/list/all'` = `'https://dog.ceo/api/breeds/list/all'`
- Sem trailing slash, o Playwright pode construir URLs incorretas

## Estrutura de Services

### Métodos de Parse

Cada service inclui métodos para parsear respostas:

```typescript
async parseBreedsListResponse(
  response: APIResponse
): Promise<BreedsListResponse> {
  return response.json() as Promise<BreedsListResponse>;
}
```

**Por quê?**
- Type-safety: Garante que a resposta é do tipo esperado
- Reutilização: Pode ser usado em múltiplos testes
- Manutenibilidade: Se a estrutura mudar, atualiza em um lugar

### Métodos para Testes Negativos

Services incluem métodos auxiliares para testes negativos:

```typescript
async getCustomEndpoint(endpoint: string): Promise<APIResponse> {
  return await this.request.get(endpoint);
}

async postToEndpoint(endpoint: string, data?: unknown): Promise<APIResponse> {
  return await this.request.post(endpoint, { data });
}
```

**Por quê?**
- Permite testar endpoints inválidos
- Permite testar métodos HTTP incorretos
- Mantém o acesso ao `request` encapsulado no service

## Docker e CI/CD

### Cache de Layers

O Dockerfile está otimizado para cache:

1. **Ordem de layers**: `package*.json` copiado antes do código
2. **Cache de dependências**: Layer de `npm ci` só é reconstruída se `package.json` mudar
3. **Flags npm**: `--prefer-offline --no-audit` para acelerar

### GitHub Actions Cache

O workflow usa cache do Docker via GitHub Actions:
- `cache-from: type=gha` - Lê cache
- `cache-to: type=gha,mode=max` - Salva cache

**Benefícios:**
- Builds mais rápidos (de ~2-3min para ~30-60s com cache)
- Menos uso de recursos
- Economia de tempo em PRs frequentes

## Validações

### Validação de Schema

Testes validam o schema completo das respostas:

```typescript
test('deve retornar schema válido da resposta', async ({ listAll }) => {
  const data = await listAll.parseBreedsListResponse(response);
  
  expect(data).toHaveProperty('status');
  expect(data.status).toBe('success');
  expect(data).toHaveProperty('message');
  expect(typeof data.message).toBe('object');
  // ...
});
```

### Uso de Validadores

Para estruturas complexas, usamos validadores:

```typescript
expect(validateBreedsListResponse(data)).toBeTruthy();
```

**Quando usar validadores vs expects diretos?**
- **Validadores**: Para estruturas complexas que são validadas em múltiplos testes
- **Expects diretos**: Para validações específicas de cada teste

## Testes Negativos

### Cobertura de Erros

Cada endpoint inclui testes negativos:

1. **Endpoint inexistente**: Valida erro 404
2. **Método HTTP incorreto**: Valida erro 405 (ou 404)
3. **Dados inválidos**: Quando aplicável

**Exemplo:**
```typescript
test('deve retornar erro 404 para endpoint inexistente', async ({ listAll }) => {
  const response = await listAll.getCustomEndpoint('breeds/list/invalid-endpoint');
  expect(response.status()).toBe(404);
  expect(response.ok()).toBeFalsy();
  
  const errorData = await response.json();
  expect(errorData.status).toBe('error');
});
```

## Conclusão

As decisões arquiteturais e de implementação foram tomadas considerando:

- ✅ **Simplicidade**: Código direto e fácil de entender
- ✅ **Manutenibilidade**: Fácil de modificar e expandir
- ✅ **Reutilização**: Services e validadores reutilizáveis
- ✅ **Performance**: Cache otimizado e execução rápida
- ✅ **Cobertura**: Testes positivos e negativos

Esta abordagem garante um projeto de testes robusto, escalável e fácil de manter.

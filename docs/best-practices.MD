# Boas Práticas - API Tests

## Estrutura de Pastas

O projeto segue uma organização clara que separa responsabilidades e facilita a manutenção:

```
dog-api-tests/
├── tests/                    # Arquivos de teste (.test.ts)
│   ├── breeds.list.test.ts  # Testes para GET /breeds/list/all
│   ├── breed.images.test.ts  # Testes para GET /breed/{breed}/images
│   └── random.image.test.ts # Testes para GET /breeds/image/random
│
├── services/                 # Services (API Clients)
│   ├── list-all/            # Service para listar todas as raças
│   │   ├── dog.list.ts      # Classe com métodos da API
│   │   └── list.all.types.ts # Tipos TypeScript
│   └── random-image/         # Service para imagens aleatórias
│       ├── random.image.ts
│       └── random.image.types.ts
│
├── fixtures/                 # Fixtures do Playwright
│   └── api.fixture.ts       # Fixture customizada com API clients
│
├── utils/                    # Utilitários e helpers
│   ├── constants.ts         # Constantes compartilhadas (ex: API_BASE_URL)
│   ├── validators.ts        # Funções de validação de respostas
│   └── test-helpers.ts      # Helpers para testes
│
└── docs/                    # Documentação
    ├── best-practices.MD
    └── ...
```

### Organização por Responsabilidade

- **`tests/`**: Contém todos os arquivos de teste (`.test.ts`). Aqui ficam os casos de teste, validações e expects.
- **`services/`**: Contém os API Clients organizados por funcionalidade. Cada service tem:
  - **`.ts`**: Classe com métodos para interagir com a API
  - **`.types.ts`**: Define os tipos TypeScript para as respostas da API
- **`fixtures/`**: Fixtures customizadas do Playwright que disponibilizam os services nos testes
- **`utils/`**: Funções auxiliares, validadores e constantes reutilizáveis

## Separação de Responsabilidades: Expects nos Arquivos de Teste

### ❌ Evitar: Expects em Services

**NÃO** coloque expects dentro dos Services (arquivos `.ts` em `services/`):

```typescript
// ❌ ERRADO - Não fazer isso
export class DogListAll {
  async getAllBreeds(): Promise<APIResponse> {
    const response = await this.request.get('breeds/list/all');
    expect(response.status()).toBe(200); // ❌ Expect no Service
    return response;
  }
}
```

### ✅ Correto: Expects apenas nos Arquivos de Teste

**SEMPRE** mantenha os expects nos arquivos `.test.ts`:

```typescript
// ✅ CORRETO - Service apenas com chamadas à API
export class DogListAll {
  async getAllBreeds(): Promise<APIResponse> {
    return await this.request.get('breeds/list/all');
    // Apenas chamadas à API, sem expects
  }
}
```

```typescript
// ✅ CORRETO - Expects no arquivo de teste
test('deve retornar status 200 e lista de raças', async ({ listAll }) => {
  const response = await listAll.getAllBreeds();
  
  // Expects ficam aqui, no arquivo de teste
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
  
  const data = await listAll.parseBreedsListResponse(response);
  expect(data.status).toBe('success');
});
```

### Por que essa separação?

1. **Responsabilidade única**: 
   - Services = **Chamadas à API** (o que fazer)
   - Testes = **Validações** (o que verificar)

2. **Reutilização**: 
   - Services podem ser reutilizados em diferentes contextos de teste
   - Um mesmo método pode ser usado com diferentes validações

3. **Manutenibilidade**: 
   - Mudanças nas validações não afetam os Services
   - Fica claro onde estão as asserções do teste

4. **Legibilidade**: 
   - Testes ficam mais legíveis e fáceis de entender
   - Fica explícito o que está sendo validado em cada teste

5. **Flexibilidade**: 
   - Permite diferentes tipos de validação para a mesma chamada
   - Facilita testes positivos e negativos usando os mesmos Services

### Exceções

Em casos muito específicos, um Service pode retornar valores parseados que serão validados no teste:

```typescript
// ✅ OK - Retornar valor parseado para validação no teste
export class DogListAll {
  async parseBreedsListResponse(
    response: APIResponse
  ): Promise<BreedsListResponse> {
    return response.json() as Promise<BreedsListResponse>;
  }
}

// No teste:
const response = await listAll.getAllBreeds();
const data = await listAll.parseBreedsListResponse(response);
expect(data.status).toBe('success'); // Expect no teste
```

## Padrões de Teste

### 1. Um teste por cenário

Cada teste deve validar um único cenário específico:

```typescript
// ✅ CORRETO - Testes separados por cenário
test('deve retornar raça com sub-raças quando existirem', async ({ listAll }) => {
  // Testa apenas raças com sub-raças
});

test('deve retornar raça sem sub-raças quando não existirem', async ({ listAll }) => {
  // Testa apenas raças sem sub-raças
});
```

### 2. Validações explícitas

Evite helpers que escondem validações. Mantenha expects diretos:

```typescript
// ✅ CORRETO - Validações explícitas
test('deve retornar status 200', async ({ listAll }) => {
  const response = await listAll.getAllBreeds();
  expect(response.status()).toBe(200);
  expect(response.ok()).toBeTruthy();
});
```

### 3. Uso de validadores

Use funções de validação para estruturas complexas:

```typescript
// ✅ CORRETO - Usar validadores para estruturas complexas
import { validateBreedsListResponse } from '../utils/validators';

test('deve retornar schema válido', async ({ listAll }) => {
  const response = await listAll.getAllBreeds();
  const data = await listAll.parseBreedsListResponse(response);
  
  expect(validateBreedsListResponse(data)).toBeTruthy();
});
```

### 4. Testes positivos e negativos

Sempre inclua ambos os cenários:

```typescript
// ✅ Teste positivo
test('deve retornar status 200 para raça válida', async ({ randomImage }) => {
  const response = await randomImage.getRandomImageByBreed('hound');
  expect(response.status()).toBe(200);
});

// ✅ Teste negativo
test('deve retornar erro 404 para raça inexistente', async ({ randomImage }) => {
  const response = await randomImage.getRandomImageByBreed('raca-inexistente');
  expect(response.status()).toBe(404);
});
```

## Organização de Services

### Estrutura de um Service

```typescript
export class DogListAll {
  constructor(private request: APIRequestContext) {}

  // Método principal da API
  async getAllBreeds(): Promise<APIResponse> {
    return await this.request.get('breeds/list/all');
  }

  // Método para parsear resposta
  async parseBreedsListResponse(
    response: APIResponse
  ): Promise<BreedsListResponse> {
    return response.json() as Promise<BreedsListResponse>;
  }

  // Métodos auxiliares para testes negativos (opcional)
  async getCustomEndpoint(endpoint: string): Promise<APIResponse> {
    return await this.request.get(endpoint);
  }
}
```

### Tipos TypeScript

Sempre defina tipos para as respostas da API:

```typescript
export interface BreedsListResponse {
  message: Record<string, string[]>;
  status: string;
}
```

## Fixtures Customizadas

As fixtures disponibilizam os services nos testes:

```typescript
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

Uso nos testes:

```typescript
test('exemplo', async ({ listAll }) => {
  const response = await listAll.getAllBreeds();
  // ...
});
```

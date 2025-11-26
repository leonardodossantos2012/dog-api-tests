# Exemplos de Uso

## Exemplo de Execução de Testes

### Executar todos os testes
```bash
npm test
```

**Saída esperada:**
```
Running 25 tests using 1 worker

  ✓ tests/breeds-list.test.ts:8:3 › GET /breeds/list/all › deve retornar status 200 e lista de raças (1.2s)
  ✓ tests/breeds-list.test.ts:15:3 › GET /breeds/list/all › deve retornar estrutura de dados válida (0.8s)
  ✓ tests/breed-images.test.ts:8:3 › GET /breed/{breed}/images › deve retornar status 200 para raça válida (0.9s)
  ...

  25 passed (15.3s)
```

### Executar um teste específico
```bash
npx playwright test tests/random-image.test.ts
```

### Executar testes com filtro
```bash
npx playwright test --grep "deve retornar status 200"
```

## Exemplo de Relatório HTML

Após executar os testes, você pode visualizar o relatório HTML:

```bash
npm run test:report
```

O relatório mostra:
- ✅ Testes que passaram
- ❌ Testes que falharam (com screenshots e traces)
- ⏱️ Tempo de execução de cada teste
- 📊 Estatísticas gerais

## Exemplo de Estrutura de Resposta da API

### GET /breeds/list/all
```json
{
  "message": {
    "affenpinscher": [],
    "afghan": [],
    "african": [],
    "airedale": [],
    "akita": [],
    "appenzeller": [],
    "australian": ["shepherd"],
    "basenji": [],
    "beagle": [],
    "bluetick": [],
    "borzoi": [],
    "bouvier": [],
    "boxer": [],
    "brabancon": [],
    "briard": [],
    "buhund": ["norwegian"],
    "bulldog": ["boston", "english", "french"],
    "bullterrier": ["staffordshire"],
    ...
  },
  "status": "success"
}
```

### GET /breed/hound/images
```json
{
  "message": [
    "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
    "https://images.dog.ceo/breeds/hound-afghan/n02088094_1007.jpg",
    "https://images.dog.ceo/breeds/hound-afghan/n02088094_1023.jpg",
    ...
  ],
  "status": "success"
}
```

### GET /breeds/image/random
```json
{
  "message": "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
  "status": "success"
}
```

## Exemplo de Código de Teste

```typescript
import { test, expect } from '../fixtures/api.fixture';

test.describe('GET /breeds/list/all', () => {
  test('deve retornar lista de raças', async ({ listAll }) => {
    // Fazer a requisição
    const response = await listAll.getAllBreeds();
    
    // Validar resposta HTTP
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    
    // Parsear e validar dados
    const data = await listAll.parseBreedsListResponse(response);
    expect(data.status).toBe('success');
    expect(Object.keys(data.message).length).toBeGreaterThan(0);
  });
});
```

## Exemplo de Tratamento de Erro

```typescript
test('deve retornar erro 404 para raça inexistente', async ({ apiClient }) => {
  const invalidBreed = 'raca-inexistente-12345';
  const response = await apiClient.getBreedImages(invalidBreed);

  expect(response.status()).toBe(404);
  expect(response.ok()).toBeFalsy();

  const errorData = await apiClient.parseErrorResponse(response);
  expect(errorData.status).toBe('error');
});
```


import { test, expect } from '../fixtures/api.fixture';
import { validateBreedsListResponse, extractAllBreeds, extractSubBreeds } from '../utils/validators';

test.describe('Validar service que retorna lista de todas as raças', () => {

  test('deve retornar schema válido da resposta', async ({ listAll }) => {
    const response = await listAll.getAllBreeds();
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    
    const data = await listAll.parseBreedsListResponse(response);
    
    // Validação do schema completo
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('success');
    expect(data).toHaveProperty('message');
    expect(typeof data.message).toBe('object');
    expect(data.message).not.toBeNull();
    expect(Array.isArray(data.message)).toBeFalsy();
    
    // Validação usando o validador
    expect(validateBreedsListResponse(data)).toBeTruthy();
    
    // Validação de que há raças na lista
    const breeds = extractAllBreeds(data);
    expect(breeds.length).toBeGreaterThan(0);
    
    // Validação de que cada raça tem um array de sub-raças
    breeds.forEach((breed) => {
      expect(Array.isArray(data.message[breed])).toBeTruthy();
    });
  });

  test('deve retornar raça com sub-raças quando existirem', async ({ listAll }) => {
    const response = await listAll.getAllBreeds();
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    
    const data = await listAll.parseBreedsListResponse(response);
    const breeds = extractAllBreeds(data);
    
    // Encontra uma raça que tem sub-raças
    const breedWithSubBreeds = breeds.find(
      (breed) => extractSubBreeds(data, breed).length > 0
    );
    
    expect(breedWithSubBreeds).toBeDefined();
    
    if (breedWithSubBreeds) {
      const subBreeds = extractSubBreeds(data, breedWithSubBreeds);
      expect(subBreeds.length).toBeGreaterThan(0);
      expect(data.message[breedWithSubBreeds]).toEqual(subBreeds);
      expect(Array.isArray(data.message[breedWithSubBreeds])).toBeTruthy();
    }
  });

  test('deve retornar raça sem sub-raças quando não existirem', async ({ listAll }) => {
    const response = await listAll.getAllBreeds();
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    
    const data = await listAll.parseBreedsListResponse(response);
    const breeds = extractAllBreeds(data);
    
    // Encontra uma raça que não tem sub-raças
    const breedWithoutSubBreeds = breeds.find(
      (breed) => extractSubBreeds(data, breed).length === 0
    );
    
    expect(breedWithoutSubBreeds).toBeDefined();
    
    if (breedWithoutSubBreeds) {
      const subBreeds = extractSubBreeds(data, breedWithoutSubBreeds);
      expect(subBreeds).toEqual([]);
      expect(data.message[breedWithoutSubBreeds]).toEqual([]);
      expect(Array.isArray(data.message[breedWithoutSubBreeds])).toBeTruthy();
    }
  });

  test('deve retornar raças conhecidas com estrutura correta', async ({ listAll }) => {
    const response = await listAll.getAllBreeds();
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    
    const data = await listAll.parseBreedsListResponse(response);
    const breeds = extractAllBreeds(data);
    
    // Validação de raças conhecidas específicas
    const knownBreeds = ['beagle', 'bulldog', 'hound', 'retriever'];
    
    knownBreeds.forEach((knownBreed) => {
      expect(breeds).toContain(knownBreed);
      expect(data.message).toHaveProperty(knownBreed);
      expect(Array.isArray(data.message[knownBreed])).toBeTruthy();
    });
  });

  test('deve retornar erro 404 para endpoint inexistente', async ({ listAll }) => {
    // Tenta acessar um endpoint que não existe
    const response = await listAll.getCustomEndpoint('breeds/list/invalid-endpoint');
    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
    
    const errorData = await response.json();
    expect(errorData).toHaveProperty('status');
    expect(errorData.status).toBe('error');
    expect(errorData).toHaveProperty('message');
  });

  test('deve retornar erro para método HTTP incorreto', async ({ listAll }) => {
    // Tenta usar POST em um endpoint que só aceita GET
    const response = await listAll.postToEndpoint('breeds/list/all', { test: 'data' });
    
    // A API pode retornar 405 (Method Not Allowed) ou 404
    expect([404, 405]).toContain(response.status());
    expect(response.ok()).toBeFalsy();
    
    const errorData = await response.json();
    expect(errorData).toHaveProperty('status');
    expect(errorData.status).toBe('error');
  });
});

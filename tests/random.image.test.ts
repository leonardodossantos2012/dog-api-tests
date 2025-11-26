import { test, expect } from '../fixtures/api.fixture';
import { validateRandomImageResponse, isValidUrl, isImageUrl } from '../utils/validators';

test.describe('Validar service que retorna imagem aleatória de qualquer raça para o endpoint /breeds/image/random', () => {
  test('deve retornar status HTTP 200', async ({ randomImage }) => {
    const response = await randomImage.getRandomImage();
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
  });

  test('deve retornar schema válido da resposta', async ({ randomImage }) => {
    const response = await randomImage.getRandomImage();
    expect(response.status()).toBe(200);
    
    const data = await randomImage.parseRandomImageResponse(response);
    
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('success');
    expect(data).toHaveProperty('message');
    expect(typeof data.message).toBe('string');
    
    // Validação usando o validador
    expect(validateRandomImageResponse(data)).toBeTruthy();
  });

  test('deve retornar URL válida de imagem', async ({ randomImage }) => {
    const response = await randomImage.getRandomImage();
    expect(response.status()).toBe(200);
    
    const data = await randomImage.parseRandomImageResponse(response);
    
    expect(isValidUrl(data.message)).toBeTruthy();
    expect(isImageUrl(data.message)).toBeTruthy();
    expect(data.message).toContain('images.dog.ceo');
  });

  test('deve retornar imagens diferentes em múltiplas chamadas', async ({ randomImage }) => {
    const response1 = await randomImage.getRandomImage();
    const response2 = await randomImage.getRandomImage();
    
    expect(response1.status()).toBe(200);
    expect(response2.status()).toBe(200);
    
    const data1 = await randomImage.parseRandomImageResponse(response1);
    const data2 = await randomImage.parseRandomImageResponse(response2);
    
    // É possível que retorne a mesma imagem, mas muito improvável
    // Vamos fazer 3 chamadas para aumentar a probabilidade de diferença
    const response3 = await randomImage.getRandomImage();
    const data3 = await randomImage.parseRandomImageResponse(response3);
    
    const urls = [data1.message, data2.message, data3.message];
    const uniqueUrls = new Set(urls);
    
    // Pelo menos 2 URLs diferentes em 3 chamadas
    expect(uniqueUrls.size).toBeGreaterThanOrEqual(2);
  });

  test('deve retornar erro para método HTTP incorreto', async ({ randomImage }) => {
    const response = await randomImage.postToEndpoint('breeds/image/random', { test: 'data' });
    
    // A API pode retornar 405 (Method Not Allowed) ou 404
    expect([404, 405]).toContain(response.status());
    expect(response.ok()).toBeFalsy();
    
    const errorData = await response.json();
    expect(errorData).toHaveProperty('status');
    expect(errorData.status).toBe('error');
  });

  test('deve retornar erro 404 para endpoint inexistente', async ({ randomImage }) => {
    const response = await randomImage.getCustomEndpoint('breeds/image/invalid-endpoint');
    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
    
    const errorData = await response.json();
    expect(errorData).toHaveProperty('status');
    expect(errorData.status).toBe('error');
    expect(errorData).toHaveProperty('message');
  });
});



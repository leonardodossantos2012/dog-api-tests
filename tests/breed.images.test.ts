import { test, expect } from '../fixtures/api.fixture';
import { validateRandomImageResponse, isValidUrl, isImageUrl } from '../utils/validators';

test.describe('Validar service que retorna imagem aleatória de raça específica para o endpoint /breed/{breed}/images/random', () => {
  test('deve retornar status HTTP 200 para raça válida', async ({ randomImage }) => {
    const breed = 'hound';
    const response = await randomImage.getRandomImageByBreed(breed);
    
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
  });

  test('deve retornar schema válido para raça válida', async ({ randomImage, listAll }) => {
    const responseGetAllBreeds = await listAll.getAllBreeds();
    expect(responseGetAllBreeds.status()).toBe(200);

    const dataBreedsList = await listAll.parseBreedsListResponse(responseGetAllBreeds);
    const breed = Object.keys(dataBreedsList.message)[0];

    const response = await randomImage.getRandomImageByBreed(breed);
    expect(response.status()).toBe(200);
    
    const dataRandomImage = await randomImage.parseRandomImageResponse(response);
    
    expect(dataRandomImage).toHaveProperty('status');
    expect(dataRandomImage.status).toBe('success');
    expect(dataRandomImage).toHaveProperty('message');
    expect(typeof dataRandomImage.message).toBe('string');
    expect(validateRandomImageResponse(dataRandomImage)).toBeTruthy();
  
  });

  test('deve retornar URL válida que pertence à raça especificada', async ({ randomImage, listAll }) => {
    const responseGetAllBreeds = await listAll.getAllBreeds();
    expect(responseGetAllBreeds.status()).toBe(200);

    const dataBreedsList = await listAll.parseBreedsListResponse(responseGetAllBreeds);
    const breed = Object.keys(dataBreedsList.message)[0];

    const response = await randomImage.getRandomImageByBreed(breed);
    expect(response.status()).toBe(200);
    
    const dataRandomImage = await randomImage.parseRandomImageResponse(response);
    
    expect(isValidUrl(dataRandomImage.message)).toBeTruthy();
    expect(isImageUrl(dataRandomImage.message)).toBeTruthy();
    expect(dataRandomImage.message).toContain('images.dog.ceo');
    expect(dataRandomImage.message.toLowerCase()).toContain(breed.toLowerCase());
  });

  test('deve retornar imagem válida para múltiplas raças', async ({ randomImage, listAll }) => {
    const responseGetAllBreeds = await listAll.getAllBreeds();
    expect(responseGetAllBreeds.status()).toBe(200);

    const dataBreedsList = await listAll.parseBreedsListResponse(responseGetAllBreeds);
    const breeds = Object.keys(dataBreedsList.message);
    
    for (const breed of breeds) {
      const response = await randomImage.getRandomImageByBreed(breed);
      expect(response.status()).toBe(200);
      
      const dataRandomImage = await randomImage.parseRandomImageResponse(response);
      expect(dataRandomImage.status).toBe('success');
      expect(isValidUrl(dataRandomImage.message)).toBeTruthy();
      expect(dataRandomImage.message.toLowerCase()).toContain(breed.toLowerCase());
    }
  });

  test('deve retornar erro 404 para raça inexistente', async ({ randomImage }) => {
    const invalidBreed = 'raca-inexistente-12345';
    const response = await randomImage.getRandomImageByBreed(invalidBreed);
    
    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
    
    const errorData = await response.json();
    expect(errorData).toHaveProperty('status');
    expect(errorData.status).toBe('error');
    expect(errorData).toHaveProperty('message');
    expect(errorData.message).toContain('not found');
  });

  test('deve retornar erro para método HTTP incorreto', async ({ randomImage }) => {
    const breed = 'hound';
    const response = await randomImage.postToEndpoint(`breed/${breed}/images/random`, { test: 'data' });
    
    expect([404, 405]).toContain(response.status());
    expect(response.ok()).toBeFalsy();
    
    const errorData = await response.json();
    expect(errorData).toHaveProperty('status');
    expect(errorData.status).toBe('error');
  });
});

import { BreedsListResponse } from '../services/list-all/list.all.types';
import { RandomImageResponse } from '../services/random-image/random.image.types';

/**
 * Utilitários para validação de respostas da API
 */

/**
 * Valida se uma URL é válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida se uma URL é uma imagem (baseada na extensão)
 */
export function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some((ext) => lowerUrl.includes(ext));
}

/**
 * Valida a estrutura da resposta de lista de raças
 */
export function validateBreedsListResponse(data: BreedsListResponse): boolean {
  return (
    data.status === 'success' &&
    typeof data.message === 'object' &&
    data.message !== null &&
    !Array.isArray(data.message)
  );
}


/**
 * Valida a estrutura da resposta de imagem aleatória
 */
export function validateRandomImageResponse(data: RandomImageResponse): boolean {
  return (
    data.status === 'success' &&
    typeof data.message === 'string' &&
    isValidUrl(data.message) &&
    isImageUrl(data.message)
  );
}

/**
 * Extrai todas as raças de um objeto de raças
 */
export function extractAllBreeds(breedsData: BreedsListResponse): string[] {
  return Object.keys(breedsData.message);
}

/**
 * Extrai todas as sub-raças de uma raça específica
 */
export function extractSubBreeds(breedsData: BreedsListResponse, breed: string): string[] {
  return breedsData.message[breed] || [];
}


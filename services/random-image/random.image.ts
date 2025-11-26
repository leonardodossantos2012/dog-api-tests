import { APIRequestContext, APIResponse } from '@playwright/test';
import { RandomImageResponse } from './random.image.types';

export class RandomImage {
  constructor(private request: APIRequestContext) {}

  /**
   * Obtém uma imagem aleatória de qualquer raça
   * @returns Promise com a resposta da API contendo uma URL de imagem aleatória
   */
  async getRandomImage(): Promise<APIResponse> {
    return await this.request.get('breeds/image/random');
  }

  /**
   * Obtém uma imagem aleatória de uma raça específica
   * @param breed - Nome da raça (ex: 'affenpinscher')
   * @returns Promise com a resposta da API contendo uma URL de imagem aleatória da raça especificada
   */
  async getRandomImageByBreed(breed: string): Promise<APIResponse> {
    return await this.request.get(`breed/${breed}/images/random`);
  }

  /**
   * Faz o parse da resposta para o tipo RandomImageResponse
   * @param response - Resposta da API
   * @returns Promise com os dados parseados
   */
  async parseRandomImageResponse(
    response: APIResponse
  ): Promise<RandomImageResponse> {
    return response.json() as Promise<RandomImageResponse>;
  }

  /**
   * Faz uma requisição GET para um endpoint customizado (útil para testes negativos)
   * @param endpoint - Endpoint customizado
   * @returns Promise com a resposta da API
   */
  async getCustomEndpoint(endpoint: string): Promise<APIResponse> {
    return await this.request.get(endpoint);
  }

  /**
   * Faz uma requisição POST para um endpoint (útil para testes negativos)
   * @param endpoint - Endpoint
   * @param data - Dados a serem enviados
   * @returns Promise com a resposta da API
   */
  async postToEndpoint(endpoint: string, data?: unknown): Promise<APIResponse> {
    return await this.request.post(endpoint, { data });
  }
}

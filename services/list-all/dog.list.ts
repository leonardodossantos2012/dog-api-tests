import { APIRequestContext, APIResponse } from '@playwright/test';
import { BreedsListResponse } from './list.all.types';

export class DogListAll {
  constructor(private request: APIRequestContext) {}

  /**
   * Lista todas as raças de cães disponíveis
   * @returns Promise com a lista de raças e sub-raças
   */
  async getAllBreeds(): Promise<APIResponse> {
    return await this.request.get('breeds/list/all');
  }

  /**
   * Faz o parse da resposta para o tipo BreedsListResponse
   * @param response - Resposta da API
   * @returns Promise com os dados parseados
   */
  async parseBreedsListResponse(
    response: APIResponse
  ): Promise<BreedsListResponse> {
    return response.json() as Promise<BreedsListResponse>;
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


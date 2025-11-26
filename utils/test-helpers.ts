/**
 * Helpers para testes de API
 */

/**
 * Aguarda um tempo específico (útil para testes de rate limiting)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


# Dockerfile para executar testes de API com Playwright
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências primeiro (para cache de layers)
COPY package*.json ./

# Instala dependências (esta layer será cached se package*.json não mudar)
RUN npm ci --prefer-offline --no-audit

# Copia o código fonte (esta layer será invalidada quando código mudar)
COPY . .

# Compila TypeScript (se necessário)
RUN npx tsc --noEmit || true

# Define o comando padrão para executar os testes
CMD ["npm", "test"]


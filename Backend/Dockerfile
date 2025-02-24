# Usar uma imagem base do Node.js
FROM node:20

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Instalar o pnpm globalmente
RUN npm install -g pnpm

# Copiar apenas os arquivos de dependência primeiro para aproveitar o cache
COPY package.json pnpm-lock.yaml ./

# Instalar as dependências
RUN pnpm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que a aplicação vai rodar (ajuste conforme necessário)
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "server.js"]

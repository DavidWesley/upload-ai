<div align="center" >
  <img src="../public/assets/upload-ia-logo.svg" />
  <h1 align="center">Upload.IA Server</h1>
</div>

<p align="center">Projeto desenvolvido na Trilha Mastery da NLW IA da <a href="https://www.rocketseat.com.br/">Rocketseat</b>.</p>

<div align="center">
  <a href="#project">Projeto</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#technologies">Tecnologias</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#usage">Utilização</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#license">Licença</a>
</div>

<h2 id="project">📁 Projeto</h2>
Servidor da aplicação que possibilita realizar upload de videos e por meio de IA, criar automaticamente títulos chamativos e descrições com um boa indexação além de outros conteúdos que você solicitar.

<h2 id="technologies">💻 Tecnologias</h2>

Este projeto foi desenvolvido utilizando tecnologias como:

- Nodejs
- Typescript
- Fastify
- Prisma
- eslint
- tsx
- tsup
- dotenv
- openai
- zod

<h2 id="usage">💡 Utilização</h2>

1. Clone o projeto:

   ```sh
   git clone https://github.com/DavidWesley/upload-ia.git --branch main --single-branch
   ```

2. Acesse a pasta do projeto:

   ```sh
   cd upload-ai/server
   ```

3. Instale as dependências:

   ```sh
   npm ci
   ```

4. Defina as variáveis de ambiente conforme [exemplo](./.env.example):

   ```sh
   # Node environment: 'development' | 'production' | 'test'
   NODE_ENV=

   # Public access service port
   PORT=

   # openai api key
   OPENAI_API_KEY=

   # Connect to supabase with PgBouncer if you are using PostgreSQL.
   DATABASE_URL=

   # Direct connection to the database. Used for migrations.
   # If you are using a MySQL connection, then use `DIRECT_URL` as `DATABASE_URL`.
   DIRECT_URL=

   # Supabase storage
   SUPABASE_PROJECT_URL=
   SUPABASE_API_KEY=
   ```

5. Instancie o prisma:

   ```sh
   npx prisma migrate dev --create-only
   npx prisma db seed
   npx prisma db sh
   ```

6. Inicie a aplicação:

   ```sh
   npm run dev
   ```

<h2 id="license">📝 Licença</h2>

Este projeto está sob a licença [MIT](../LICENSE).

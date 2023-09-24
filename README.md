<div align="center" >
  <img src="./public/assets/upload-ia-logo.svg" />
  <h1 align="center">Upload.IA Project</h1>
</div>

<p align="center">Projeto desenvolvido na Trilha Mastery da NLW IA da <a href="https://www.rocketseat.com.br/">Rocketseat</b>.</p>

<div align="center">
  <a href="#project">Projeto</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#services">Serviços</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#usage">Utilização</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#license">Licença</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#next-steps">Próximos passos</a>
</div>

<h2 id="project">📁 Projeto</h2>
Repositório da aplicação que possibilita realizar upload de videos e por meio de IA, criar automaticamente títulos chamativos e descrições com um boa indexação além de outros conteúdos que você solicitar.

<h2 id="services">🛅 Serviços</h2>

Este projeto foi desenvolvido utilizando tecnologias como:
Para a plena execução desse projeto, esse dispõem de dois serviços principais:

- [front-end](./web)
- [backend](./server)

<h2 id="usage">💡 Utilização</h2>

Consulte as instrução de como utilizar cada um dos serviços dentro do repositório para descobrir como utilizá-los.

1. [Instruções para uso do front-end da aplicação](./web/README.md#usage)
2. [Instruções para uso do backend da aplicação](./server/README.md#usage)

<h2 id="license">📝 Licença</h2>

Este projeto está sob a licença [MIT](./LICENSE).

<h2 id="next-steps">⏭ Próximos passos</h2>

Visando melhorar a qualidade do código desse projeto, pretendo, no futuro, implementar as seguintes funcionalidades:

1. Colocar cada um dos serviços em seus respectivos contêineres Docker e facilitar a migração.
2. Aprimorar a segurança dos serviços contra uso mal intencionado por meio de `cron-jobs` ou `cloud functions`.
3. Implementar deleção periódica dos arquivos carregados pelos usuário para prevenir `STORAGE_LIMIT_MEMORY_ERROR`
4. Aprimorar qualidade de código de forma geral.
5. Isolar o serviço de storage atualmente acoplado ao server para facilitar migração.

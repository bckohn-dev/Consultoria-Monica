# Catálogo de Apartamentos

Este é um projeto de uma aplicação web para gerenciar um catálogo de apartamentos, desenvolvido com **Vue.js** no frontend e **Firebase** no backend.

## Funcionalidades

- **Página Inicial**: Apresentação da consultoria imobiliária.
- **Catálogo**: Exibição de imóveis disponíveis com detalhes como preço, área e número de quartos.
- **Administração**: Adicionar, editar e remover imóveis.
- **Contato**: Informações de contato da consultoria.
- **Sobre**: Informações sobre a missão, visão e valores da consultoria.

## Tecnologias Utilizadas

### Frontend
- **Vue.js**: Framework JavaScript para construção da interface.
- **Tailwind CSS**: Framework CSS para estilização.
- **Axios**: Biblioteca para requisições HTTP.
- **Swiper.js**: Biblioteca para carrossel de imagens.

### Backend
- **Firebase**: Banco de dados em tempo real e autenticação.
- **Express.js**: Framework para criação de APIs RESTful.
- **Node.js**: Ambiente de execução para o backend.

## Estrutura do Projeto

```plaintext
frontend/
├── src/
│   ├── components/       # Componentes reutilizáveis (Header, Footer, etc.)
│   ├── views/            # Páginas principais (AdminPage, SobrePage, Contato, etc.)
│   ├── router/           # Configuração de rotas
│   ├── App.vue           # Componente raiz
│   ├── index.css         # Estilos globais
│   └── main.js           # Arquivo de entrada do Vue.js
backend/
├── index.js              # Servidor Express.js
├── serviceAccountKey.json # Configuração do Firebase
└── package.json          # Dependências do backend

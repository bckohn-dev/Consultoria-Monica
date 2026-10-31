# Atualização do catálogo — 31/10/2026

## Contexto confirmado
- Projeto: Mônica Consultoria Imobiliária.
- Origem: https://github.com/bckohn-dev/Consultoria-Monica, main d0f6073.
- Site existente: https://mcnimobiliaria.com.br/.
- Objetivo registrado no código: apresentar a consultoria, facilitar a busca de imóveis e o contato, permitir gestão do catálogo.
- Tecnologia preservada: Vue 3, Vite, Tailwind, Firebase e funções serverless na Vercel.
- A pasta C:\projetos\catalogo-apartamentos contém uma versão anterior; as alterações desta entrega estão neste checkout separado.

## Implementado
- Nova abertura da home, destaques integrados, faixa de serviços e chamada para WhatsApp.
- Catálogo com rótulos acessíveis, campos responsivos, contador, ordenação e recuperação de erros.
- Busca com atraso de 350 ms na digitação, cancelamento e proteção contra respostas antigas.
- Validação de faixa de preços, preservando o valor zero.
- Cartões com ícones vetoriais, formatação de preço e compatibilidade com área simples e faixa de área.
- Filtro de garagem compatível com vagaGaragem e garagem.
- Idioma pt-BR e descrição da página; estado expandido do menu e restauração da rolagem.

## Validação e limites
- Build de produção passou.
- 20 testes passaram, incluindo regressões de concorrência e preços inválidos.
- O teste antigo do carrossel ainda gera avisos de rede e router; não valida a integração real.
- O navegador não conseguiu alcançar localhost; inspeção visual da nova versão pendente.
- A API/Firebase real não foi validada nesta cópia. Vite sozinho não executa as funções da Vercel.
- GitHub CLI informou token inválido. Nenhum push, PR ou deploy foi realizado.
- Antes da publicação: conferir desktop e celular com API, galerias, contato e regras de acesso do Firebase/admin.

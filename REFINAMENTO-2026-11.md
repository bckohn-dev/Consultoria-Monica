# Refinamento visual e acessível — 2/11/2026

Base: feature/painel-administrativo @ 34fda38. Trabalho isolado em preview/refinamento-skills-2026-11; entrega pelo preview já configurado da feature/painel-administrativo, sem promoção para main e sem copiar Secrets para outra branch.

## Alterações
- Filtros alinhados, seleção resumida com remoção individual, erros associados aos campos e mensagens de busca sem contagem enganosa em falha.
- Cartões com hierarquia tipográfica mais clara e links de detalhes nativos; carregamento reserva espaço com placeholders sem animação.
- Introdução duplicada removida apenas da página de catálogo, mantendo nome acessível e hierarquia de títulos.
- Atalho para pular ao conteúdo; Escape no menu e retorno de foco ao fechar o contato no celular. Áreas de toque ampliadas e botão de busca ocupa a largura móvel.
- Roteamento respeita as âncoras de navegação.

Skills usadas: Impeccable em modo documental para refinamento e Web Design Guidelines para acessibilidade/responsividade. Sem engine, hooks, GSAP ou novas dependências. Identidade azul-marinho/dourado e texto institucional preservados.

## Verificação
- 86 testes em 15 arquivos aprovados; sem erros não tratados. Três regressões novas cobrem remoção individual, associação do erro de preço e foco ao fechar o menu.
- Build Vite aprovado; diff sem erros de whitespace. A última alteração posterior à suíte foi apenas id/tabindex no main do login; build repetido após ela.
- Inspeção real do navegador em 390, 768 e 1440 px: grade de uma, duas e três colunas, sem overflow horizontal; controles de filtro com 46 px de altura.
- Com snapshot local: filtros 2 quartos + garagem retornaram dois imóveis; remover quartos preservou garagem; faixa invertida gerou aviso; limpar restaurou nove imóveis. Detalhe do imóvel abriu pelo link; menu/contato fecharam por Escape com foco no botão móvel.
- A massa local veio do snapshot público, em servidor temporário somente leitura, sem credenciais nem conexão ao Firebase.

Não foi realizado login ou CRUD no banco, pentest, auditoria WCAG integral ou medição de Core Web Vitals. As URLs antigas de fotos no snapshot podem cair na capa padrão. API, regras Firebase, variáveis, permissões e dependências não foram alteradas. Checkouts antigos com conflitos/arquivos locais foram preservados.

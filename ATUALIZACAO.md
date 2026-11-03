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
- GitHub CLI informou token inválido; o envio funciona pela credencial do Git. Previews publicados e aprovados pelo usuário.
- A área administrativa e as regras de acesso do Firebase não foram auditadas nesta entrega; uma proteção de rota no frontend não substitui essas regras.

## Refinamento visual solicitado por imagens
- Cabeçalho com símbolo vetorial de casa, assinatura tipográfica e navegação mais leve.
- Destaques sem moldura dupla, com setas discretas e título sobre gradiente.
- Marcas em etiquetas compactas em vez de faixas coloridas.
- Fotos dos cartões são links para os detalhes, com indicação visual em hover e foco.
- Detalhes com galeria, miniaturas, características e painel de interesse.
- Contato em diálogo nativo com foco contido, Escape e links diretos.
- 22 testes passaram, incluindo galeria, interesse por WhatsApp e diálogo.
- Preview permanece na branch preview/catalogo-design-2026-10; main preservada.

## Revisão para produção
- Publicação na main autorizada pelo usuário.
- Build aprovado e 27 testes passaram.
- Normalização da chave privada do Firebase corrigida; erros públicos sem detalhes internos.
- Fallback das miniaturas protegido contra tentativas repetidas.
- Revisão visual baseada nas imagens e aprovação do usuário; navegador do chat exige login para previews.

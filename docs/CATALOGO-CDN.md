# Catálogo público estático e publicação manual

## Fluxo para os administradores

1. Entre em `/gestao-monica` com uma das contas autorizadas.
2. Cadastre, edite ou exclua imóveis e salve. Isso modifica o rascunho no Firebase.
3. Clique em **Publicar catálogo** quando o conjunto de alterações estiver pronto.
4. Aguarde o deployment terminar no Vercel e confira o catálogo. Uma solicitação aceita não significa que o build terminou.

O botão captura os dados públicos em `catalog_releases/{ambiente}` antes de solicitar o deploy. Deploys de código posteriores usam essa versão congelada: não publicam rascunhos novos por acidente. No primeiro build de cada ambiente, uma transação inicializa a versão com o catálogo existente; os imóveis originais não são alterados. Se o build falhar, a versão online anterior permanece.

## Ambientes e configuração

Mantenha o fluxo `feature/* → development → main`. Este trabalho depende da integração prévia das proteções de custo do PR #20. Preview exige o Firebase `catalogo-imoveis-dev`; produção usa `catalogo-imoveis`. Não copie credenciais de produção para Preview.

Crie um Deploy Hook por branch no Vercel, em Settings → Git → Deploy Hooks, apenas após autorização para criar esse segredo. Salve a URL como **Secret server-only `CATALOG_PUBLISH_HOOK`**, sem prefixo `VITE_`:

- Hook da branch `development`: variável Preview restrita a `development`.
- Hook da branch `main`: variável Production.
- Não configure hook de `main` em Preview. Branches de trabalho ficam sem publicação manual até ter hook próprio; o botão informa a pendência.

A URL dá permissão para disparar builds: não envie pelo chat, não registre em logs, não coloque no frontend. A API exige autenticação, e-mail verificado, allowlist e origem correta antes de publicá-la. O servidor permite até 10 solicitações por dia UTC por ambiente, com intervalo de dois minutos e contador transacional compartilhado. Tentativas de resultado incerto consomem quota para evitar deploys duplicados. Uma build de código/Git não é limitada por esse contador.

## Onde estão os dados

- Edições e uploads: Firebase, restritos aos administradores pela API existente.
- Versão aprovada: documento `catalog_releases/{ambiente}`, com dados públicos e sem anotações internas; acessível somente ao servidor.
- Catálogo público: `/catalogo-publico/catalogo.json`, arquivo estático que exige revalidação.
- Fotos públicas: `/catalogo-publico/images/{sha256}.{ext}`, arquivos estáticos com cache de um ano e nomes derivados do conteúdo.
- Rotas públicas antigas: compatibilidade via leitura do mesmo JSON empacotado, sem importar Firebase Admin nem listar Storage. Ainda são funções Vercel; o frontend usa diretamente a CDN.

O build exporta o JSON e copia os bytes das imagens; nenhum serviço de transformação pago, dependência ou tarefa recorrente foi adicionado. Só aceita HTTPS no host fixo do Firebase Storage e nos buckets conhecidos, sem redirects. Valida assinatura e tamanho de imagens. Limites: 500 imóveis, versão congelada até 800 KiB, JSON até 2 MiB, 200 imagens únicas, 10 MiB por imagem e 100 MiB total. Limites excedidos interrompem a publicação. Falhas HTTP 403/404 em fotos públicas do Dev usam a capa padrão e geram aviso; falhas de rede, conteúdo inválido e outras respostas interrompem o build. Em produção o SDK lê o bucket próprio; problemas de permissão interrompem o build.

## Validação e operação

- `npm test -- --run`: regressão e controles de segurança, sem ataques reais.
- `npm run build:fixture`: build local explícita, sem credenciais/rede, com nove imóveis e capas padrão. Proibida em Vercel.
- `npm run build`: exige credenciais do ambiente e lê a versão congelada (inicializa uma vez se ausente).
- Verifique o JSON servido: nenhuma URL Firebase nem token deve aparecer em `foto`/`fotos`.
- Pelo navegador, catálogo, detalhes, filtros e destaques devem pedir apenas arquivos estáticos para os dados/fotos. Firebase permanece no login e no painel.
- Salve uma edição no Dev: o catálogo público deve continuar igual antes de publicar. Publique e confirme a alteração após o build. Faça o teste com um imóvel temporário.
- Verifique `x-vercel-cache` e os cabeçalhos do JSON e de uma foto; imagens inexistentes devem retornar 404, nunca o HTML da aplicação.
- Se o botão falhar, confira os deployments antes de repetir. Hooks não incluem confirmação de conclusão na resposta ao painel.

## Custos e riscos residuais

Os visitantes deixam de gerar leituras de Firestore e downloads de Storage. O painel, a primeira inicialização e as publicações ainda usam Firebase; builds copiam fotos originais e consomem tráfego de saída. O tráfego público passa a consumir a franquia da Vercel. Não há promessa de custo zero sob qualquer volume de acessos.

**Tokens antigos de fotos continuam válidos.** Links antigos podem continuar acessando Storage diretamente até uma revogação controlada. Só revogue após validar a CDN e preparar as miniaturas do painel para não perder acesso às imagens. Nenhum token foi revogado nesta etapa. A CDN não elimina riscos de Auth, de credenciais comprometidas ou do plano Blaze; regras e alertas existentes continuam necessários.

## Reversão

Desabilite o botão removendo o Secret do ambiente (novo deploy necessário). Reative um deployment conhecido no Vercel ou reverta o PR seguindo `feature → development → main`. Os documentos originais, fotos e lixeira permanecem intactos. Para restaurar um catálogo, use um deployment anterior ou restaure explicitamente a versão aprovada; não exclua automaticamente a versão congelada, pois o próximo build inicializaria a partir dos rascunhos.

Referência: https://vercel.com/docs/deploy-hooks

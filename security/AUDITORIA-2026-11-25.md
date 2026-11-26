# Auditoria de segurança e custos Firebase

Data da revisão em 25/11/2026. Objetivo do proprietário é manter o gasto o mais próximo de zero possível. Trabalho na branch security/firebase-cost-controls-2026-11, baseada em development. Publicação segue branch específica → development → main.

## Parecer executivo

O maior risco financeiro encontrado é a amplificação de leituras por APIs públicas acessíveis sem login. As regras do Firebase recusam acesso anônimo direto nas verificações pontuais, mas a API usa Admin SDK e precisa dos próprios controles. O código anterior consultava a coleção inteira por busca e podia listar todos os arquivos da pasta de carrossel. Duas capas avaliadas também usam cache privado com revalidação a cada acesso.

As correções deste PR reduzem repetição e limitam o custo de cada consulta. O cache em memória é por processo/instância. Instâncias frias, regiões e funções distintas podem fazer consultas independentes. O conjunto não cria um teto financeiro global. Para aproximar o tráfego público de custo Firebase zero, a evolução preferencial é publicar catálogo e imagens otimizadas como arquivos estáticos na hospedagem/CDN.

## Escopo e limites da evidência

- Revisão de APIs públicas e administrativas, autorização, sessões, uploads, configuração de ambiente, regras versionadas, headers, campos expostos e dependências.
- Chamadas pontuais de leitura ao próprio site e às APIs públicas do Firebase. Sem carga contra produção, contas falsas, exploração de serviços externos ou alteração de documentos/buckets.
- Produção respondeu HTTP 200 no catálogo. Firestore anônimo em projects/catalogo-imoveis/databases/(default)/documents/imoveis?pageSize=1 respondeu 403. Listagem anônima do bucket catalogo-imoveis.firebasestorage.app com maxResults=1 respondeu 403.
- Essas duas recusas comprovam os cenários anônimos testados. O conteúdo integral das regras implantadas, regras para outras identidades, IAM, chaves ativas, faturamento, cotas, alertas e estado do WAF não foram verificados no console nesta sessão. A ferramenta do navegador ficou indisponível.
- Busca de marcadores PEM na árvore Git atual e de nomes serviceAccount no histórico não encontrou correspondências. Não foi executada varredura completa de todos os segredos históricos nem certificada a revogação de chaves antigas.
- Três capas foram avaliadas com HEAD. Duas responderam 200 com 194.408 e 186.586 bytes, ambas com Cache-Control private, max-age=0. A terceira respondeu 403 e requer conferência da URL/permissão antes de alterar dados.

## Achados e tratamento

| Prioridade | Achado | Evidência e impacto | Tratamento |
| --- | --- | --- | --- |
| Alta financeira | Leitura da coleção por requisição pública, sem limite e sem cache CDN definido na API | Variações de filtros e IDs podem ampliar leituras mesmo com regras diretas fechadas | Cache de snapshot de 30 segundos por instância em Production, coalescência de chamadas e limite de consulta de 501 documentos. CDN com 30 segundos nas respostas públicas. Corrigido no PR |
| Alta financeira | Downloads públicos de fotos continuam gerando operações/transferência | URLs públicas das fotos são acessíveis fora da API e duas capas usam cache privado sem tempo de retenção | Roadmap de cache/miniaturas/CDN e inventário de metadados. A alteração da API não controla downloads diretos |
| Média | Entradas arbitrárias e variantes de query chegavam ao banco | Arrays, números malformados e parâmetros desconhecidos não eram recusados de forma uniforme | Validação antes do Firebase. Chaves de cache não dependem de strings de busca. Corrigido no PR |
| Média | Rota legada /api/carrossel listava objetos sem limite e assinava URLs até 2500 | Rota está exposta embora o componente atual use /api/destaques | Listagem limitada a 50 objetos sem paginação automática, cache/coalescência e novas URLs assinadas por uma hora. Corrigido no PR. Links já emitidos mantêm sua validade original até uma ação específica de revogação |
| Média | Falhas repetidas podem gerar novas tentativas imediatas contra Firebase | API anterior repetia chamadas por requisição | Backoff local de cinco segundos após falhas, sem cache CDN de 400/503. Corrigido no PR |
| Baixa | fast-xml-parser 5.11.2 com GHSA-474x-hrwr-fgx4 | Dependência transitiva do SDK Storage. Aviso de consumo quadrático de CPU em entrada XML específica | Atualizado para 5.12.1 e dependências compatíveis no lockfile. Auditoria posterior sem alertas conhecidos |
| A verificar | Limites financeiros e de borda | Estado atual de alertas, WAF e cotas não confirmado | Etapa prioritária no console com o proprietário |

## Controles preservados e revisados

- API administrativa exige Bearer token Firebase, verificação de revogação, e-mail confirmado e ADMIN_EMAILS. Origem de navegador é conferida. Métodos sem autorização são recusados antes do Firestore e Storage.
- Regras versionadas Firestore e Storage negam acesso direto. O SDK Admin continua sujeito às permissões IAM e aos limites implementados na API.
- Limite administrativo distribuído de 60 escritas por minuto por conta, com transação no Firestore. Não foi acrescentado contador Firestore a cada visita pública, evitando cobrar gravações para medir abuso.
- Upload administrativo com allowlist de tipos, assinatura de bytes e limite de 2 MiB por envio. O frontend redimensiona para até 1800 px. Nome aleatório, autenticação e prefixos separados por ambiente.
- Catálogo público usa campos permitidos. Observações internas e dados administrativos não entram nas respostas. Vue escapa as descrições.
- Preview exige credenciais catalogo-imoveis-dev. Coleções de produção, preview e desenvolvimento local continuam selecionadas no servidor.
- Sessão por aba, saída explícita e mensagens genéricas na recuperação de senha. Headers CSP, HTTPS, anti-frame e nosniff revisados no código.

## Comportamento das correções

1. Até 500 imóveis são suportados pelo snapshot. A consulta lê no máximo 501 documentos. Se houver mais de 500, retorna 503 explicitamente para exigir paginação, sem esconder parte do catálogo silenciosamente.
2. A primeira consulta em cada instância carrega o catálogo limitado, inclusive se a entrada for um detalhe. Isso pode custar mais que a leitura anterior de um documento isolado em um acesso frio. O ganho demonstrado é na repetição/coalescência, especialmente em variações maliciosas de IDs e filtros. Não se projeta economia financeira exata a partir do teste.
3. Produção usa 30 segundos de cache em memória e até 30 segundos de CDN por resposta. Uma edição pode levar aproximadamente um minuto para aparecer ao visitante. A mensagem de confirmação no painel informa isso. Preview/Development não retêm o snapshot entre chamadas concluídas.
4. Requisições HEAD usam o mesmo caminho de consulta/cache para manter status coerentes e retornam sem corpo. HEAD não é tratado como prova de existência sem consulta.
5. PUBLIC_CATALOG_ENABLED=false pausa as APIs públicas atendidas por estas funções antes de acessar o Firebase. Aplicar a variável ao ambiente pretendido e fazer novo deploy. Respostas previamente em cache podem durar mais 30 segundos. Administração e downloads diretos de imagens continuam com seus próprios caminhos.
6. Nenhuma cota, plano, faturamento, bucket, regra implantada ou configuração WAF foi alterada nesta auditoria. As correções entram no ambiente após o fluxo de PR e deploy.

## Verificação

- 128 testes em 18 arquivos aprovados, com build aprovada.
- 100 buscas locais simultâneas com filtros variados produziram uma única consulta limitada no mock Firestore. 100 IDs locais inexistentes também produziram uma única consulta durante o TTL.
- Testes cobrem TTL, concorrência, separação de ambientes, recuperação de falha síncrona/backoff, entradas inválidas, métodos, pausa de emergência, catálogo excedendo o limite, HEAD e dados legados.
- Testes de Storage confirmam maxResults=50, autoPaginate=false, coalescência e expiração de uma hora. Nenhum desses testes gerou tráfego de carga no Firebase real.
- 107 testes anteriores continuam passando. Novas verificações são regressões específicas dos controles de custo.
- Instalação pelo lockfile com scripts desativados, auditoria posterior com zero alertas conhecidos e git diff --check aprovado. Nenhum segredo foi impresso ou incorporado aos arquivos.
- Integração real de leitura no Firebase catalogo-imoveis-dev com os handlers atualizados retornou HTTP 200 para nove imóveis, o detalhe adolfo-pinheiro e três destaques. As três chamadas concorrentes usaram o mesmo snapshot em voo. Nenhuma gravação foi feita.
- O cache real da CDN precisa ser conferido após o deploy Dev/Production adequado. Resposta HIT no domínio próprio e redução das métricas Firebase são critérios de aceitação da publicação, ainda pendentes.

## Roadmap recomendado

| Prazo | Ação | Critério de conclusão | Decisão/cuidado |
| --- | --- | --- | --- |
| Agora | Revisar/validar este PR na development e promover à main | Testes e build verdes. Conferir catálogo, filtros, destaques, detalhes, HEAD e mensagem de atualização | Aceitar atraso de aproximadamente um minuto e o limite de 500 imóveis |
| Primeiro dia | Conferir Cloud Billing por projeto, uso Firestore, Storage e orçamento | Registrar gasto atual, origem do uso e alertas ao primeiro gasto/limiares baixos na moeda da conta | Alertas notificam. Interrupção de cobrança exige mecanismo específico. Não foi criado orçamento ou pausa automática |
| Primeiro dia | Aplicar WAF/rate limit de borda às rotas /api/* | Limite por IP testado com tráfego legítimo e resposta 429/challenge antes das funções | Conferir plano, franquia e cobrança do recurso antes de ativar. Considerar redes compartilhadas e uploads em lote |
| Esta semana | Inventariar fotos atuais e corrigir cache/miniaturas | Imagens com versões dimensionadas, URLs estáveis e Cache-Control apropriado. Conferir foto que retornou 403 | Fazer em lote controlado com backup de metadados. Definir validade considerando exclusão/revogação e uso público |
| Esta semana | Conferir IAM, chaves e contas administrativas | Conta de serviço com funções mínimas, chaves antigas revogadas após validação, 2FA nas contas de Bruno/Mônica e domínio OAuth reduzido aos usados | Remover permissões/rotacionar só com lista de dependências e plano de reversão. Chave pública Firebase não substitui autenticação |
| 1–2 semanas, preferencial | Servir o catálogo público como snapshot JSON estático e fotos otimizadas na CDN | Visita pública deixa de consultar Firestore. Regerar snapshot após edição autenticada com atualização atômica e recuperação | Escolher mecanismo de publicação compatível com o painel e custo da hospedagem. Manter o Firebase para gestão |
| 1–2 semanas | Remover a rota legada /api/carrossel após confirmar consumidores | Nenhum cliente depende dela e seu tráfego passa a zero | A versão atual a mantém limitada para preservar compatibilidade |
| 2–4 semanas | Definir cotas administrativas diárias, retenção e limpeza de órfãos | Limite de uploads por conta/dia, inventário antes de excluir e política de retenção da lixeira | Excluir automaticamente apenas após prazo aprovado. Custos de versões e soft delete também devem ser avaliados |
| Conforme necessidade | Avaliar App Check no backend próprio | Medir impacto, verificar tokens na API e bloquear chamadas inválidas com cobertura de testes | App Check deve ser validado na API Admin. Sua ativação no Firebase sozinha não protege este backend e pode trazer quota/custo adicional |

## Operação e reversão

Após publicar, acompanhar número de requisições por rota, taxa de cache HIT/MISS, leituras Firestore, operações/egress Storage e custo por projeto. Definir responsável pelo alerta e ação de contenção. Uma resposta rápida de custo pode começar pela pausa das APIs públicas, mas as fotos exigem controle próprio. Toda interrupção afeta visitantes e deve ter um procedimento aprovado.

Reverter pelo PR/revert dos commits desta branch e pelo deploy da versão anterior. Não há migração de banco. A atualização do lockfile faz parte da reversão. URLs já emitidas antes da correção e objetos existentes no Storage exigem ações específicas para expiração/revogação ou alteração de cache.

## Referências

- Firestore Admin e limites das regras [Firebase](https://firebase.google.com/docs/firestore/security/rules-conditions).
- Orçamentos, alertas e custos [Firebase](https://firebase.google.com/docs/projects/billing/avoid-surprise-bills).
- Cache separado para CDN e navegador [Vercel](https://vercel.com/docs/caching/cache-control-headers).
- WAF e rate limiting, disponibilidade e cobrança [Vercel](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).
- Metadados de cache para objetos [Google Cloud](https://cloud.google.com/storage/docs/caching).
- App Check em backend próprio [Firebase](https://firebase.google.com/docs/app-check/custom-resource-backend).
- Aviso da dependência corrigida [GitHub Advisory](https://github.com/advisories/GHSA-474x-hrwr-fgx4).

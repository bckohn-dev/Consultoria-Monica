# Revisão de segurança e privacidade — 1/11/2026

## Escopo e limites
Aplicação Vue, funções Vercel, Firebase Authentication, regras publicadas do Firestore e Storage, dependências e tratamento de dados dos visitantes. Autorização do proprietário registrada no chat. Testes de escrita usam somente caminhos de preview; no Storage, o caso de usuário externo foi demonstrado no simulador, sem alterar arquivos reais.

Esta revisão não é certificação, não garante ausência de falhas e não inclui auditoria das contas Google/Vercel, IAM completo, histórico de incidentes ou verificação jurídica dos procedimentos internos da empresa. Não foram feitas tentativas de força bruta nem testes de exaustão de recursos.

## Achados e evidências
| Achado | Risco | Evidência e correção |
|---|---|---|
| Storage permitia write para qualquer usuário autenticado | Alto: usuário Google externo poderia gravar/alterar arquivos fora do painel | Simulador com UID security-audit-unprivileged e e-mail fictício: permitido antes, negado com a nova regra. Publicação autorizada pelo usuário. |
| Firestore permitia ler diretamente todos os campos dos imóveis | Médio: novos campos internos poderiam ser expostos | REST anônimo retornou 200 antes, 403 após a regra autorizada. A API pública continuou entregando nove imóveis. |
| APIs públicas enviavam documentos inteiros | Médio: exposição de futuros campos internos | Lista explícita de campos públicos aplicada à listagem e aos detalhes. Teste de não divulgação de notas, contatos e credenciais. |
| Bibliotecas desatualizadas | Dependente do componente e da exposição | npm audit inicial: 41 avisos (6 críticos, 21 altos). Atualizações e overrides documentados no package.json; auditoria final: zero avisos conhecidos. |
| Ausência de política explícita e fontes externas desnecessárias | Transparência e minimização | Página /privacidade, link no rodapé, retirada de Google Fonts sem uso. Sem analytics/marketing ativos no código. |
| Proteções HTTP e de abuso incompletas | Defesa adicional | CSP, anti-iframe, no-referrer, Permissions-Policy, nosniff, HSTS, COOP compatível com popup; origem de requisições administrativas validada; limite distribuído de 60 escritas/minuto por conta, sem armazenar IP ou e-mail. |

## Testes realizados
- Firestore: leitura anônima do catálogo diretamente no banco negada com HTTP 403; lixeira já era negada antes.
- Firestore: tentativa anônima de criar documento em imoveis_preview negada com HTTP 403.
- Storage: listagem anônima do bucket negada com HTTP 403.
- Storage: upload anônimo de arquivo de teste em imoveis-preview negado com HTTP 403.
- Storage: tentativa simulada de escrita de usuário Google não administrador, com e-mail não verificado, bloqueada após correção.
- Após regras: API pública de produção mantém nove imóveis e imagem pública responde HTTP 200.
- SDK real Firebase Admin rejeitou JWT forjado sem assinatura válida.
- Testes de ausência de token, conta externa, e-mail não verificado, revogação, origem externa/opaque, IDs maliciosos, XSS como texto, arquivos inválidos, campos extras, duplicação, exclusão com arquivo de recuperação e limite de operações.
- Build e 83 testes aprovados na versão com Firebase Dev separado, incluindo inicialização do Firebase Auth sem require(esm), capa padrão, proteção contra sobrescrita do snapshot e bloqueio de upload no ambiente sem Storage.
- Integração no preview corrigido: login Google da conta autorizada, leitura dos nove imóveis, upload de imagem local não pessoal pela API e salvamento de imóvel aprovados após fechar as regras. A imagem de teste foi retirada da galeria e a configuração original restaurada; o arquivo permanece no prefixo de teste do Storage, conforme a retenção de arquivos para recuperação. Acesso sem token retorna mensagem de autenticação, sem erro de inicialização.
- Os testes com mocks não substituem os testes integrados; manter a validação de login e upload em futuras atualizações.

## Decisão sobre cookies e aceite
Não foi adicionado consentimento fictício ou aceite obrigatório para simples consulta ao catálogo. Nesta versão, não há analytics nem publicidade comportamental no código. Há autenticação administrativa, infraestrutura necessária e imagens remotas, explicadas na política.

A política identifica Mônica Consultoria Imobiliária e o contato profissional confirmado pelo usuário. Prazos exatos de atendimento, retenção e contratos com provedores devem refletir a operação real; não foram inventados prazos fixos.

Referência: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais

## Operação
- Branch feature/painel-administrativo: código, cabeçalhos e política em preview, sem merge para main nesta revisão.
- Regras Firebase: alterações publicadas separadamente com autorização explícita; afetam o projeto compartilhado.
- O formulário legado que gravava diretamente no Firebase deixa de gravar; usar o painel novo pela API.
- As fotos divulgadas usam URLs de download públicas por design; não armazenar documentos pessoais nesse fluxo.
- Arquivos órfãos e lixeira não são apagados automaticamente. Definir rotina de revisão e retenção antes de acumular dados reais.
- Backups e restauração, conta final da proprietária e ADMIN_EMAILS de Production devem ser conferidos antes de promover o painel.
- Overrides de gRPC/glob/minimatch devem ser reavaliados quando os pacotes superiores incorporarem as versões corrigidas.
- Compatibilidade Vercel: jwks-rsa usa jose 5.10 via override restrito a essa dependência, pois o carregamento CommonJS de jose 6 falhou no runtime observado. A importação com require(esm) desativado é coberta por teste; npm audit continua sem alertas conhecidos. Reavaliar o override quando houver suporte do runtime/pacote.

## Exposição histórica de credenciais
A busca no histórico Git encontrou duas chaves privadas em backend/serviceAccountKey.json (commits antigos). Apenas project_id, client_email e private_key_id foram examinados; os valores privados não foram exibidos nem usados para autenticar.
No Google Cloud, ambas as chaves correspondentes estão Disabled, com motivo Exposta. Não se confirmou uso indevido nem vazamento de uma chave atualmente ativa. As outras chaves listadas não foram revogadas, pois é necessário identificar seu uso antes de uma rotação.
O arquivo permanece recuperável no histórico; limpar o histórico sozinho não substitui revogar credenciais. Foram acrescentadas exclusões de arquivos de credenciais ao .gitignore.

## Firebase Dev separado
O projeto catalogo-imoveis-dev foi criado no plano Spark, sem faturamento. Preview da branch feature/painel-administrativo e Development usam credenciais próprias, guardadas como Secret no Vercel. Production não recebeu essas variáveis. A credencial Dev conseguiu ler seu próprio Firestore e foi recusada ao tentar ler imoveis no projeto de produção (PERMISSION_DENIED, código 7). Leitura anônima direta do Firestore Dev retorna HTTP 403.

Firebase Authentication Google foi habilitado e o login real da conta de teste foi validado no preview. A massa inicial contém nove imóveis, somente campos públicos; não há conexão permanente com o Firestore de produção para fazer a cópia. O teste real de cadastro sem foto e edição de preço passou. O registro temporário foi arquivado por limpeza controlada via SDK, preservando recuperação e deixando nove imóveis no catálogo.

Storage Dev não foi provisionado, respeitando a decisão do usuário de não ativar faturamento. A API rejeita uploads nesse ambiente e o painel informa a indisponibilidade; cadastros sem fotos usam a capa padrão. A chave extra criada na tentativa inicial de download foi excluída com autorização explícita, preservando somente a credencial efetivamente usada. O JSON baixado pelo usuário continua fora do repositório.

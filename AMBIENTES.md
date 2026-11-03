# Catálogo e API de teste

A mesma API é executada em cada ambiente. A seleção dos dados ocorre no servidor; não depende da URL nem de uma opção enviada pelo navegador.

| Ambiente Vercel | Projeto Firebase configurado | Catálogo | Lixeira | Novas imagens |
| --- | --- | --- | --- | --- |
| Production | catalogo-imoveis (sem alteração) | imoveis | imoveis_lixeira | imoveis/ |
| Preview da branch feature/painel-administrativo | catalogo-imoveis-dev | imoveis_preview | imoveis_preview_lixeira | Desativadas |
| Development | catalogo-imoveis-dev | imoveis_dev | imoveis_dev_lixeira | Desativadas |

Ambiente ausente ou desconhecido seleciona a coleção de Development. O prefixo imoveis-dev/ está preparado para eventual ativação futura do Storage; não existe bucket Dev provisionado nesta versão. As variáveis de Preview foram configuradas especificamente para a branch indicada; outras branches não são migradas automaticamente.

Somente VERCEL_ENV=production seleciona o catálogo publicado. Nunca use esse valor em execução local. Os limites de escrita também usam identificadores separados por ambiente.

## Espelhamento

No painel de teste vazio, o botão “Copiar imóveis atuais para o teste” cria uma cópia inicial a partir do snapshot público preparado. A cópia é executada em lote atômico, não sobrescreve documentos existentes e é bloqueada em Production. Alterações posteriores no teste não são sincronizadas de volta. A cópia não é atualizada continuamente, preservando os cenários de teste.

As fotos já publicadas continuam referenciadas por URLs públicas de leitura. Não há credencial de produção no ambiente Dev para alterá-las. Remover um imóvel do teste não apaga os arquivos originais. O preview atual já está preenchido; a coleção local só será preenchida ao usar o botão em Development.

Para a API local, use `npm run dev:vercel`, com as variáveis de servidor configuradas para Development. `npm run dev` executa apenas o frontend Vite. Fazer build do frontend não cria nem copia um banco: as funções de API precisam estar em execução.

## Isolamento entre projetos

O preview desta branch e Development agora usam um projeto Firebase diferente do de Production, com autenticação, banco, quotas e credenciais próprios. Os dois ambientes de teste compartilham o projeto Dev, mas mantêm coleções distintas. A credencial Dev foi testada contra o Firestore de produção e recebeu PERMISSION_DENIED (código 7).

Production mantém suas credenciais anteriores. O Firebase Auth do cliente é selecionado pela configuração pública do respectivo ambiente. O domínio do preview e localhost estão autorizados somente no fluxo necessário de testes, e as regras Dev negam acesso direto aos dados.

Não conceder acesso permanente à produção à API de teste para fazer espelhamento automático. Uma atualização futura da massa de testes deve importar explicitamente campos públicos e preservar cenários de teste existentes.

## Projeto Dev criado em 1/11/2026

- Projeto independente catalogo-imoveis-dev, plano Spark sem faturamento, sem Analytics ou Gemini.
- Aplicativo Catalogo Web Dev registrado; configuração pública em config/firebase-dev.public.json. Esses identificadores públicos não substituem autenticação nem permissões; a chave privada Admin nunca deve ir para esse arquivo.
- Firestore Standard criado em southamerica-east1 (São Paulo), com regras negando acesso direto; leitura REST anônima confirmada com HTTP 403.
- Google ativado, com localhost e o domínio atual do preview autorizados. A API continuará verificando o e-mail permitido, assinatura e revogação do token.
- Storage não provisionado: o usuário decidiu não ativar faturamento. FIREBASE_STORAGE_ENABLED=false impede upload no servidor e oculta o seletor de novas fotos no painel. Fotos existentes podem ser mantidas; novos cadastros aceitam capa padrão.
- CATALOG_SEED_SNAPSHOT=true usa fixtures/catalogo-dev.json (nove imóveis, somente campos públicos consultados na API pública em 1/11/2026). Não requer credenciais ou leituras do Firebase de produção; a cópia inicial mantém a proteção contra sobrescrita. As URLs das fotos públicas são apenas referências de leitura.
- FIREBASE_EXPECTED_PROJECT_ID=catalogo-imoveis-dev faz o servidor recusar credenciais configuradas para outro projeto.
- VITE_FIREBASE_CONFIG seleciona a configuração pública do cliente por ambiente. Nunca usar prefixo VITE_ para chaves privadas.

Conexão concluída: a credencial fornecida localmente pelo usuário foi configurada como Secret no Vercel para o Preview desta branch e Development. A chave extra da tentativa inicial de download foi excluída com autorização específica; ficou somente a credencial efetivamente instalada. Nenhuma chave privada foi impressa ou adicionada ao repositório. Os valores foram enviados ao CLI sem quebras de linha adicionais de pipelines PowerShell.

Validação integrada: login Google da conta autorizada; nove imóveis copiados atomicamente para o projeto Dev; cadastro pelo painel sem foto com capa padrão; edição de preço conferida no banco Dev; registro temporário arquivado por limpeza controlada via SDK e retirado do catálogo, restando nove imóveis. Essa limpeza não foi um teste do botão de exclusão da interface; a API de exclusão permanece coberta pelos testes automatizados. Build e 83 testes aprovados na preparação desta versão.

Antes da promoção para main: conferir a conta final da proprietária, o ADMIN_EMAILS de Production e o fluxo real no domínio próprio. As credenciais e flags de Dev não devem ser copiadas para Production.

## Proteção de novas branches Preview (03/11/2026)

O servidor recusa inicialização quando VERCEL_ENV=preview e FIREBASE_ADMIN_PROJECT_ID não é catalogo-imoveis-dev, mesmo sem FIREBASE_EXPECTED_PROJECT_ID. Uma nova branch precisa receber configuração Dev própria antes de testar APIs. A configuração específica de feature/painel-administrativo não é automaticamente herdada por outra branch. Este PR não copia Secrets nem altera Production.

## Development configurada em 03/11/2026

A development recebeu nove variáveis específicas de Preview, com frontend e API em catalogo-imoveis-dev e coleção imoveis_preview. Compartilha esse catálogo de teste com feature/painel-administrativo. Os dois domínios estáveis estão autorizados no Firebase Dev; novas branches não herdam suas variáveis. Ambos os previews permitem as contas de Bruno e Mônica. Production não foi modificada por essa configuração.

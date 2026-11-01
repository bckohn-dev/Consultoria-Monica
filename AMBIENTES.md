# Catálogo e API de teste

A mesma API é executada em cada ambiente. A seleção dos dados ocorre no servidor; não depende da URL nem de uma opção enviada pelo navegador.

| Ambiente Vercel | Catálogo | Lixeira | Novas imagens |
| --- | --- | --- | --- |
| Production | imoveis | imoveis_lixeira | imoveis/ |
| Preview (branches) | imoveis_preview | imoveis_preview_lixeira | imoveis-preview/ |
| Development ou ambiente ausente/desconhecido | imoveis_dev | imoveis_dev_lixeira | imoveis-dev/ |

Somente VERCEL_ENV=production seleciona o catálogo publicado. Nunca use esse valor em execução local. Os limites de escrita também usam identificadores separados por ambiente.

## Espelhamento

No painel de teste vazio, o botão “Copiar imóveis atuais para o teste” cria uma cópia inicial do catálogo. A cópia é executada em lote atômico, não sobrescreve documentos existentes e é bloqueada em Production. O catálogo de origem é apenas lido; alterações posteriores no teste não são sincronizadas de volta. A cópia não é atualizada continuamente, preservando os cenários de teste.

As fotos já publicadas continuam referenciadas por URLs de leitura; uploads novos usam o prefixo do ambiente. Remover um imóvel do teste não apaga os arquivos originais. O preview atual já está preenchido; a coleção local só será preenchida ao usar o botão em Development.

Para a API local, use `npm run dev:vercel`, com as variáveis de servidor configuradas para Development. `npm run dev` executa apenas o frontend Vite. Fazer build do frontend não cria nem copia um banco: as funções de API precisam estar em execução.

## Isolamento completo recomendado

A configuração atual separa coleções e caminhos dentro do projeto Firebase existente; compartilha credenciais, autenticação, quotas e infraestrutura. Isso protege os fluxos normais do aplicativo, mas não equivale a dois projetos fisicamente separados. Todos os previews de branches compartilham o catálogo de Preview.

Para uma barreira mais forte, criar um segundo projeto Firebase exclusivo de desenvolvimento e configurar no Vercel apenas os ambientes Preview/Development com credenciais desse projeto. Production deve manter as credenciais atuais. Separar também o bucket e a configuração Firebase Auth do cliente, autorizar os domínios necessários e aplicar regras restritivas. A conta de serviço de teste não deve ter acesso ao projeto de produção.

Ao migrar para outro projeto, o botão de cópia lê somente o projeto configurado naquele ambiente; portanto a carga inicial de produção deve ser uma importação explícita de campos públicos, feita uma vez por uma ferramenta confiável. Não conceder acesso permanente à produção à API de teste para fazer espelhamento automático.

## Projeto Dev criado em 1/11/2026

- Projeto independente catalogo-imoveis-dev, plano Spark sem faturamento, sem Analytics ou Gemini.
- Aplicativo Catalogo Web Dev registrado; configuração pública em config/firebase-dev.public.json. Esses identificadores públicos não substituem autenticação nem permissões; a chave privada Admin nunca deve ir para esse arquivo.
- Firestore Standard criado em southamerica-east1 (São Paulo), com regras negando acesso direto; leitura REST anônima confirmada com HTTP 403.
- Google ativado, com localhost e o domínio atual do preview autorizados. A API continuará verificando o e-mail permitido, assinatura e revogação do token.
- Storage não provisionado: o usuário decidiu não ativar faturamento. FIREBASE_STORAGE_ENABLED=false impede upload no servidor e oculta o seletor de novas fotos no painel. Fotos existentes podem ser mantidas; novos cadastros aceitam capa padrão.
- CATALOG_SEED_SNAPSHOT=true usa fixtures/catalogo-dev.json (nove imóveis, somente campos públicos consultados na API pública em 1/11/2026). Não requer credenciais ou leituras do Firebase de produção; a cópia inicial mantém a proteção contra sobrescrita. As URLs das fotos públicas são apenas referências de leitura.
- FIREBASE_EXPECTED_PROJECT_ID=catalogo-imoveis-dev faz o servidor recusar credenciais configuradas para outro projeto.
- VITE_FIREBASE_CONFIG seleciona a configuração pública do cliente por ambiente. Nunca usar prefixo VITE_ para chaves privadas.

Pendência de conexão: o download automatizado da chave do projeto Dev não ficou disponível. Foi solicitado ao usuário baixar o JSON localmente pelo Chrome/Brave; nenhuma chave privada foi impressa ou adicionada ao repositório. Até a configuração e validação das credenciais do Dev no Vercel, o preview existente continua usando as coleções de teste do projeto anterior. Não considerar a migração concluída só porque o projeto novo foi criado.

Antes da promoção para main: conferir a conta final da proprietária, o ADMIN_EMAILS de Production e o fluxo real no domínio próprio. As credenciais e flags de Dev não devem ser copiadas para Production.

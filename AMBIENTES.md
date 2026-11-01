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

Essa criação de projeto e migração de credenciais não foi feita nesta alteração. Nenhum dado existente foi recopiado ou apagado.

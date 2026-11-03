# Painel administrativo

Branch: feature/painel-administrativo. A main não recebe esta funcionalidade até aprovação.

## Acesso
- Abra /gestao-monica no preview; o painel fica em /gestao-monica/imoveis. Os endereços antigos retornam 404.
- Autenticação pelo Firebase: Google ou e-mail/senha. Não há cadastro público pelo painel.
- O servidor verifica assinatura e validade do ID token, revogação, e-mail confirmado e ADMIN_EMAILS.
- Sem ADMIN_EMAILS, o backend recusa o acesso; esconder a rota não é a proteção.
- A sessão do navegador dura até o fechamento da aba, com opção Sair.
- Nunca configure a lista de administradores com prefixo VITE_.
- Ative os provedores escolhidos no Firebase Authentication. Para e-mail/senha, crie a conta no console, defina a senha fora do chat e confirme o e-mail.
- Para Google, ative o provedor e autorize o domínio exato do preview em Authentication > Settings > Authorized domains.
- Ao trocar o e-mail permitido em ADMIN_EMAILS, faça um novo deploy para aplicar.

## Dados de teste
- VERCEL_ENV=preview usa imoveis_preview e imoveis_preview_lixeira.
- Production usa catalogo-imoveis/imoveis. Desenvolvimento local usa catalogo-imoveis-dev/imoveis_dev; veja AMBIENTES.md.
- No primeiro acesso ao preview, use a opção de preencher o catálogo de teste; a origem é um snapshot público, sem leitura do banco de produção.
- A cópia preserva os documentos originais. A operação é recusada em produção e quando o catálogo de teste não está vazio.
- Os previews desta branch compartilham o catálogo imoveis_preview.
- O Firebase Dev atual está sem Storage/faturamento; uploads estão desativados por FIREBASE_STORAGE_ENABLED=false. Não serão habilitados por este PR.
- Os dados de teste não serão migrados automaticamente para produção.
- A exclusão retira o documento do catálogo e arquiva seus dados na lixeira. As imagens são preservadas. A restauração é manual nesta versão.

## Cadastro
Nome, preço, quartos, área mínima e máxima, garagem, suíte, descrição, prazo de entrega, marca, destaque e ordem, capa e até 20 fotos.
- Enter cria quebras de linha normais na descrição.
- Fotos JPG/PNG/WebP até 15 MB são convertidas para JPEG e redimensionadas até 1800 px antes do upload.
- Cada envio otimizado deve ter no máximo 2 MB. O servidor valida tamanho e assinatura do arquivo.
- A capa pode ser alterada sem reenviar as fotos existentes.
- Alterações usam update, preservando IDs e outros campos legados.
- Campos, IDs e URLs são validados também no servidor.
- Uploads concluídos antes de um cancelamento podem permanecer sem vínculo no Storage; limpeza não automática.

## Antes da produção
1. Validar login com a conta autorizada no preview.
2. Exercitar criação, edição, galeria, destaque e exclusão somente no catálogo de teste.
3. Revisar e aplicar firestore.rules e storage.rules ao projeto correto. Os arquivos bloqueiam acesso direto do navegador; Admin SDK continua autorizado. A publicação anterior foi autorizada separadamente; este PR não altera regras na nuvem.
4. Verificar se outros aplicativos usam o mesmo Firebase antes de aplicar as regras.
5. Configurar ADMIN_EMAILS em Production com o e-mail final da proprietária.
6. Aprovar o merge para main somente após os testes.

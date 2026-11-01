# Painel administrativo

Branch: feature/painel-administrativo. A main não recebe esta funcionalidade até aprovação.

## Acesso
- Abra /admin ou /login no preview.
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
- Production e desenvolvimento local usam imoveis e imoveis_lixeira. Não testar escrita local com credenciais reais.
- No primeiro acesso ao preview, use “Copiar imóveis atuais para o teste”.
- A cópia preserva os documentos originais. A operação é recusada em produção e quando o catálogo de teste não está vazio.
- Os previews desta branch compartilham o catálogo imoveis_preview.
- Uploads de preview são gravados em imoveis-preview/; os originais não são substituídos.
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
3. Revisar e aplicar firestore.rules e storage.rules ao projeto correto. Os arquivos bloqueiam acesso direto do navegador; Admin SDK continua autorizado. Não foram publicados automaticamente, pois isso afeta o projeto Firebase compartilhado pela main.
4. Verificar se outros aplicativos usam o mesmo Firebase antes de aplicar as regras.
5. Configurar ADMIN_EMAILS em Production com o e-mail final da proprietária.
6. Aprovar o merge para main somente após os testes.

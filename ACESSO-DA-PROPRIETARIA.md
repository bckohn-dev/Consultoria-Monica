# Como a proprietária edita os imóveis

Após a publicação do painel em produção, a entrada será https://mcnimobiliaria.com.br/gestao-monica. Salve esse endereço nos favoritos, clique em “Entrar com Google” e selecione monicanogueiravendas@gmail.com. Não é necessário acessar Firebase nem ter conta no Vercel.

No painel, use o lápis ao lado do imóvel, altere os campos e clique em “Salvar imóvel”. Para cadastrar, use “Novo imóvel”. A primeira foto vira a capa; sem fotos, o site usa a imagem padrão. A exclusão retira o imóvel do catálogo e guarda uma cópia para recuperação manual. Ao terminar, use “Sair”.

## Estado em 03/11/2026

- Este PR tem como destino development. Não publica o painel em main/produção.
- Conta da proprietária confirmada: monicanogueiravendas@gmail.com. Antes da publicação, configurar ADMIN_EMAILS de Production exclusivamente com essa conta e validar o login. A configuração real de Production não foi alterada neste PR.
- O preview existente usa o Firebase separado catalogo-imoveis-dev e a conta de teste xdbruninhodx@gmail.com. O domínio estável de teste é https://consultoria-monica-git-feature-pain-081fa0-bckohn-devs-projects.vercel.app/gestao-monica.
- O login Vercel eventualmente exibido no preview é uma proteção de teste separada da autenticação do painel.
- O formulário alternativo de e-mail/senha exige conta provisionada previamente; não cadastra novos usuários.

## Discrição e segurança

A entrada não aparece no menu ou rodapé. As rotas reservadas enviam noindex/noarchive e no-store; /admin e /login antigos passam a retornar 404. Essas medidas reduzem exposição, mas não tornam a URL secreta ou indetectável.

Quem receber o link ainda precisa de token Firebase válido, não revogado, e-mail verificado e autorização ADMIN_EMAILS no servidor. O painel fica em /gestao-monica/imoveis e consulta a autorização antes de abrir. A API repete essa verificação em cada operação; conhecer o caminho não permite editar imóveis.

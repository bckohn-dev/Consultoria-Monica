# Como a proprietária edita os imóveis

Após a liberação do painel em produção, acessar https://mcnimobiliaria.com.br/admin. Se não houver uma sessão, o site abre a página de entrada. Usar “Entrar com Google” e selecionar o e-mail previamente autorizado.

No painel, usar o lápis ao lado do imóvel, alterar os campos e clicar em “Salvar imóvel”. Para cadastrar, usar “Novo imóvel”. A primeira foto enviada vira a capa; sem fotos, o site usa a imagem padrão. A exclusão retira o imóvel do catálogo e guarda uma cópia para recuperação. Ao terminar, usar “Sair”.

Não é necessário entrar no Firebase, conhecer código ou compartilhar a senha do Google. O endereço do painel pode ser salvo nos favoritos. Saber a URL não dá permissão: a API exige autenticação válida, e-mail verificado e conta autorizada.

## Estado atual

- O painel está na branch feature/painel-administrativo e disponível somente no preview. A URL de produção acima só deverá ser usada depois da promoção dessa versão.
- Conta de teste autorizada: xdbruninhodx@gmail.com.
- A conta da proprietária ainda precisa ser confirmada e incluída no ADMIN_EMAILS de Production. Não inferir que o e-mail profissional de contato é a conta escolhida para administrar.
- Para Google, a proprietária usa a senha da própria conta na janela do Google. O formulário de e-mail/senha é uma alternativa para contas previamente provisionadas no Firebase; não cadastra usuários novos.
- O login do Vercel que pode aparecer no preview é uma proteção do ambiente de testes, separada do login do painel. O site publicado no domínio próprio não deve exigir conta Vercel da proprietária.

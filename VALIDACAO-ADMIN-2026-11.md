# Validação do painel para publicação — 03/11/2026

## Verificações concluídas

- Login Google real de Bruno no preview development e listagem inicial com nove imóveis.
- Cadastro pelo formulário de um imóvel temporário: preço decimal, quartos, metragem, garagem, suíte, destaque/ordem, entrega e descrição com quebra de linha real.
- Cadastro sem foto aceito com capa padrão. Catálogo público Dev com dez imóveis; clique na imagem abre detalhes corretos.
- Edição persistiu nome, preço R$ 299.900, três quartos, área 45 a 55 m², retirada de destaque e descrição. Detalhes públicos refletiram os campos sem mudar o ID/URL.
- API pública de produção continua com nove imóveis, sem o ID do teste.
- 107 testes passaram em 17 arquivos e a build passou. Cobertura de autorização antes do banco, revogação, origem, isolamento, validação de entradas/uploads, confirmação/cancelamento de exclusão, proteção de edição não salva, falha de gravação e reordenação da capa.
- Auditoria do lockfile: zero vulnerabilidades conhecidas em todos os níveis.

## Limitações e pendências

- Exclusão pela interface iniciada no registro temporário, aguardando confirmação na janela do navegador. Conferir retorno a nove imóveis e arquivo na lixeira Dev antes de declarar teste real concluído.
- Upload real indisponível no Dev por decisão de manter Storage/faturamento desativado. API de upload verificada com armazenamento simulado; isso não comprova upload no bucket de produção.
- Login real da Mônica deve ser validado por ela; sua conta está na lista Dev.
- Production ainda precisa de ADMIN_EMAILS com as contas aprovadas e do domínio mcnimobiliaria.com.br autorizado para OAuth.
- A revisão automática rejeitou baixar secrets de Production. Inspeção feita por configuração pública, nomes das variáveis e API pública; nenhuma credencial de produção baixada/exibida.

## Publicação

PR para main deve permanecer como rascunho enquanto faltarem configurações e validações acima. O merge dispara deploy de produção; abrir o PR não publica. Preservar credenciais/dados de Production, sem copiar variáveis de Dev. Fazer validação controlada de login e upload no domínio próprio após publicação aprovada.

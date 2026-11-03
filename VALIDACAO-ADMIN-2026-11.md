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

- Exclusão pela interface iniciou a confirmação, mas a janela não ficou disponível ao usuário. Limpeza concluída por transação SDK exclusivamente em catalogo-imoveis-dev: registro temporário ausente, uma cópia na lixeira e nove imóveis no catálogo. Isso valida a limpeza e recuperação, não a confirmação final da interface; os testes automatizados cobrem confirmar/cancelar.
- Upload real indisponível no Dev por decisão de manter Storage/faturamento desativado. API de upload verificada com armazenamento simulado; isso não comprova upload no bucket de produção.
- Login real da Mônica deve ser validado por ela; sua conta está na lista Dev.
- Configuração de Production concluída com autorização explícita: ADMIN_EMAILS contém Bruno e Mônica; mcnimobiliaria.com.br autorizado no Firebase catalogo-imoveis, preservando os domínios anteriores. Google confirmado como ativado no console. As variáveis terão efeito no próximo deploy; não foi disparado deploy de produção.
- A revisão automática rejeitou baixar secrets de Production. Inspeção feita por configuração pública, nomes das variáveis e API pública; nenhuma credencial de produção baixada/exibida.

## Publicação

Configurações de publicação concluídas e PR para main pronto para revisão, com as limitações de testes descritas acima. O merge dispara deploy de produção; abrir o PR não publica. Preservar credenciais/dados de Production, sem copiar variáveis de Dev. Fazer validação controlada de login e upload no domínio próprio após publicação aprovada.

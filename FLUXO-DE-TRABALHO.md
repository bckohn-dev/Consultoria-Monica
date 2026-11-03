# Fluxo de trabalho do catálogo

Padrão aprovado: **branch específica → development (dev) → main**.

## Desenvolvimento e revisão

1. Atualizar a referência remota e criar a branch de tarefa a partir de origin/development, com nome como feature/descricao, fix/descricao ou chore/descricao.
2. Implementar somente o escopo da tarefa e executar verificações proporcionais ao risco. Para mudanças funcionais, rodar os testes pertinentes e a build; antes de publicar, revisar segurança e dependências.
3. Abrir PR da branch específica para development. Correções e documentação também passam por essa etapa; não enviar commits diretamente às branches compartilhadas.
4. Após revisão e merge, testar o preview estável da development com o Firebase Dev separado. Não presumir que uma branch nova herde as variáveis ou os domínios OAuth desse preview.
5. Abrir ou atualizar o PR development → main apenas com a versão integrada. Enquanto houver PRs de tarefa necessários pendentes ou validação incompleta, manter a promoção como rascunho.
6. Revisar a configuração de Production, aprovar a versão e fazer o merge de publicação. A integração Git do Vercel publica a main. Abrir o PR ou marcá-lo pronto não autoriza merge automático.
7. Conferir catálogo, acesso administrativo e demais fluxos afetados no domínio de produção após publicar.

## Alinhamento das branches

- development é a branch de integração e testes; main representa a versão publicada.
- Durante o desenvolvimento, development pode estar à frente. Ao promover uma versão, o conteúdo de main deve corresponder ao estado validado de development, sem alterações exclusivas de uma branch de release fora desse fluxo.
- Identificadores de commit podem diferir por causa de commits de merge; comparar também o conteúdo e a ancestralidade, não só o SHA.
- Preferir merge que preserve a ancestralidade na promoção development → main. Não reescrever histórico nem usar force push em branches compartilhadas.
- Correções urgentes também nascem em branch específica e passam por development antes da promoção. Qualquer exceção exige alinhamento explícito com o proprietário.

## Ambientes

- Preview estável Dev: https://consultoria-monica-git-development-bckohn-devs-projects.vercel.app/catalogo
- Painel Dev: https://consultoria-monica-git-development-bckohn-devs-projects.vercel.app/gestao-monica
- Produção: https://mcnimobiliaria.com.br/
- Painel de produção após publicação: https://mcnimobiliaria.com.br/gestao-monica

Branch, ambiente Vercel, projeto Firebase e coleções são configurações distintas. Main usa Production/catalogo-imoveis; o preview development usa catalogo-imoveis-dev/imoveis_preview. Credenciais, flags e dados Dev não devem ser copiados para Production. Ver AMBIENTES.md e VALIDACAO-ADMIN-2026-11.md.

Este documento define o processo. Não instala regras de proteção no GitHub nem altera permissões de merge; essas configurações exigem uma alteração separada e explícita.

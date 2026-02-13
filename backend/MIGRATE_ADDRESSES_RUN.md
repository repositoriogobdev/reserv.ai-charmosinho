Migração de addresses — instruções para executar no Supabase
=========================================================

Objetivo
--------
Normalizar a coluna `address` da tabela `restaurants` para garantir que seja um JSON/JSONB com chaves como `street`, `city`, `state`, `zipCode`, `country`.

Arquivos incluídos no repositório
---------------------------------
- `backend/dryrun_migrate_addresses.sql`  -> script de dry-run (lista registros que seriam alterados)
- `backend/migrate_addresses_supabase.sql` -> script definitivo para rodar no Supabase (converte strings/JSON)
- `backend/migrate-addresses.js` -> script Node (opcional) para rodar localmente com credenciais

Recomendações antes de executar
-------------------------------
1. BACKUP: Exporte a tabela `restaurants` (CSV ou SQL) pelo Supabase Studio → Table → Export.
2. Teste: Execute primeiro o dry-run para revisar os registros que seriam afetados.

Execução via Supabase Studio (passo a passo)
-------------------------------------------
1. Abra Supabase Studio e selecione seu projeto.
2. Vá em SQL Editor → New query.
3. Cole o conteúdo do arquivo `backend/dryrun_migrate_addresses.sql` e clique em Run.
   - Revise a coluna `action` do resultado.
4. Se estiver satisfeito, cole o conteúdo de `backend/migrate_addresses_supabase.sql` e clique em Run.
   - O script realiza a conversão conservadora:
     - Strings que parecem JSON (começam com { ou [) são convertidas para jsonb.
     - Strings simples são transformadas em `{"street": "<texto>"}`.

Comando SQL de correção pontual (ex.: um id específico)
-----------------------------------------------------
Use este trecho para consertar um registro específico substituindo <ID>:

UPDATE restaurants
SET address = jsonb_build_object('street', trim(both '"' FROM address::text))::jsonb,
    updated_at = now()
WHERE id = '<ID>';

Dry-run avançado (listar detalhes)
----------------------------------
Se quiser um relatório mais detalhado (por exemplo, mostrar o valor original e o que viraria), execute no SQL Editor:

SELECT id, address::text AS original_address,
  CASE
    WHEN address::text ~ '^\\s*\\"?\\{' OR address::text ~ '^\\s*\\"?\\[' THEN 'string JSON -> parse'
    WHEN address::text ~ '^[\\"].+[\\"]$' THEN 'quoted string -> strip quotes'
    WHEN jsonb_typeof(address) = 'object' THEN 'object (no change)'
    ELSE 'plain string -> will be street'
  END AS action
FROM restaurants
WHERE address IS NOT NULL
ORDER BY id;

Suporte
-------
Se quiser, eu gero um SQL de atualização apenas para os IDs listados no dry-run (você pode revisar antes de executar). Ou posso gerar um `dry-run` ainda mais conservador.

Ao terminar a migração, recomendo remover tratamentos temporários no frontend que limpam aspas (pois a API passará a retornar objetos consistentes).


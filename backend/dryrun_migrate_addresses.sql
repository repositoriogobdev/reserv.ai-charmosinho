-- Dry-run SQL: lista os registros que seriam alterados pela migração de 'address'
-- Execute no Supabase SQL Editor para revisar antes de aplicar alterações.

SELECT id, address,
  CASE
    WHEN address IS NULL THEN 'skip: null'
    WHEN jsonb_typeof(address::jsonb) IS NOT NULL AND jsonb_typeof(address::jsonb) = 'object' THEN 'object -> no change'
    WHEN address::text ~ '^\s*\"?\{' OR address::text ~ '^\s*\"?\[' THEN 'string JSON -> will parse to JSON'
    ELSE 'string plain -> will convert to {"street": <text>} '
  END AS action
FROM restaurants
WHERE address IS NOT NULL
ORDER BY id;

-- Observação: alguns RDBMS/SETUPS podem lançar erro ao converter tipos; este dry-run tenta inferir pela forma do conteúdo.


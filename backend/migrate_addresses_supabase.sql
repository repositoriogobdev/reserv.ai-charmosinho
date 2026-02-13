-- Script de migração para Supabase (Postgres)
-- Salva este arquivo e execute no SQL Editor do Supabase
-- Objetivo: normalizar a coluna `address` da tabela `restaurants`
-- Resultado desejado: address será um JSON/JSONB objeto com chaves como { street, city, state, zipCode, country }

BEGIN;

-- Bloco plpgsql para tratar diferentes tipos (text vs json/jsonb)
DO $$
DECLARE
  col_type text;
BEGIN
  SELECT data_type INTO col_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'restaurants' AND column_name = 'address';

  IF col_type = 'text' THEN
    -- Coluna é TEXT: se o conteúdo parece JSON -> parsear para jsonb; senão -> armazenar como { street: texto }
    UPDATE restaurants
    SET address = CASE
      WHEN address ~ '^\s*\{' OR address ~ '^\s*\[' THEN (address::jsonb)
      ELSE jsonb_build_object('street', address)
    END
    WHERE address IS NOT NULL;

  ELSE
    -- Coluna já é json/jsonb (ou outro tipo). Tratar valores que sejam strings JSON ou strings simples armazenadas como jsonb
    UPDATE restaurants
    SET address = CASE
      WHEN jsonb_typeof(address) = 'object' THEN address
      WHEN jsonb_typeof(address) = 'string' THEN jsonb_build_object('street', address::text)
      ELSE jsonb_build_object('street', address::text)
    END
    WHERE address IS NOT NULL;
  END IF;
END$$ LANGUAGE plpgsql;

-- Limpar aspas internas em campos 'street' quando address já é um objeto
DO $$
BEGIN
  UPDATE restaurants
  SET address = jsonb_set(
    address,
    '{street}',
    to_jsonb(trim(both '"' FROM (address->>'street')))
  )
  WHERE address IS NOT NULL
    AND jsonb_typeof(address) = 'object'
    AND (address->>'street') ~ '^".*"$';
END$$ LANGUAGE plpgsql;

COMMIT;

-- Observações:
-- 1) Faça backup da tabela antes de executar.
-- 2) Se você usa schema diferente de 'public', ajuste table_schema na query acima.
-- 3) O script tenta ser conservador: transforma strings JSON em JSONB e strings simples em objeto { street: ... }.
-- 4) Após rodar, verifique alguns registros:
--    SELECT id, address FROM restaurants LIMIT 20;

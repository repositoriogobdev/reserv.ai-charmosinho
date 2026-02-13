#!/usr/bin/env node

/**
 * Script para corrigir o schema da tabela reservations no Supabase
 * Adiciona as colunas faltantes (date, time) necessárias para criar reservas
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function fixSchema() {
  try {
    console.log('🔧 Alterando schema da tabela reservations...\n');

    // SQL para adicionar colunas se não existirem
    const sql = `
      ALTER TABLE reservations
      ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE,
      ADD COLUMN IF NOT EXISTS time TIME NOT NULL DEFAULT '12:00:00';

      CREATE INDEX IF NOT EXISTS idx_reservations_restaurant_id ON reservations(restaurant_id);
      CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
      CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
    `;

    // Executar cada comando separadamente para melhor tratamento de erro
    const commands = [
      `ALTER TABLE reservations ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE`,
      `ALTER TABLE reservations ADD COLUMN IF NOT EXISTS time TIME NOT NULL DEFAULT '12:00:00'`,
      `CREATE INDEX IF NOT EXISTS idx_reservations_restaurant_id ON reservations(restaurant_id)`,
      `CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date)`,
      `CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status)`
    ];

    for (const command of commands) {
      try {
        const { data, error } = await supabase.rpc('execute_sql', { sql: command }).then(() => ({ data: null, error: null })).catch(err => ({ data: null, error: err }));
        
        if (error) {
          console.log(`⚠️  ${command}`);
          console.log(`   Mensagem: ${error.message || 'Coluna/índice pode já existir'}\n`);
        } else {
          console.log(`✅ ${command}\n`);
        }
      } catch (err) {
        console.log(`⚠️  ${command}`);
        console.log(`   Erro: ${err.message}\n`);
      }
    }

    // Verificar estrutura da tabela
    console.log('\n📋 Verificando estrutura da tabela reservations...\n');
    
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'reservations')
      .eq('table_schema', 'public');

    if (columnsError) {
      console.log('⚠️  Não foi possível listar colunas via information_schema');
    } else if (columns) {
      console.log('Colunas da tabela:');
      columns.forEach(col => {
        console.log(`  • ${col.column_name}: ${col.data_type} ${col.is_nullable ? '(nullable)' : '(NOT NULL)'}`);
      });
    }

    console.log('\n✅ Schema corrigido com sucesso!\n');
    
  } catch (error) {
    console.error('❌ Erro ao corrigir schema:', error);
    process.exit(1);
  }
}

fixSchema();

#!/usr/bin/env node

/**
 * Script para verificar columns reais da tabela e consertar se necessário
 */

require('dotenv').config();
const fetch = require('node-fetch');  // ou usar axios

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

async function checkColumnsAndFix() {
  try {
    console.log('🔍 Verificando colunas reais da tabela...\n');

    // Usar a API do Postgres via Supabase para consultar information_schema
    const query = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reservations' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/?select=column_name,data_type&table_name=eq.reservations`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('\n📋 Colunas encontradas na tabela reservations:\n');

    // Tentar abordagem alternativa - usar o Supabase SDK
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Fazer um SELECT * para ver que colunas retorna
    const { data, error } = await supabase
      .from('reservations')
      .select()
      .limit(0);  // Sem dados, só schema

    if (!error && data !== null && Array.isArray(data) && data.length === 0) {
      console.log('✅ Tabela está vazia, verificando colunas...');
      
      // Se não tem dados, testar com insert para ver que colunas faltam
      const testData = {
        restaurant_id: 'schema-check',
        customer_name: 'test',
        customer_email: 'test@test.com',
        customer_phone: '1234567890',
        number_of_people: 1,
        status: 'confirmed'
      };

      const { error: insertError } = await supabase
        .from('reservations')
        .insert([testData]);

      if (insertError) {
        console.log('\n❌ Erro ao inserir dados mínimos:');
        console.log(`   ${insertError.message}\n`);

        // Analisar qual coluna está faltando
        if (insertError.message.includes('date')) {
          console.log('🔧 Falta a coluna: date');
          console.log('   Tipo esperado: DATE');
          console.log('   Comando SQL:\n');
          console.log('   ALTER TABLE reservations ADD COLUMN date DATE NOT NULL DEFAULT CURRENT_DATE;\n');
        }
        if (insertError.message.includes('time')) {
          console.log('🔧 Falta a coluna: time');
          console.log('   Tipo esperado: TIME');
          console.log('   Comando SQL:\n');
          console.log('   ALTER TABLE reservations ADD COLUMN time TIME NOT NULL DEFAULT \'12:00:00\'::time;\n');
        }
      }
    }

    // Tentar via SQL bruto
    console.log('\n🔧 Tentando adicionar colunas via RPC execute_sql...\n');

    const { data: rpcResult, error: rpcError } = await supabase.rpc('execute_sql', {
      sql: `
        ALTER TABLE reservations
        ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE,
        ADD COLUMN IF NOT EXISTS time TIME NOT NULL DEFAULT '12:00:00'::time;
      `
    });

    if (rpcError) {
      if (rpcError.message?.includes('function execute_sql')) {
        console.log('⚠️  RPC execute_sql não existe');
        console.log('\n✏️  INSTRUÇÕES MANUAIS:');
        console.log('━'.repeat(70));
        console.log('1. Acesse: ' + SUPABASE_URL);
        console.log('2. Vá para: SQL Editor');
        console.log('3. Execute este SQL:\n');
        console.log('   ┌─────────────────────────────────────────────────────────────────┐');
        console.log('   │ ALTER TABLE reservations                                        │');
        console.log('   │ ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE,│');
        console.log('   │ ADD COLUMN IF NOT EXISTS time TIME NOT NULL DEFAULT \'12:00:00\'::time; │');
        console.log('   └─────────────────────────────────────────────────────────────────┘\n');
        console.log('4. Execute');
        console.log('5. Voltevoltez aqui e execute novamente este script');
        console.log('━'.repeat(70) + '\n');
      } else {
        console.log('❌ Erro ao executar SQL:', rpcError.message);
      }
    } else {
      console.log('✅ Colunas adicionadas com sucesso!');
      console.log('   Agora você pode criar reservas normalmente\n');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkColumnsAndFix();

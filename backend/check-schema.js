#!/usr/bin/env node

/**
 * Script para verificar e corrigir schema da tabela reservations
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAndFixSchema() {
  try {
    console.log('🔍 Verificando schema da tabela reservations...\n');

    // Tentar obter uma reserva para ver quais colunas existem
    const { data: allData, error: allError } = await supabaseAdmin
      .from('reservations')
      .select('*')
      .limit(1);

    if (allError) {
      console.error('❌ Erro ao acessar tabela:', allError);
      process.exit(1);
    }

    console.log('✅ Tabela de reservations existe!');
    
    if (allData && allData.length > 0) {
      const reservation = allData[0];
      console.log('\n📋 Colunas atuais:');
      Object.keys(reservation).forEach(col => {
        const value = reservation[col];
        const type = Array.isArray(value) ? 'array' : typeof value;
        console.log(`  • ${col}: ${type} (${value})`);
      });
    }

    console.log('\n🔧 Adicionando colunas faltantes...\n');

    // Usar SQL bruto para adicionar colunas
    const { error: alterError } = await supabaseAdmin.rpc(
      'execute_sql',
      { sql: `ALTER TABLE reservations ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE, ADD COLUMN IF NOT EXISTS time TIME NOT NULL DEFAULT '12:00:00'::time` }
    ).catch(() => {
      // RPC pode não existir, tentar outra abordagem
      return { error: { message: 'RPC não disponível' } };
    });

    if (alterError && alterError.message?.includes('RPC')) {
      // Se RPC não funcionar, usar uma abordagem diferente
      console.log('⚠️  RPC execute_sql não disponível');
      console.log('   Tentando inserção de teste...\n');
    } else if (alterError) {
      console.log(`⚠️  ${alterError.message}\n`);
    } else {
      console.log('✅ Colunas adicionadas com sucesso!\n');
    }

    // Agora testar se consegue inserir
    console.log('🧪 Testando inserção com schema...\n');

    const testReservation = {
      restaurant_id: 'test-' + Date.now(),
      customer_name: 'Schema Test',
      customer_email: 'test@schema.com',
      customer_phone: '9999999999',
      date: '2026-02-12',
      time: '14:30',
      number_of_people: 1,
      status: 'confirmed',
      notes: 'Test'
    };

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('reservations')
      .insert([testReservation])
      .select();

    if (insertError) {
      console.log('❌ Erro ao inserir:');
      console.log(`   ${insertError.message}\n`);
      console.log('Verifique o Supabase Dashboard e adicione as colunas manualmente:');
      console.log('  ALTER TABLE reservations');
      console.log(`    ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE,`);
      console.log(`    ADD COLUMN IF NOT EXISTS time TIME NOT NULL DEFAULT '12:00:00'::time;\n`);
    } else {
      console.log('✅ Inserção bem-sucedida!');
      console.log('   Schema está pronto!\n');
      
      // Deletar o teste
      if (insertData && insertData[0]) {
        await supabaseAdmin
          .from('reservations')
          .delete()
          .eq('id', insertData[0].id);
        console.log('🧹 Registro de teste removido\n');
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkAndFixSchema();

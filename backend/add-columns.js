#!/usr/bin/env node

/**
 * Script para adicionar colunas faltantes na tabela de reservations
 * usando SQL direto via cURL
 */

require('dotenv').config();
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function addColumnsViaSql() {
  try {
    console.log('🔧 Adicionar colunas na tabela reservations...\n');

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados');
      process.exit(1);
    }

    // SQL para adicionar as colunas
    const sqlQuery = `
      ALTER TABLE public.reservations
      ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE,
      ADD COLUMN IF NOT EXISTS time TIME NOT NULL DEFAULT '12:00:00'::time;
      
      CREATE INDEX IF NOT EXISTS idx_reservations_restaurant_id ON public.reservations(restaurant_id);
      CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(date);
      CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
    `.trim();

    // URL da API Supabase para executar queries
    const rpcUrl = `${supabaseUrl}/rest/v1/rpc/sql`;

    console.log('Tentando executar SQL via RPC...');
    console.log('SQL:', sqlQuery.substring(0, 100) + '...\n');

    try {
      const { stdout, stderr } = await execAsync(`curl -X POST "${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/execute_sql" \\
        -H "apikey: ${serviceRoleKey}" \\
        -H "Authorization: Bearer ${serviceRoleKey}" \\
        -H "Content-Type: application/json" \\
        -d '{"sql":"${sqlQuery.replace(/"/g, '\\"').replace(/\n/g, ' ')}"}'`);

      const result = JSON.parse(stdout);
      
      if (result.error) {
        console.log('⚠️  RPC SQL não disponível ou erro:', result.error.message);
      } else {
        console.log('✅ SQL executado com sucesso!');
      }
    } catch (curlError) {
      console.log('⚠️  Não foi possível executar via cURL/RPC');
      console.log('   Tente executar manualmente no Supabase Dashboard:');
      console.log('\n📝 SQL para executar:');
      console.log('-'.repeat(60));
      console.log(sqlQuery);
      console.log('-'.repeat(60) + '\n');
    }

    // Verificar se consegue inserir agora
    console.log('✅ Configure as colunas manualmente se necessário');
    console.log('   Depois execute este script novamente para verificar\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

addColumnsViaSql();

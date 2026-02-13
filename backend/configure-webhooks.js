require('dotenv').config();
const { supabaseAdmin } = require('./config/supabase');

async function configureRestaurantWebhooks() {
  try {
    console.log('🔗 Configurando webhooks específicos para cada restaurante...\n');

    // Webhooks reais para cada unidade (atualize com suas URLs reais)
    const webhooksConfig = [
      {
        name: 'Unidade Botafogo',
        webhook_url: 'https://starbem-n8n-starbem.5qkgxi.easypanel.host/webhook/botafogo'
      },
      {
        name: 'Unidade Tavares',
        webhook_url: 'https://starbem-n8n-starbem.5qkgxi.easypanel.host/webhook/tavares'
      },
      {
        name: 'Unidade Leandro Mota',
        webhook_url: 'https://starbem-n8n-starbem.5qkgxi.easypanel.host/webhook/leandro'
      }
    ];

    for (const { name, webhook_url } of webhooksConfig) {
      // Buscar restaurante por nome
      const { data: restaurant, error: selectError } = await supabaseAdmin
        .from('restaurants')
        .select('id')
        .eq('name', name)
        .single();

      if (selectError) {
        console.log(`⏭️  ${name} não encontrado`);
        continue;
      }

      // Atualizar webhook URL (armazenar em google_calendar_id ou criar coluna nova)
      const { error: updateError } = await supabaseAdmin
        .from('restaurants')
        .update({ 
          google_calendar_id: webhook_url
        })
        .eq('id', restaurant.id);

      if (updateError) {
        console.log(`❌ Erro ao configurar webhook para ${name}: ${updateError.message}`);
      } else {
        console.log(`✅ ${name}`);
        console.log(`   Webhook: ${webhook_url}\n`);
      }
    }

    console.log('✨ Webhooks configurados com sucesso!');
    console.log('\n📝 Como atualizar os webhooks:');
    console.log('   1. Edite este arquivo com as URLs reais do seu N8N');
    console.log('   2. Execute: node configure-webhooks.js\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao configurar webhooks:', error.message);
    process.exit(1);
  }
}

configureRestaurantWebhooks();

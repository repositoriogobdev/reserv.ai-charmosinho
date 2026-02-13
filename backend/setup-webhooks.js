require('dotenv').config();
const { supabaseAdmin } = require('./config/supabase');

async function configureWebhooks() {
  try {
    console.log('🔗 Configurando webhooks N8N nos restaurantes...\n');

    // Definir a URL base do webhook N8N
    const webhookBaseUrl = process.env.N8N_WEBHOOK_URL || 'https://seu-n8n-instance.com/webhook';

    // Restaurantes com seus webhooks
    const webhooksConfig = {
      'Unidade Botafogo': 'botafogo',
      'Unidade Tavares': 'tavares',
      'Unidade Leandro Mota': 'leandro'
    };

    for (const [restaurantName, webhookSuffix] of Object.entries(webhooksConfig)) {
      const webhookUrl = `${webhookBaseUrl}/${webhookSuffix}`;

      // Buscar restaurante por nome
      const { data: restaurant, error: selectError } = await supabaseAdmin
        .from('restaurants')
        .select('id')
        .eq('name', restaurantName)
        .single();

      if (selectError) {
        console.log(`⏭️  ${restaurantName} não encontrado`);
        continue;
      }

      // Atualizar webhook URL
      const { error: updateError } = await supabaseAdmin
        .from('restaurants')
        .update({ google_calendar_id: webhookUrl })
        .eq('id', restaurant.id);

      if (updateError) {
        console.log(`❌ Erro ao configurar webhook para ${restaurantName}: ${updateError.message}`);
      } else {
        console.log(`✅ ${restaurantName}`);
        console.log(`   Webhook: ${webhookUrl}\n`);
      }
    }

    console.log('✨ Configuração de webhooks concluída!');
    console.log('\n📝 Nota: Configure o N8N_WEBHOOK_URL no .env com sua URL real:');
    console.log('   N8N_WEBHOOK_URL=https://seu-n8n-instance.com/webhook\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao configurar webhooks:', error.message);
    process.exit(1);
  }
}

configureWebhooks();

require('dotenv').config();
const { supabaseAdmin } = require('./config/supabase');

async function migrateAddresses() {
  try {
    console.log('🔁 Iniciando migração de addresses para objeto JSON...');

    const { data: restaurants, error: fetchError } = await supabaseAdmin
      .from('restaurants')
      .select('id, address');

    if (fetchError) throw fetchError;

    for (const r of restaurants) {
      let addr = r.address;
      let normalized = null;

      if (!addr) continue;

      if (typeof addr === 'object') {
        // já é objeto
        normalized = addr;
      } else if (typeof addr === 'string') {
        // tentar parsear JSON
        try {
          const parsed = JSON.parse(addr);
          if (parsed && typeof parsed === 'object') normalized = parsed;
          else normalized = { street: addr.replace(/^"|"$/g, '') };
        } catch (e) {
          normalized = { street: addr.replace(/^"|"$/g, '') };
        }
      }

      if (normalized) {
        const { error: updateError } = await supabaseAdmin
          .from('restaurants')
          .update({ address: normalized, updated_at: new Date().toISOString() })
          .eq('id', r.id);

        if (updateError) {
          console.error(`❌ Falha ao atualizar restaurante ${r.id}:`, updateError.message);
        } else {
          console.log(`✅ Restaurante ${r.id} atualizado`);
        }
      }
    }

    console.log('✨ Migração concluída');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante migração:', error.message || error);
    process.exit(1);
  }
}

migrateAddresses();


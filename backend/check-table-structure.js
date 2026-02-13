require('dotenv').config();
const { supabaseAdmin } = require('./config/supabase');

async function checkTableStructure() {
  try {
    console.log('🔍 Verificando estrutura da tabela reservations...\n');

    // Tentar inserir um registro de teste para ver qual é o erro exato
    const { error, data } = await supabaseAdmin
      .from('reservations')
      .insert([
        {
          restaurant_id: 'test',
          customer_name: 'Test',
          customer_email: 'test@test.com',
          customer_phone: '123',
          date: '2026-02-12',
          time: '19:00',
          number_of_people: 2
        }
      ])
      .select();

    if (error) {
      console.log('❌ Erro ao inserir:', error);
      console.log('\nTente criar a tabela com essas colunas:');
      console.log(`
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  number_of_people INTEGER NOT NULL,
  status TEXT DEFAULT 'confirmed',
  notes TEXT,
  google_event_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
      `);
    } else {
      console.log('✅ Estrutura OK!');
      console.log(data);
      // Deletar o registro de teste
      await supabaseAdmin
        .from('reservations')
        .delete()
        .eq('customer_name', 'Test');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

checkTableStructure();

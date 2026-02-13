require('dotenv').config();
const Restaurant = require('./models/Restaurant');

async function seedRestaurants() {
  try {
    console.log('🌱 Criando restaurantes no Supabase...\n');

    // ID do admin que criamos
    const adminOwnerId = '1a00e5e2-3fea-452d-9036-1ac3c299513e';

    const restaurants = [
      {
        name: 'Unidade Botafogo',
        owner_id: adminOwnerId,
        description: 'Estilo relaxante com variedade de bebidas e comidas',
        address: {
          street: 'Rua do Botafogo',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zipCode: '22250-040',
          country: 'Brasil'
        },
        phone: '(21) 2000-0001',
        email: 'botafogo@starbem.com.br',
        capacity: 50,
        reservation_duration: 120,
        google_calendar_id: process.env.N8N_WEBHOOK_URL || 'http://localhost:8080/webhook/reservations',
        opening_hours: {
          monday: { open: '10:00', close: '22:00', closed: false },
          tuesday: { open: '10:00', close: '22:00', closed: false },
          wednesday: { open: '10:00', close: '22:00', closed: false },
          thursday: { open: '10:00', close: '22:00', closed: false },
          friday: { open: '10:00', close: '23:00', closed: false },
          saturday: { open: '11:00', close: '23:00', closed: false },
          sunday: { open: '11:00', close: '21:00', closed: false }
        }
      },
      {
        name: 'Unidade Tavares',
        owner_id: adminOwnerId,
        description: 'Ambiente descontraído com excelente gastronomia',
        address: {
          street: 'Avenida Tavares',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zipCode: '20550-013',
          country: 'Brasil'
        },
        phone: '(21) 2000-0002',
        email: 'tavares@starbem.com.br',
        capacity: 60,
        reservation_duration: 120,
        google_calendar_id: process.env.N8N_WEBHOOK_URL || 'http://localhost:8080/webhook/reservations',
        opening_hours: {
          monday: { open: '10:00', close: '22:00', closed: false },
          tuesday: { open: '10:00', close: '22:00', closed: false },
          wednesday: { open: '10:00', close: '22:00', closed: false },
          thursday: { open: '10:00', close: '22:00', closed: false },
          friday: { open: '10:00', close: '23:00', closed: false },
          saturday: { open: '11:00', close: '23:00', closed: false },
          sunday: { open: '11:00', close: '21:00', closed: false }
        }
      },
      {
        name: 'Unidade Leandro Mota',
        owner_id: adminOwnerId,
        description: 'Espaço moderno com cardápio inovador',
        address: {
          street: 'Rua Leandro Mota',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zipCode: '20000-000',
          country: 'Brasil'
        },
        phone: '(21) 2000-0003',
        email: 'leandro@starbem.com.br',
        capacity: 45,
        reservation_duration: 90,
        google_calendar_id: process.env.N8N_WEBHOOK_URL || 'http://localhost:8080/webhook/reservations',
        opening_hours: {
          monday: { open: '10:00', close: '22:00', closed: false },
          tuesday: { open: '10:00', close: '22:00', closed: false },
          wednesday: { open: '10:00', close: '22:00', closed: false },
          thursday: { open: '10:00', close: '22:00', closed: false },
          friday: { open: '10:00', close: '23:00', closed: false },
          saturday: { open: '11:00', close: '23:00', closed: false },
          sunday: { open: '11:00', close: '21:00', closed: false }
        }
      }
    ];

    let createdCount = 0;
    for (const restaurantData of restaurants) {
      try {
        const restaurant = await Restaurant.create(restaurantData);
        console.log(`✅ ${restaurant.name} criado com sucesso!`);
        createdCount++;
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⏭️  ${restaurantData.name} já existe, pulando...`);
        } else {
          console.log(`❌ Erro ao criar ${restaurantData.name}: ${error.message}`);
        }
      }
    }

    console.log(`\n✨ Seed concluído! ${createdCount} restaurante(s) criado(s).`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error.message);
    process.exit(1);
  }
}

seedRestaurants();

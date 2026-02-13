// Dados fake em memória
let restaurants = [
  {
    _id: 'rest_001',
    name: 'Unidade Botafogo',
    owner: 'owner_001',
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
    reservationDuration: 120,
    webhookUrl: 'https://starbem-n8n-starbem.5qkgxi.easypanel.host/webhook/botafogo',
    active: true,
    openingHours: {
      monday: { open: '10:00', close: '22:00', closed: false },
      tuesday: { open: '10:00', close: '22:00', closed: false },
      wednesday: { open: '10:00', close: '22:00', closed: false },
      thursday: { open: '10:00', close: '22:00', closed: false },
      friday: { open: '10:00', close: '23:00', closed: false },
      saturday: { open: '11:00', close: '23:00', closed: false },
      sunday: { open: '11:00', close: '21:00', closed: false }
    },
    createdAt: new Date()
  },
  {
    _id: 'rest_002',
    name: 'Unidade Tavares',
    owner: 'owner_002',
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
    reservationDuration: 120,
    webhookUrl: 'https://starbem-n8n-starbem.5qkgxi.easypanel.host/webhook/tavares',
    active: true,
    openingHours: {
      monday: { open: '10:00', close: '22:00', closed: false },
      tuesday: { open: '10:00', close: '22:00', closed: false },
      wednesday: { open: '10:00', close: '22:00', closed: false },
      thursday: { open: '10:00', close: '22:00', closed: false },
      friday: { open: '10:00', close: '23:00', closed: false },
      saturday: { open: '11:00', close: '23:00', closed: false },
      sunday: { open: '11:00', close: '21:00', closed: false }
    },
    createdAt: new Date()
  },
  {
    _id: 'rest_003',
    name: 'Unidade Leandro Mota',
    owner: 'owner_003',
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
    reservationDuration: 90,
    webhookUrl: 'https://starbem-n8n-starbem.5qkgxi.easypanel.host/webhook/leandro',
    active: true,
    openingHours: {
      monday: { open: '10:00', close: '22:00', closed: false },
      tuesday: { open: '10:00', close: '22:00', closed: false },
      wednesday: { open: '10:00', close: '22:00', closed: false },
      thursday: { open: '10:00', close: '22:00', closed: false },
      friday: { open: '10:00', close: '23:00', closed: false },
      saturday: { open: '11:00', close: '23:00', closed: false },
      sunday: { open: '11:00', close: '21:00', closed: false }
    },
    createdAt: new Date()
  }
];

let reservations = [
  {
    _id: 'res_001',
    restaurant: 'rest_001',
    customer: {
      name: 'João Silva',
      email: 'joao@example.com',
      phone: '(11) 91234-5678'
    },
    date: new Date('2026-02-12'),
    time: '19:00',
    numberOfPeople: 4,
    status: 'confirmed',
    notes: 'Aniversário - pedir bolo',
    googleEventId: 'event_001',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'res_002',
    restaurant: 'rest_002',
    customer: {
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '(11) 91234-5679'
    },
    date: new Date('2026-02-13'),
    time: '20:30',
    numberOfPeople: 6,
    status: 'confirmed',
    notes: 'Primeira vez no restaurante',
    googleEventId: 'event_002',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  restaurants,
  reservations
};

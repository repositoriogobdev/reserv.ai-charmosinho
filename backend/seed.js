require('dotenv').config();
const User = require('./models/User');

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar usuário admin de teste
    const adminEmail = 'admin@charmosinho.com.br';
    const adminPassword = 'admin123';

    // Verificar se usuário já existe
    const existingUser = await User.findByEmail(adminEmail);
    
    if (existingUser) {
      console.log(`✅ Usuário admin já existe: ${adminEmail}`);
      return;
    }

    // Criar novo usuário admin
    const newAdmin = await User.create({
      name: 'Admin Charmosinho',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      phone: '(11) 99999-9999'
    });

    console.log(`✅ Usuário admin criado com sucesso!`);
    console.log(`📧 Email: ${newAdmin.email}`);
    console.log(`🔐 Senha: ${adminPassword}`);
    console.log(`👤 Role: ${newAdmin.role}`);
    console.log('\n✨ Seed concluído!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error.message);
    process.exit(1);
  }
}

seedDatabase();

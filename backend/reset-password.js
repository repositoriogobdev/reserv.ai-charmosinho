require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function updatePassword() {
  try {
    console.log('🔄 Atualizando senha do admin...');

    const adminEmail = 'admin@charmosinho.com.br';
    const newPassword = 'admin123';

    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Atualizar senha no banco
    const { supabaseAdmin } = require('./config/supabase');
    const { error } = await supabaseAdmin
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', adminEmail);

    if (error) {
      console.error('❌ Erro ao atualizar:', error);
      process.exit(1);
    }

    console.log(`✅ Senha atualizada com sucesso!`);
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔐 Senha: ${newPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

updatePassword();

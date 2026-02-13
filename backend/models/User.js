const { supabaseAdmin, supabaseClient } = require('../config/supabase');
const bcrypt = require('bcryptjs');

class User {
  // Criar novo usuário
  static async create(userData) {
    try {
      const { name, email, password, role = 'customer', phone = '' } = userData;

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Inserir no Supabase
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([
          {
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role,
            phone: phone.trim(),
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  // Encontrar por email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error && error.code === 'PGRST116') return null; // Não encontrado
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  // Encontrar por ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por ID: ${error.message}`);
    }
  }

  // Comparar senha
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  // Atualizar usuário
  static async update(id, updateData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  // Deletar usuário
  static async delete(id) {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }
}

module.exports = User;

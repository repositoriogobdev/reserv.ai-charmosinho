import { supabase } from '../config/supabase';

const uploadService = {
  async uploadRestaurantPhoto(restaurantId, file) {
    try {
      if (!file) throw new Error('Nenhum arquivo selecionado');

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem');
      }

      // Limitar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo não pode ter mais de 5MB');
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const ext = file.name.split('.').pop();
      const fileName = `${restaurantId}-${timestamp}.${ext}`;

      // Upload para o storage
      const { error } = await supabase.storage
        .from('fotos-capa-unidades')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from('fotos-capa-unidades')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      throw new Error(`Erro ao fazer upload: ${error.message}`);
    }
  },

  async deleteRestaurantPhoto(fileName) {
    try {
      if (!fileName) return;

      // Extrair nome do arquivo da URL
      const fileNameOnly = fileName.split('/').pop();
      
      const { error } = await supabase.storage
        .from('fotos-capa-unidades')
        .remove([fileNameOnly]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
      return false;
    }
  }
};

export default uploadService;

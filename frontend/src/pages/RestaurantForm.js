import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import restaurantService from '../services/restaurantService';
import uploadService from '../services/uploadService';
import './backoffice.css';

const RestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Brasil'
    },
    phone: '',
    email: '',
    capacity: 50,
    reservationDuration: 120,
    googleCalendarId: '',
    urlFotos: '',
    openingHours: {
      monday: { open: '12:00', close: '22:00', closed: false },
      tuesday: { open: '12:00', close: '22:00', closed: false },
      wednesday: { open: '12:00', close: '22:00', closed: false },
      thursday: { open: '12:00', close: '22:00', closed: false },
      friday: { open: '12:00', close: '22:00', closed: false },
      saturday: { open: '12:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '20:00', closed: false }
    }
  });

  useEffect(() => {
    // Proteger contra id indefinido/strings 'undefined' que podem vir da rota
    if (id && id !== 'undefined') {
      loadRestaurant();
    } else if (id === 'undefined') {
      setError('ID inválido fornecido na URL');
    }
  }, [id]);

  const loadRestaurant = async () => {
    try {
      if (!id || id === 'undefined') {
        throw new Error('ID inválido');
      }

      const data = await restaurantService.getById(id);
      if (!data) throw new Error('Restaurante não encontrado');

      // Normalizar address que pode vir como objeto, string ou JSON-string
      let normalizedAddress = { street: '', city: '', state: '', zipCode: '', country: 'Brasil' };
      const rawAddress = data.address;
      if (rawAddress) {
        if (typeof rawAddress === 'string') {
          // tentar parsear JSON stringificado
          try {
            const parsed = JSON.parse(rawAddress);
            if (parsed && typeof parsed === 'object') normalizedAddress = { ...normalizedAddress, ...parsed };
            else normalizedAddress.street = rawAddress.replace(/^"|"$/g, '');
          } catch (e) {
            // não é JSON — armazenar a string inteira em street
            normalizedAddress.street = rawAddress.replace(/^"|"$/g, '');
          }
        } else if (typeof rawAddress === 'object') {
          normalizedAddress = { ...normalizedAddress, ...rawAddress };
        }
      }

      // Garantir shape esperado do form
      setFormData({
        name: data.name || '',
        description: data.description || '',
        address: normalizedAddress,
        phone: data.phone || '',
        email: data.email || '',
        capacity: data.capacity || 50,
        reservationDuration: data.reservation_duration || data.reservationDuration || 120,
        googleCalendarId: data.google_calendar_id || data.googleCalendarId || '',
        urlFotos: data['url-foto'] || data.url_fotos || data.urlFotos || '',
        openingHours: data.opening_hours || data.openingHours || formData.openingHours
      });

      // Carregar preview da foto se existir
      if (data['url-foto'] || data.url_fotos || data.urlFotos) {
        setPhotoPreview(data['url-foto'] || data.url_fotos || data.urlFotos);
      }
    } catch (error) {
      console.error('Erro ao carregar restaurante:', error.message);
      setError('Erro ao carregar restaurante');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setFormData({
      ...formData,
      openingHours: {
        ...formData.openingHours,
        [day]: {
          ...formData.openingHours[day],
          [field]: field === 'closed' ? value === 'true' : value
        }
      }
    });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Mostrar preview localmente
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload para Supabase
      setUploading(true);
      const restaurantId = id || 'novo';
      const photoUrl = await uploadService.uploadRestaurantPhoto(restaurantId, file);

      // Atualizar estado com a URL
      setFormData({
        ...formData,
        urlFotos: photoUrl
      });
    } catch (err) {
      setError(`Erro ao fazer upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Normalizar o payload para o formato esperado pelo backend
      const payload = {
        name: formData.name,
        description: formData.description,
        // Enviar o objeto address diretamente — o backend normaliza para o formato padrão
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        capacity: formData.capacity,
        reservation_duration: formData.reservationDuration,
        google_calendar_id: formData.googleCalendarId,
        url_fotos: formData.urlFotos,
        opening_hours: formData.openingHours
      };

      if (id) {
        await restaurantService.update(id, payload);
      } else {
        await restaurantService.create(payload);
      }

      // Forçar reload da listagem para garantir que as alterações apareçam
      window.location.href = '/restaurants';
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar restaurante');
    } finally {
      setLoading(false);
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="form-card">
          <div className="form-header">
            <h2>{id ? 'Editar Restaurante' : 'Novo Restaurante'}</h2>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Informações Básicas */}
            <div className="form-section">
              <h3 className="form-section-title">Informações Básicas</h3>

              <div className="form-group">
                <label>Nome do Restaurante *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Digite o nome do restaurante"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva o restaurante, tipo de culinária, ambiente..."
                />
              </div>

              <div className="form-group">
                <label>Foto de Capa</label>
                <div className="photo-upload-container">
                  <input
                    type="file"
                    id="photoInput"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('photoInput').click()}
                    className="btn btn-secondary"
                    disabled={uploading}
                  >
                    {uploading ? 'Enviando...' : 'Selecionar Foto'}
                  </button>
                  {photoPreview && (
                    <div className="photo-preview">
                      <img src={photoPreview} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group-row grid-2">
                <div className="form-group">
                  <label>Telefone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(11) 3000-0000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contato@restaurante.com.br"
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="form-section">
              <h3 className="form-section-title">Endereço</h3>

              <div className="form-group">
                <label>Rua *</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Avenida Paulista, 1000"
                  required
                />
              </div>

              <div className="form-group-row grid-2">
                <div className="form-group">
                  <label>Cidade *</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="São Paulo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Estado *</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="SP"
                    required
                  />
                </div>
              </div>

              <div className="form-group-row grid-2">
                <div className="form-group">
                  <label>CEP</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    placeholder="01310-100"
                  />
                </div>

                <div className="form-group">
                  <label>País</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    placeholder="Brasil"
                  />
                </div>
              </div>
            </div>

            {/* Configurações */}
            <div className="form-section">
              <h3 className="form-section-title">Configurações</h3>

              <div className="form-group-row grid-2">
                <div className="form-group">
                  <label>Capacidade (pessoas) *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    placeholder="50"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Duração da Reserva (minutos) *</label>
                  <input
                    type="number"
                    name="reservationDuration"
                    value={formData.reservationDuration}
                    onChange={handleChange}
                    min="30"
                    step="30"
                    placeholder="120"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Webhook N8N (Google Calendar ID)</label>
                <input
                  type="text"
                  name="googleCalendarId"
                  value={formData.googleCalendarId}
                  onChange={handleChange}
                  placeholder="https://starbem-n8n.../webhook/botafogo"
                />
                <small>URL do webhook para sincronização com n8n</small>
              </div>
            </div>

            {/* Horário de Funcionamento */}
            <div className="form-section">
              <h3 className="form-section-title">Horário de Funcionamento</h3>

              <div className="opening-hours-grid">
                {days.map((day) => (
                  <div key={day} className="opening-hours-row">
                    <span className="day-name">{dayNames[day]}</span>
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        id={`closed-${day}`}
                        checked={formData.openingHours[day].closed}
                        onChange={(e) => handleOpeningHoursChange(day, 'closed', e.target.checked.toString())}
                      />
                      <label htmlFor={`closed-${day}`} style={{ margin: 0, cursor: 'pointer' }}>
                        Fechado
                      </label>
                    </div>
                    {!formData.openingHours[day].closed && (
                      <>
                        <input
                          type="time"
                          value={formData.openingHours[day].open}
                          onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)}
                        />
                        <span className="separator">até</span>
                        <input
                          type="time"
                          value={formData.openingHours[day].close}
                          onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-submit"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Restaurante'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/restaurants')}
                className="btn btn-cancel"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantForm;

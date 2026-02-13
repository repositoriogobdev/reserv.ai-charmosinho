import React, { useState, useEffect } from 'react';
import restaurantService from '../services/restaurantService';
import reservationService from '../services/reservationService';
import './home-booking.css';

const Home = () => {
  // ====== ESTADOS PRINCIPAIS ======
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ====== FLUXO DE RESERVA ======
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    numberOfPeople: 2,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ====== DATAS DISPONÍVEIS ======
  const getNextDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const nextDates = getNextDates();

  // ====== HORÁRIOS DISPONÍVEIS ======
  const availableTimes = [
    '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  // ====== CARREGAR RESTAURANTES ======
  useEffect(() => {
    loadUnits();
  }, []);

  // ====== VERIFICAR DISPONIBILIDADE QUANDO DATA/HORA MUDAM ======
  useEffect(() => {
    if (formData.date && formData.time && selectedUnit) {
      checkAvailability(formData.date, formData.time);
    }
  }, [formData.date, formData.time, selectedUnit]);

  const loadUnits = async () => {
    try {
      const data = await restaurantService.getAll();
      console.log('✅ Restaurantes carregados:', data);
      setUnits(data);
    } catch (error) {
      console.error('Erro ao carregar unidades:', error);
      setErrorMessage('Erro ao carregar unidades. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ====== VERIFICAR DISPONIBILIDADE ======
  const checkAvailability = async (date, time) => {
    if (!date || !time || !selectedUnit) return;

    console.log('🔄 Iniciando verificação de disponibilidade...');
    setCheckingAvailability(true);
    try {
      const result = await reservationService.checkSlotAvailability(
        selectedUnit.id,
        date,
        time,
        formData.numberOfPeople
      );
      console.log('✅ Resultado de disponibilidade:', result);
      setAvailability(result);
    } catch (error) {
      console.error('❌ Erro ao verificar disponibilidade:', error);
      setAvailability({
        available: false,
        message: 'Erro ao verificar disponibilidade'
      });
    } finally {
      console.log('✅ Finalizando verificação');
      setCheckingAvailability(false);
    }
  };

  // ====== ATUALIZAR FORM ======
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ====== VALIDAÇÃO ======
  const validateForm = () => {
    const newErrors = {};

    if (!selectedUnit) {
      newErrors.unit = 'Selecione um restaurante';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.time) {
      newErrors.time = 'Horário é obrigatório';
    }

    if (!formData.numberOfPeople || formData.numberOfPeople < 1) {
      newErrors.numberOfPeople = 'Mínimo 1 pessoa';
    }

    if (availability && !availability.available) {
      newErrors.availability = 'Horário indisponível. Selecione outro.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ====== SUBMETER RESERVA ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      console.log('📤 Enviando reserva:', {
        restaurant_id: selectedUnit.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        date: formData.date,
        time: formData.time,
        number_of_people: formData.numberOfPeople,
        notes: formData.notes
      });
      
      await reservationService.create({
        restaurant_id: selectedUnit.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        date: formData.date,
        time: formData.time,
        number_of_people: formData.numberOfPeople,
        notes: formData.notes
      });

      setSuccessMessage(`Reserva confirmada na ${selectedUnit.name}! Você receberá um e-mail de confirmação`);
      setSelectedUnit(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        numberOfPeople: 2,
        notes: ''
      });
      setAvailability(null);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Erro ao confirmar reserva. Tente novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ====== RESET ======
  const handleReset = () => {
    setSuccessMessage('');
    window.location.reload();
  };

  // ====== CONVERTER DATA PARA FORMATO LEGÍVEL ======
  const formatDate = (date) => {
    const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
    return {
      day: days[date.getDay()],
      date: String(date.getDate()).padStart(2, '0')
    };
  };

  // ====== TELA DE CARREGAMENTO ======
  if (loading) {
    return (
      <div className="booking-loading">
        <div style={{ fontSize: '32px' }}>⏳</div>
        <div>Carregando restaurantes...</div>
      </div>
    );
  }

  // ====== TELA DE SUCESSO ======
  if (successMessage) {
    return (
      <div className="booking-success">
        <h1>✓ Sucesso!</h1>
        <p>{successMessage}</p>
        <button className="btn" onClick={handleReset}>
          Fazer Outra Reserva
        </button>
      </div>
    );
  }

  // ====== TELA PRINCIPAL ======
  return (
    <div className="booking-page">
      <div className="booking-card">
        {/* HEADER */}
        <div className="booking-header">
          <h2>Agendamento de Reserva</h2>
        </div>

        {/* ERRO GLOBAL */}
        {errorMessage && (
          <div className="error-alert">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: ESCOLHA A UNIDADE */}
        <div className="step">
          <h4>1. Escolha a Unidade</h4>
          <div className="units">
            {units.map(unit => {
              const unitId = unit.id || unit._id;
              const coverImage = unit?.['url-foto'] || unit?.['url-fotos'] || unit?.url_fotos || unit?.urlFotos || '';
              const isActive = selectedUnit && (selectedUnit.id || selectedUnit._id) === unitId;

              return (
                <div
                  key={unitId}
                  className={`unit ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedUnit(unit);
                    setErrors({});
                    setAvailability(null);
                  }}
                >
                  <div className="thumb">
                    {coverImage ? (
                      <img src={coverImage} alt={unit.name} />
                    ) : null}
                    <div className="check">✓</div>
                  </div>
                  <div className="unit-info">
                    <p className="unit-name">{unit.name}</p>
                    <p className="unit-address">
                      {unit.address?.street ? `${unit.address.street}, ${unit.address.city}` : unit.address?.city || 'Endereço não disponível'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.unit && <div style={{ color: '#d32f2f', fontSize: '12px', marginTop: '8px' }}>{errors.unit}</div>}
        </div>

        {selectedUnit && (
          <form onSubmit={handleSubmit}>
            {/* STEP 2: QUANTAS PESSOAS */}
            <div className="step">
              <h4>2. Quantas Pessoas?</h4>
              <div className="counter">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    numberOfPeople: Math.max(1, prev.numberOfPeople - 1)
                  }))}
                >
                  −
                </button>
                <div className="count">
                  <span className="count-value">{formData.numberOfPeople}</span>
                  <span className="count-label">LUGARES</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    numberOfPeople: prev.numberOfPeople + 1
                  }))}
                >
                  +
                </button>
              </div>
            </div>

            {/* STEP 3: QUANDO? */}
            <div className="step">
              <h4>3. Quando?</h4>
              <div className="date-scroll">
                {nextDates.map((date, idx) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const formatted = formatDate(date);
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`date-pill ${formData.date === dateStr ? 'selected' : ''}`}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, date: dateStr }));
                        setErrors(prev => ({ ...prev, date: '' }));
                      }}
                    >
                      <span className="date-pill-day">{formatted.day}</span>
                      <span className="date-pill-date">{formatted.date}</span>
                    </button>
                  );
                })}
              </div>
              {errors.date && <div style={{ color: '#d32f2f', fontSize: '12px', marginTop: '8px' }}>{errors.date}</div>}
            </div>

            {/* STEP 4: HORÁRIO DISPONÍVEL */}
            <div className="step">
              <h4>4. Horário Disponível</h4>
              <div className="times-grid">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    type="button"
                    className={`time ${formData.time === time ? 'selected' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, time }));
                      setErrors(prev => ({ ...prev, time: '' }));
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {errors.time && <div style={{ color: '#d32f2f', fontSize: '12px', marginTop: '8px' }}>{errors.time}</div>}

              {/* AVAILABILITY STATUS */}
              {formData.date && formData.time && (
                <div className={`availability-box ${availability?.available ? 'available' : 'unavailable'}`}>
                  <span className="availability-icon">
                    {checkingAvailability ? '⏳' : availability?.available ? '✓' : '✕'}
                  </span>
                  <span>
                    {checkingAvailability 
                      ? 'Verificando disponibilidade...' 
                      : availability?.message 
                      ? availability.message 
                      : 'Carregando disponibilidade...'}
                  </span>
                </div>
              )}
            </div>

            {/* DADOS CLIENTE */}
            <div className="step">
              <h4>5. Seus Dados</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome Completo"
                    value={formData.name}
                    onChange={handleFormChange}
                    style={{
                      padding: '10px 12px',
                      border: errors.name ? '2px solid #d32f2f' : '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      width: '100%',
                      transition: 'all 120ms ease',
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                  {errors.name && <div style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>{errors.name}</div>}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleFormChange}
                    style={{
                      padding: '10px 12px',
                      border: errors.email ? '2px solid #d32f2f' : '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      width: '100%',
                      transition: 'all 120ms ease',
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                  {errors.email && <div style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>{errors.email}</div>}
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    style={{
                      padding: '10px 12px',
                      border: errors.phone ? '2px solid #d32f2f' : '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      width: '100%',
                      transition: 'all 120ms ease',
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                  {errors.phone && <div style={{ color: '#d32f2f', fontSize: '12px', marginTop: '6px' }}>{errors.phone}</div>}
                </div>

                <div>
                  <textarea
                    name="notes"
                    placeholder="Observações (opcional)"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows="2"
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      minHeight: '60px',
                      width: '100%',
                      transition: 'all 120ms ease',
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                </div>
              </div>
            </div>

            {/* TOTAL */}
            <div className="total-section">
              <p className="total-label">Total p/ Reserva</p>
              <p className="total-value">
                {selectedUnit.name ? `${selectedUnit.name} - ${formData.numberOfPeople} ${formData.numberOfPeople === 1 ? 'pessoa' : 'pessoas'}` : '—'}
              </p>
            </div>

            {/* FOOTER */}
            <div className="booking-footer">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => {
                  setSelectedUnit(null);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '',
                    numberOfPeople: 2,
                    notes: ''
                  });
                  setErrors({});
                  setAvailability(null);
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-confirm"
                disabled={submitting || checkingAvailability || (availability && !availability.available)}
              >
                {submitting ? 'Confirmando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Home;

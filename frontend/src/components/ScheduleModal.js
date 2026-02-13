import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  CircularProgress,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import reservationService from '../services/reservationService';

const ScheduleModal = ({ unit, onClose, onConfirm }) => {
  const theme = useTheme();
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

  const checkAvailability = async () => {
    setCheckingAvailability(true);
    try {
      const result = await reservationService.checkSlotAvailability(
        unit.id,
        formData.date,
        formData.time,
        formData.numberOfPeople
      );
      setAvailability(result);
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      setAvailability({
        available: false,
        message: 'Erro ao verificar disponibilidade'
      });
    } finally {
      setCheckingAvailability(false);
    }
  };

  useEffect(() => {
    if (formData.date && formData.time) {
      checkAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.date, formData.time]);

  const handleChange = (e) => {
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

  const validateForm = () => {
    const newErrors = {};

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
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Selecione uma data futura';
      }
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onConfirm({
      ...formData,
      numberOfPeople: parseInt(formData.numberOfPeople)
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
      sx: {
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }
    }}>
      <DialogTitle sx={{ paddingBottom: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Agendar Reserva
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ padding: 1 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ paddingTop: 2, paddingBottom: 0 }}>
        <Paper sx={{
          padding: 2,
          marginBottom: 3,
          backgroundColor: '#f8fbff',
          borderRadius: 1,
          border: '1px solid #e0e7ff'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 0.5 }}>
            {unit.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {unit.address?.street}, {unit.address?.city}
          </Typography>
        </Paper>

        <Stack spacing={2.5} sx={{ paddingBottom: 2 }}>
          <TextField
            fullWidth
            label="Nome Completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome"
            error={!!errors.name}
            helperText={errors.name}
            size="small"
            variant="outlined"
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              error={!!errors.email}
              helperText={errors.email}
              size="small"
              variant="outlined"
            />

            <TextField
              fullWidth
              type="tel"
              label="Telefone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              error={!!errors.phone}
              helperText={errors.phone}
              size="small"
              variant="outlined"
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              type="date"
              label="Data"
              name="date"
              value={formData.date}
              onChange={handleChange}
              inputProps={{ min: today }}
              error={!!errors.date}
              helperText={errors.date}
              size="small"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              type="time"
              label="Horário"
              name="time"
              value={formData.time}
              onChange={handleChange}
              error={!!errors.time}
              helperText={errors.time}
              size="small"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          {formData.date && formData.time && (
            <Box sx={{
              padding: 1.5,
              borderRadius: 1,
              backgroundColor: availability?.available ? '#e8f5ff' : '#fff3e0',
              border: `2px solid ${availability?.available ? '#0066cc' : '#ff9800'}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              {checkingAvailability ? (
                <>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Verificando disponibilidade...
                  </Typography>
                </>
              ) : availability ? (
                <>
                  {availability.available ? (
                    <>
                      <CheckCircleIcon sx={{ color: '#0066cc', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#003d75' }}>
                        {availability.message || 'Data e hora disponíveis'}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CancelIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#e65100' }}>
                        {availability.message || 'Horário indisponível'}
                      </Typography>
                    </>
                  )}
                </>
              ) : null}
            </Box>
          )}

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, marginBottom: 1 }}>
              Número de Pessoas
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="outlined"
                size="small"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  numberOfPeople: Math.max(1, prev.numberOfPeople - 1)
                }))}
                sx={{ minWidth: 40 }}
              >
                <RemoveIcon fontSize="small" />
              </Button>
              <TextField
                type="number"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                error={!!errors.numberOfPeople}
                helperText={errors.numberOfPeople}
                size="small"
                variant="outlined"
                sx={{ width: 70, textAlign: 'center' }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  numberOfPeople: prev.numberOfPeople + 1
                }))}
                sx={{ minWidth: 40 }}
              >
                <AddIcon fontSize="small" />
              </Button>
            </Stack>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observações (opcional)"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Alguma preferência especial?"
            variant="outlined"
            size="small"
          />

          {errors.availability && (
            <Alert severity="error">
              {errors.availability}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ paddingTop: 1, paddingBottom: 2, paddingRight: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: 'text.primary',
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'text.primary',
              backgroundColor: 'action.hover'
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={checkingAvailability || (availability && !availability.available)}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            fontWeight: 600,
            '&:disabled': {
              background: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)'
            }
          }}
        >
          {checkingAvailability ? 'Verificando...' : 'Confirmar Reserva'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleModal;

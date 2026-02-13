import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const UnitSelector = ({ units, onSelectUnit }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', marginBottom: 8, color: 'white' }}>
          <Typography variant="h2" sx={{ fontWeight: 700, marginBottom: 2 }}>
            Selecione sua Unidade Preferida
          </Typography>
          <Typography variant="h5" sx={{ opacity: 1, fontWeight: 400, fontSize: '1.3rem' }}>
            Escolha o local mais conveniente para você
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          {units.map((unit) => (
            <Grid item xs={12} sm={6} md={3.5} lg={3} key={unit._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 102, 204, 0.25)'
                  }
                }}
                onClick={() => onSelectUnit(unit)}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', padding: '32px 20px 20px' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, marginBottom: 2, color: '#0066cc' }}>
                    {unit.name}
                  </Typography>
                  <Stack spacing={1.5} sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" sx={{ color: '#555', fontSize: '0.95rem' }}>
                      <strong>Endereço:</strong> {unit.address?.street}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#777', fontSize: '0.95rem' }}>
                      {unit.address?.city}, {unit.address?.state}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.primary.main, fontWeight: 600, fontSize: '1rem', marginTop: 1 }}
                    >
                      {unit.phone}
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', paddingBottom: '20px' }}>
                  <Button
                    variant="contained"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      letterSpacing: '0.5px',
                      padding: '12px 28px'
                    }}
                  >
                    Selecionar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default UnitSelector;

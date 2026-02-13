# Integração n8n com Google Calendar

Este documento descreve como configurar a integração do Reserv.ai com n8n e Google Calendar.

## Visão Geral

O sistema usa webhooks para se comunicar com o n8n, que por sua vez se integra com o Google Calendar para gerenciar disponibilidade e criar/atualizar eventos de reserva.

## Fluxo de Integração

### 1. Verificar Disponibilidade
**Endpoint n8n**: `POST /webhook/check-availability`

**Request Body**:
```json
{
  "calendarId": "seu-calendar@group.calendar.google.com",
  "date": "2026-02-15",
  "openingHours": {
    "monday": { "open": "12:00", "close": "22:00", "closed": false }
  },
  "reservationDuration": 120
}
```

**Response Esperado**:
```json
{
  "availableSlots": ["12:00", "12:30", "13:00", "13:30", ...]
}
```

### 2. Criar Evento de Reserva
**Endpoint n8n**: `POST /webhook/create-event`

**Request Body**:
```json
{
  "calendarId": "seu-calendar@group.calendar.google.com",
  "summary": "Reserva: João Silva",
  "description": "Reserva para 4 pessoa(s)\nTelefone: (11) 99999-9999\nEmail: joao@email.com\nObservações: Aniversário",
  "start": {
    "date": "2026-02-15",
    "time": "19:00"
  },
  "duration": 120
}
```

**Response Esperado**:
```json
{
  "eventId": "abc123xyz",
  "status": "confirmed"
}
```

### 3. Cancelar Evento
**Endpoint n8n**: `POST /webhook/cancel-event`

**Request Body**:
```json
{
  "calendarId": "seu-calendar@group.calendar.google.com",
  "eventId": "abc123xyz"
}
```

### 4. Webhook de Atualização (n8n → Reserv.ai)
**Endpoint Backend**: `POST /api/webhook/calendar-update`

**Request Body**:
```json
{
  "eventId": "abc123xyz",
  "status": "confirmed",
  "calendarId": "seu-calendar@group.calendar.google.com"
}
```

## Configuração do n8n

### Workflow 1: Verificar Disponibilidade

1. **Webhook Node**
   - Método: POST
   - Path: /webhook/check-availability
   
2. **Function Node** - Processar Dados
   ```javascript
   const { date, openingHours, reservationDuration } = $json;
   const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
   return { date, hours: openingHours[dayOfWeek] };
   ```

3. **Google Calendar Node** - Listar Eventos
   - Operation: Get All
   - Calendar: {{ $json.calendarId }}
   - Start Time: {{ $json.date }}T00:00:00Z
   - End Time: {{ $json.date }}T23:59:59Z

4. **Function Node** - Calcular Slots Disponíveis
   ```javascript
   const events = $items[0].json;
   const openHours = $items[1].json.hours;
   
   // Lógica para calcular slots disponíveis
   const availableSlots = [];
   // ... implementar cálculo de slots
   
   return { availableSlots };
   ```

5. **Respond to Webhook**
   - Response Body: {{ $json }}

### Workflow 2: Criar Evento

1. **Webhook Node**
   - Método: POST
   - Path: /webhook/create-event

2. **Google Calendar Node** - Criar Evento
   - Operation: Create
   - Calendar: {{ $json.calendarId }}
   - Event Name: {{ $json.summary }}
   - Description: {{ $json.description }}
   - Start: {{ $json.start.date }}T{{ $json.start.time }}:00
   - Duration: {{ $json.duration }} minutes

3. **Respond to Webhook**
   ```json
   {
     "eventId": "{{ $json.id }}",
     "status": "confirmed"
   }
   ```

### Workflow 3: Cancelar Evento

1. **Webhook Node**
   - Método: POST
   - Path: /webhook/cancel-event

2. **Google Calendar Node** - Deletar Evento
   - Operation: Delete
   - Calendar: {{ $json.calendarId }}
   - Event ID: {{ $json.eventId }}

3. **Respond to Webhook**

### Workflow 4: Sincronização (Opcional)

1. **Cron Node** - Executar a cada 15 minutos

2. **HTTP Request Node** - Obter Restaurantes
   - URL: http://seu-backend/api/restaurants
   
3. **Google Calendar Node** - Listar Eventos
   - Para cada restaurante

4. **HTTP Request Node** - Atualizar Backend
   - URL: http://seu-backend/api/webhook/sync-availability
   - Body: Eventos sincronizados

## Configuração do Google Calendar

### 1. Criar Calendário

1. Acesse Google Calendar
2. Crie um novo calendário para cada restaurante
3. Anote o Calendar ID (geralmente: nome@group.calendar.google.com)

### 2. Configurar Credenciais no n8n

1. No n8n, vá em Credentials
2. Adicione Google OAuth2 API
3. Configure:
   - Client ID
   - Client Secret
   - Scopes: https://www.googleapis.com/auth/calendar

### 3. Testar Integração

```bash
# Teste verificar disponibilidade
curl -X POST http://seu-n8n.com/webhook/check-availability \
  -H "Content-Type: application/json" \
  -d '{
    "calendarId": "seu-calendar@group.calendar.google.com",
    "date": "2026-02-15",
    "openingHours": {"monday": {"open": "12:00", "close": "22:00"}},
    "reservationDuration": 120
  }'

# Teste criar evento
curl -X POST http://seu-n8n.com/webhook/create-event \
  -H "Content-Type: application/json" \
  -d '{
    "calendarId": "seu-calendar@group.calendar.google.com",
    "summary": "Teste Reserva",
    "description": "Teste",
    "start": {"date": "2026-02-15", "time": "19:00"},
    "duration": 120
  }'
```

## Variáveis de Ambiente

### Backend (.env)
```
N8N_WEBHOOK_URL=https://seu-n8n-instance.com/webhook
```

### n8n
Configure as seguintes variáveis de ambiente:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `BACKEND_URL=http://seu-backend:5000`

## Troubleshooting

### Erro ao conectar com n8n
- Verifique se a URL do webhook está correta no .env
- Certifique-se que o n8n está rodando e acessível

### Eventos não aparecem no Calendar
- Verifique as credenciais do Google OAuth2
- Confirme que o Calendar ID está correto
- Verifique os scopes da API

### Slots não são calculados corretamente
- Verifique o fuso horário configurado
- Confirme o formato de data/hora enviado
- Revise a lógica de cálculo no Function Node

## Próximos Passos

1. Implementar notificações por email/SMS
2. Adicionar confirmação de reserva por WhatsApp
3. Implementar lista de espera para horários lotados
4. Sincronização bidirecional com Google Calendar

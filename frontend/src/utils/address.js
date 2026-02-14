// Helpers para normalizar/formatar endereço para exibição
export function stripQuotes(s) {
  if (s === null || s === undefined) return '';
  try {
    return String(s).replace(/^"+|"+$/g, '').trim();
  } catch (e) {
    return String(s);
  }
}

export function addressToString(address) {
  if (!address) return '';
  // se for string, limpar aspas
  if (typeof address === 'string') {
    return stripQuotes(address);
  }
  // se for objeto, montar string com street, city, state
  if (typeof address === 'object') {
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    return parts.join(', ').trim();
  }
  return String(address);
}


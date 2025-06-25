export function formatDateTime(dt) {
    const d = new Date(dt);
    return d.toLocaleDateString('pt-BR') 
         + ' ' 
         + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  
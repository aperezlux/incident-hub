export const CATEGORIAS = ['HARDWARE', 'SOFTWARE', 'RED', 'ACCESOS', 'OTROS'];
export const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
export const ESTADOS = ['NUEVO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];

const SIGUIENTE = { ASIGNADO: ['EN_PROCESO'], EN_PROCESO: ['RESUELTO'], RESUELTO: ['CERRADO', 'EN_PROCESO'] };

// Estados a los que puede pasar un incidente desde la interfaz (la asignación se hace aparte)
export function estadosSiguientes(estado) {
  return SIGUIENTE[estado] || [];
}

export const porcentaje = (valor, maximo) => (maximo ? Math.round((valor * 100) / maximo) : 0);

const { validarIncidente, transicionValida, TRANSICIONES } = require('../src/dominio');
const { valido } = require('./ayudas');

describe('dominio', () => {
  test('incidente válido no produce errores', () => {
    expect(validarIncidente(valido)).toEqual([]);
  });
  test('detecta campos inválidos', () => {
    const e = validarIncidente({ titulo: 'x', categoria: 'Z', prioridad: 'Q' });
    expect(e.length).toBe(5);
  });
  test('flujo de estados permitido', () => {
    expect(transicionValida('NUEVO', 'ASIGNADO')).toBe(true);
    expect(transicionValida('ASIGNADO', 'EN_PROCESO')).toBe(true);
    expect(transicionValida('NUEVO', 'CERRADO')).toBe(false);
  });
  test('CERRADO es un estado terminal', () => {
    expect(TRANSICIONES.CERRADO).toEqual([]);
    expect(transicionValida('CERRADO', 'EN_PROCESO')).toBe(false);
  });
});

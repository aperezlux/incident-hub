import { describe, expect, test } from 'vitest';
import { estadosSiguientes } from './constantes.js';

describe('estadosSiguientes', () => {
  test('refleja el flujo de estados', () => {
    expect(estadosSiguientes('ASIGNADO')).toEqual(['EN_PROCESO']);
    expect(estadosSiguientes('RESUELTO')).toEqual(['CERRADO', 'EN_PROCESO']);
  });
  test('NUEVO y CERRADO no tienen cambios directos', () => {
    expect(estadosSiguientes('NUEVO')).toEqual([]);
    expect(estadosSiguientes('CERRADO')).toEqual([]);
  });
});

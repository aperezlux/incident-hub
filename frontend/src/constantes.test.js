import { describe, expect, test } from 'vitest';
import { estadosSiguientes, porcentaje } from './constantes.js';

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

describe('porcentaje', () => {
  test('calcula el ancho relativo y evita dividir por cero', () => {
    expect(porcentaje(5, 10)).toBe(50);
    expect(porcentaje(1, 0)).toBe(0);
  });
});

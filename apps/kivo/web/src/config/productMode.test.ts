import { describe, expect, it } from 'vitest';
import { areDevControlsEnabled, formatProviderModeLabel } from './productMode';

describe('productMode', () => {
  it('keeps dev controls hidden unless explicitly enabled', () => {
    expect(areDevControlsEnabled({})).toBe(false);
    expect(areDevControlsEnabled({ VITE_KIVO_ENABLE_DEV_CONTROLS: 'false' })).toBe(false);
    expect(areDevControlsEnabled({ VITE_KIVO_ENABLE_DEV_CONTROLS: 'true' })).toBe(true);
    expect(areDevControlsEnabled({ VITE_KIVO_ENABLE_DEV_CONTROLS: '1' })).toBe(true);
  });

  it('maps provider modes to product-safe labels', () => {
    expect(formatProviderModeLabel('devnet')).toBe('Devnet');
    expect(formatProviderModeLabel('sandbox')).toBe('Devnet');
    expect(formatProviderModeLabel('production')).toBe('Producao');
    expect(formatProviderModeLabel('mock')).toBe('Nao configurado');
    expect(formatProviderModeLabel(undefined)).toBe('Devnet');
  });
});

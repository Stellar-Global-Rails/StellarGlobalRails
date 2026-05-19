type KivoClientEnv = Record<string, string | boolean | undefined>;

const truthyValues = new Set(['1', 'true', 'yes', 'on']);

export function areDevControlsEnabled(env: KivoClientEnv = import.meta.env): boolean {
  const value = env.VITE_KIVO_ENABLE_DEV_CONTROLS;

  return truthyValues.has(String(value ?? '').trim().toLowerCase());
}

export function formatProviderModeLabel(mode?: string): string {
  if (mode === 'production') {
    return 'Producao';
  }

  if (mode === 'mock') {
    return 'Nao configurado';
  }

  return 'Devnet';
}

export function getEnvVariable(key: string, required = true): string {
  const value = process.env[key];

  if (required && (!value || value.trim() === '')) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value || '';
}

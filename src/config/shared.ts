import crypto from 'crypto'

export function readTrimmedEnv(name: string): string | undefined {
  return process.env[name]?.trim()
}

export function requireTrimmedEnv(name: string, errorMessage?: string): string {
  const value = readTrimmedEnv(name)
  if (!value) {
    throw new Error(errorMessage ?? `${name} is missing`)
  }
  return value
}

export function getProductionRequiredSecret(name: string): string {
  const value = readTrimmedEnv(name)
  if (process.env.NODE_ENV === 'production' && !value) {
    throw new Error(`${name} is missing in production`)
  }

  return value || crypto.randomBytes(32).toString('hex')
}

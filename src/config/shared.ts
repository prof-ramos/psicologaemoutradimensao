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

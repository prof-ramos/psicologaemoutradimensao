export function readTrimmedEnv(name: string): string | undefined {
  return process.env[name]?.trim()
}

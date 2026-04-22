import { readTrimmedEnv } from './shared'

export const integrationsConfig = {
  revalidationSecret: readTrimmedEnv('REVALIDATION_SECRET'),
}

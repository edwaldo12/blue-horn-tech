const requiredEnv = (key: string): string => {
  const value = import.meta.env[key as keyof ImportMetaEnv]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const getApiBaseUrl = (): string => requiredEnv('VITE_API_URL')
export const getClientId = (): string => requiredEnv('VITE_CLIENT_ID')
export const getClientSecret = (): string => requiredEnv('VITE_CLIENT_SECRET')

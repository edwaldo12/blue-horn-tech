import { createContext } from 'react'
import type { TokenResponse } from '@/types'

export interface AuthContextValue {
  token: string | null
  caregiver: TokenResponse['caregiver'] | null
  loading: boolean
  refreshToken: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

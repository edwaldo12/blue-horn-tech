import { useCallback, useEffect, useMemo, useState } from 'react'
import { requestToken } from '@/api/auth'
import type { TokenResponse } from '@/types'
import { AuthContext } from '@/context/auth-context'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('access_token'))
  const [caregiver, setCaregiver] = useState<TokenResponse['caregiver'] | null>(() => {
    const raw = sessionStorage.getItem('caregiver')
    return raw ? (JSON.parse(raw) as TokenResponse['caregiver']) : null
  })
  const [loading, setLoading] = useState<boolean>(true)

  const hydrateToken = useCallback(async () => {
    setLoading(true)
    try {
      const data = await requestToken()
      sessionStorage.setItem('access_token', data.access_token)
      sessionStorage.setItem('caregiver', JSON.stringify(data.caregiver))
      setToken(data.access_token)
      setCaregiver(data.caregiver)
    } catch (error) {
      console.error('Failed to fetch access token', error)
      setToken(null)
      setCaregiver(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      void hydrateToken()
    } else {
      setLoading(false)
    }
  }, [token, hydrateToken])

  const value = useMemo(
    () => ({
      token,
      caregiver,
      loading,
      refreshToken: hydrateToken,
    }),
    [token, caregiver, loading, hydrateToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

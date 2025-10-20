import axios from 'axios'
import type { TokenResponse } from '@/types'
import { getApiBaseUrl, getClientId, getClientSecret } from '@/utils/env'

export async function requestToken(): Promise<TokenResponse> {
  const url = `${getApiBaseUrl()}/auth/token`
  const response = await axios.post<TokenResponse>(
    url,
    {
      grant_type: 'client_credentials',
      client_id: getClientId(),
      client_secret: getClientSecret(),
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  return response.data
}

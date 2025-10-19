import { useCallback, useEffect, useState } from 'react'

interface GeolocationState {
  coords: GeolocationCoordinates | null
  error: string | null
  loading: boolean
  requestPosition: () => void
}

export const useGeolocation = (): GeolocationState => {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const requestPosition = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords(position.coords)
        setError(null)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setCoords(null)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    )
  }, [])

  useEffect(() => {
    requestPosition()
  }, [requestPosition])

  return { coords, error, loading, requestPosition }
}

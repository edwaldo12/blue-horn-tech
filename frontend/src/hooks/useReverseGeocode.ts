import { useEffect, useState } from 'react';

interface ReverseGeocodeState {
  address: string | undefined;
  loading: boolean;
  error: string | undefined;
}

const buildQuery = (lat: number, lon: number) =>
  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

export const useReverseGeocode = (
  latitude?: number,
  longitude?: number
): ReverseGeocodeState => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      setAddress(undefined);
      return;
    }

    let aborted = false;
    const controller = new AbortController();

    const fetchAddress = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const response = await fetch(buildQuery(latitude, longitude), {
          signal: controller.signal,
          headers: {
            'Accept-Language': 'en',
          },
        });
        if (!response.ok) {
          throw new Error(`Reverse geocode failed: ${response.status}`);
        }
        const data = await response.json();
        if (!aborted) {
          setAddress(data.display_name as string);
        }
      } catch (err) {
        if (!aborted) {
          setError(
            err instanceof Error ? err.message : 'Reverse geocode failed'
          );
          setAddress(undefined);
        }
      } finally {
        if (!aborted) {
          setLoading(false);
        }
      }
    };

    fetchAddress();

    return () => {
      aborted = true;
      controller.abort();
    };
  }, [latitude, longitude]);

  return { address, loading, error };
};

import clsx from 'clsx';

interface LocationMapPreviewProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  className?: string;
}

const buildMapUrl = (lat: number, lon: number): string => {
  const delta = 0.005;
  const left = lon - delta;
  const right = lon + delta;
  const top = lat + delta;
  const bottom = lat - delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
};

export const LocationMapPreview: React.FC<LocationMapPreviewProps> = ({
  latitude,
  longitude,
  address,
  className,
}) => {
  const hasCoordinates =
    typeof latitude === 'number' && typeof longitude === 'number';

  // Split address into two parts: street/area and city/region/country
  const formatAddress = (addr: string) => {
    // Try to find natural break points (after 4th comma or similar)
    const parts = addr.split(',').map((p) => p.trim());
    if (parts.length > 4) {
      const firstPart = parts.slice(0, 4).join(', ');
      const secondPart = parts.slice(4).join(', ');
      return { line1: firstPart + ',', line2: secondPart };
    }
    return { line1: addr, line2: '' };
  };

  const addressLines = address ? formatAddress(address) : null;

  return (
    <div className={clsx('flex items-center gap-4', className)}>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        {hasCoordinates ? (
          <iframe
            title="Location map"
            src={buildMapUrl(latitude!, longitude!)}
            width="220"
            height="180"
            loading="lazy"
            className="rounded-xl"
          />
        ) : (
          <div className="flex h-44 w-56 items-center justify-center text-sm text-gray-500">
            Map preview unavailable
          </div>
        )}
      </div>
      {addressLines && (
        <div className="flex-1">
          <p className="text-sm text-gray-900 leading-relaxed">
            {addressLines.line1}
            {addressLines.line2 && (
              <>
                <br />
                {addressLines.line2}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

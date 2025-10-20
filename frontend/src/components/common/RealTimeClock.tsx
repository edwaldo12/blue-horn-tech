import { useState, useEffect, memo } from 'react';
import dayjs from 'dayjs';

interface RealTimeClockProps {
  className?: string;
}

export const RealTimeClock: React.FC<RealTimeClockProps> = memo(
  ({ className = '' }) => {
    const [currentTime, setCurrentTime] = useState(dayjs());

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(dayjs());
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className={`text-4xl font-bold text-[#0D5D59] ${className}`}>
        {currentTime.format('HH : mm : ss')}
      </div>
    );
  }
);

RealTimeClock.displayName = 'RealTimeClock';

import { memo } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  tone?: 'missed' | 'upcoming' | 'completed' | 'neutral';
}

const toneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
  missed: 'text-[#D32F2F]',
  upcoming: 'text-[#ED6C02]',
  completed: 'text-[#2E7D32]',
  neutral: 'text-gray-600',
};

export const StatCard: React.FC<StatCardProps> = memo(
  ({ label, value, tone = 'neutral' }) => {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-center">
          <div
            className={`text-5xl md:text-4xl font-bold mb-2 ${toneClasses[tone]}`}
          >
            {value}
          </div>
          <div className="text-sm font-medium text-gray-600">{label}</div>
        </div>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

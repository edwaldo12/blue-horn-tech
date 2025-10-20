import { memo, type ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = memo(
  ({ title, description, action }) => (
    <div className="card bg-base-100 shadow-md text-center">
      <div className="card-body items-center gap-3">
        <span className="material-symbols-rounded text-4xl text-neutral">
          calendar_clock
        </span>
        <h3 className="card-title text-lg">{title}</h3>
        {description && <p className="text-sm opacity-70">{description}</p>}
        {action}
      </div>
    </div>
  )
);

EmptyState.displayName = 'EmptyState';

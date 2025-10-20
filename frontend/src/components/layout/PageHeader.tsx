import { HeaderDropdown } from '@/components/common/HeaderDropdown';

interface PageHeaderProps {
  title: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  onLogout: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  userName,
  userEmail,
  userAvatar,
  onLogout,
}) => {
  return (
    <header
      className="mb-6 hidden rounded-2xl px-6 py-4 md:block"
      style={{ backgroundColor: '#D2EEFF' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <span className="text-xl font-bold" style={{ color: '#1D1D1BDE' }}>
              C
            </span>
          </div>
          <div>
            <p
              className="text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: '#1D1D1BDE' }}
            >
              {title}
            </p>
          </div>
        </div>
        <HeaderDropdown
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
};

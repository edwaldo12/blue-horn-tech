import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { caregiver, refreshToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      {/* Desktop View - Original Layout */}
      <div className="card-shadow gap-4 p-6 hidden md:flex md:flex-col">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content w-16 rounded-full">
              <span className="text-xl">{caregiver?.name?.[0] ?? 'C'}</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800">
              {caregiver?.name ?? 'Caregiver'}
            </h1>
            <p className="text-sm text-neutral-500">
              {caregiver?.email ?? 'No email provided'}
            </p>
          </div>
        </div>

        <div className="divider" />

        <button
          type="button"
          className="btn btn-outline btn-error"
          onClick={() => refreshToken()}
        >
          Refresh session
        </button>
      </div>

      {/* Mobile View - Simple Welcome + Log Out */}
      <div className="card-shadow flex flex-col gap-6 p-6 md:hidden">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {caregiver?.name || 'Guest'}!
        </h1>

        <button
          type="button"
          className="w-full rounded-lg border border-red-500 bg-white py-3 text-base font-medium text-red-500 transition-colors hover:bg-red-50"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

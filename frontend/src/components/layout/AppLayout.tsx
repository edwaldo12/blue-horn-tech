import { NavLink, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const tabs = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/profile', label: 'Profile', icon: 'account_circle' },
];

export const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-[100svh] flex-col bg-base-100">
      <main
        className="flex-1 pb-20 md:pb-0"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Outlet />
      </main>

      <nav
        className="border-t border-base-200 shadow-sm md:hidden"
        style={{
          backgroundColor: '#F5FBFF',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="mx-auto flex max-w-md items-center justify-around py-3">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={clsx(
                  'flex flex-col items-center gap-1 text-xs font-medium transition-colors',
                  isActive ? '' : 'text-neutral-400'
                )}
                style={isActive ? { color: '#0D5D59' } : {}}
              >
                <span className="material-symbols-rounded text-2xl">
                  {tab.icon}
                </span>
                {tab.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

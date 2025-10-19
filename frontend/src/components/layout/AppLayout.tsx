import { NavLink, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const tabs = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/profile', label: 'Profile', icon: 'account_circle' },
];

export const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-base-100">
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      <nav className="border-t border-base-200 bg-white shadow-sm md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around py-3">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={clsx(
                  'flex flex-col items-center gap-1 text-xs font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-neutral-400'
                )}
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

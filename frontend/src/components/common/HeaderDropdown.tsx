import { useState, useRef, useEffect, memo } from 'react';

interface HeaderDropdownProps {
  userName: string;
  userEmail: string;
  userAvatar?: string;
  onLogout: () => void;
}

export const HeaderDropdown: React.FC<HeaderDropdownProps> = memo(
  ({ userName, userEmail, userAvatar, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold" style={{ color: '#1D1D1BDE' }}>
            {userName}
          </p>
          <p className="text-xs" style={{ color: '#1D1D1BDE' }}>
            {userEmail}
          </p>
        </div>
        <div className="avatar">
          <div className="w-10 rounded-full bg-white">
            <img
              src={
                userAvatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  userName
                )}&backgroundColor=b6e3f4`
              }
              alt={userName}
            />
          </div>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="dropdown-button material-symbols-rounded text-xl hover:bg-white/20 rounded-full p-1 transition-colors cursor-pointer"
            style={{ color: '#1D1D1BDE' }}
          >
            expand_more
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-rounded text-base">
                  logout
                </span>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

HeaderDropdown.displayName = 'HeaderDropdown';

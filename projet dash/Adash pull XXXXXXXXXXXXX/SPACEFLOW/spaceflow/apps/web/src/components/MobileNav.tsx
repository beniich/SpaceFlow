import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipe } from '../hooks/useSwipe';
import { Home, Building2, Users, Calendar, Settings } from 'lucide-react';
import clsx from 'clsx';

const items = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/spaces', icon: Building2, label: 'Espaces' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/bookings', icon: Calendar, label: 'Réservations' },
  { to: '/settings', icon: Settings, label: 'Paramètres' }
];

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = items.findIndex(item => 
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
  );

  const goTo = (delta: number) => {
    const newIndex = Math.max(0, Math.min(items.length - 1, currentIndex + delta));
    navigate(items[newIndex].to);
  };

  const swipe = useSwipe({
    onSwipeLeft: () => goTo(1),
    onSwipeRight: () => goTo(-1)
  });

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-40 pb-safe"
      {...swipe}
    >
      <div className="flex justify-around items-center h-16">
        {items.map((item, i) => {
          const Icon = item.icon;
          const active = i === currentIndex;
          return (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className={clsx(
                'flex flex-col items-center justify-center flex-1 h-full transition',
                active ? 'text-indigo-600' : 'text-slate-500'
              )}
            >
              <Icon className={clsx('w-5 h-5', active && 'scale-110')} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

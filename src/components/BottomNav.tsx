import { Home, Clock, GraduationCap, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Clock, label: 'Histórico', path: '/dashboard' },
  { icon: GraduationCap, label: 'Educação', path: '/education' },
  { icon: User, label: 'Perfil', path: '/dashboard' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-xl border-t border-border">
      <div className="max-w-md mx-auto flex justify-around py-2">
        {tabs.map(tab => {
          const active = pathname === tab.path && tab.label === 'Home' ? pathname === '/dashboard' :
            tab.label === 'Educação' ? pathname === '/education' : false;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 relative active:scale-90 transition-transform"
            >
              {active && (
                <motion.div
                  layoutId="bottomnav"
                  className="absolute -top-0.5 w-8 h-1 rounded-full gradient-hot"
                />
              )}
              <tab.icon size={22} className={active ? 'text-primary' : 'text-muted-foreground'} />
              <span className={`text-[10px] font-black ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;

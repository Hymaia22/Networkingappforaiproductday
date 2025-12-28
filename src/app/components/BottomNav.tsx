import React from 'react';
import { Home, Calendar, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'programme', label: 'Programme', icon: Calendar, path: '/programme' },
    { id: 'networking', label: 'Networking', icon: Users, path: '/networking' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t-2 border-[#CDFF00] safe-area-bottom z-40">
      <div className="flex items-center justify-around h-16 max-w-screen-sm mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#CDFF00]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-[#CDFF00]' : ''}`} />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
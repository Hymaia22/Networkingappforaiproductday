import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { BottomNav } from '../components/BottomNav';
import { Logo } from '../components/Logo';
import { useApp } from '../context/AppContext';

export const ProgrammeScreen: React.FC = () => {
  const { settings, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      {/* Header */}
      <header className="bg-black border-b-2 border-[#CDFF00] sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <Logo size="sm" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-white hover:bg-gray-900"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Iframe Content */}
      <div className="flex-1 bg-white">
        <iframe
          src={settings.program_url}
          className="w-full h-full border-0"
          title="Programme de la conférence"
          style={{ minHeight: 'calc(100vh - 64px - 64px)' }}
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
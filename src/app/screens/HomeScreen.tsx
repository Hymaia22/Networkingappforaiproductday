import React from "react";
import { LogOut, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { BottomNav } from "../components/BottomNav";
import { Logo } from "../components/Logo";
import { useApp } from "../context/AppContext";
import ReactMarkdown from "react-markdown";

export const HomeScreen: React.FC = () => {
  const { currentUser, settings, logout, scans } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser) return null;

  // Replace [Prénom] placeholder with actual first name
  const welcomeTitle = settings.home_title.replace(
    "[Prénom]",
    currentUser.first_name,
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-10">
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

      {/* Content */}
      <main className="px-6 py-6 max-w-screen-sm mx-auto">
        {/* Welcome Section */}
        <div className="bg-black text-white rounded-lg p-6 mb-6 border-2 border-[#CDFF00]">
          <h2 className="text-2xl mb-2">{welcomeTitle}</h2>
          <p className="text-gray-400">
            {currentUser.profession} • {currentUser.entreprise}
          </p>
        </div>

        {/* Stats Cards */}
        {scans.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-semibold text-green-900">
                  {scans.length}
                </p>
                <p className="text-sm text-green-700">
                  Contact{scans.length > 1 ? "s" : ""} scanné
                  {scans.length > 1 ? "s" : ""}
                </p>
              </div>
              <Button
                onClick={() => navigate("/networking")}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-green-50 border-green-300"
              >
                Voir
              </Button>
            </div>
          </div>
        )}

        {/* Content Block */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>
              {settings.home_content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Quick Info */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/networking")}
            className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#CDFF00] hover:bg-gray-50 transition-all text-left"
          >
            <p className="text-2xl mb-1">📱</p>
            <p className="text-sm text-gray-600">
              Scannez les badges
            </p>
          </button>
          <button
            onClick={() => navigate("/programme")}
            className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#CDFF00] hover:bg-gray-50 transition-all text-left"
          >
            <p className="text-2xl mb-1">📅</p>
            <p className="text-sm text-gray-600">Programme</p>
          </button>
        </div>

        {/* Brand Showcase Link - Dev only */}
        <div className="mt-4">
          <button
            onClick={() => navigate("/brand-showcase")}
            className="w-full bg-gray-100 rounded-lg p-3 border border-gray-300 hover:bg-gray-200 transition-all text-center text-sm text-gray-600"
          >
            🎨 Voir le Brand Showcase
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
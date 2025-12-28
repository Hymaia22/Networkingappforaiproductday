import React from 'react';
import { Logo } from '../components/Logo';
import { SponsorsSection } from '../components/SponsorsSection';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BrandShowcase: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <div className="sticky top-0 z-50 bg-black border-b-2 border-[#CDFF00]">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <Logo />
          <div className="w-20"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-black text-white py-20 border-b-2 border-[#CDFF00]">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <div className="mb-8">
            <Logo size="lg" className="justify-center" />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Bienvenue à l'AI Product Day
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            L'événement de référence pour les professionnels de l'IA et du Product Management
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-[#CDFF00] hover:bg-[#b8e600] text-black font-bold">
              Obtenir mon billet
            </Button>
            <Button size="lg" variant="outline" className="border-[#CDFF00] text-[#CDFF00] hover:bg-[#CDFF00] hover:text-black">
              Voir le programme
            </Button>
          </div>
        </div>
      </section>

      {/* Color Palette Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Palette de couleurs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="h-32 rounded-lg bg-[#CDFF00] shadow-lg"></div>
              <p className="text-sm font-medium text-center">Neon Yellow</p>
              <p className="text-xs text-gray-500 text-center">#CDFF00</p>
            </div>
            <div className="space-y-2">
              <div className="h-32 rounded-lg bg-black shadow-lg border-2 border-gray-300"></div>
              <p className="text-sm font-medium text-center">Black</p>
              <p className="text-xs text-gray-500 text-center">#000000</p>
            </div>
            <div className="space-y-2">
              <div className="h-32 rounded-lg bg-white shadow-lg border-2 border-gray-300"></div>
              <p className="text-sm font-medium text-center">White</p>
              <p className="text-xs text-gray-500 text-center">#FFFFFF</p>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Variations */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Variations du logo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border-2 border-gray-200 flex items-center justify-center">
              <Logo size="sm" />
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border-2 border-gray-200 flex items-center justify-center">
              <Logo size="md" />
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border-2 border-gray-200 flex items-center justify-center">
              <Logo size="lg" />
            </div>
            <div className="bg-black p-8 rounded-lg shadow-lg flex items-center justify-center col-span-1 md:col-span-3 border-2 border-[#CDFF00]">
              <Logo size="md" />
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <SponsorsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};
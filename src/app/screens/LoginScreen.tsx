import React, { useState } from 'react';
import { QrCode, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { QRScannerModal } from '../components/QRScannerModal';
import { Logo } from '../components/Logo';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export const LoginScreen: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleScan = async (barcode: string) => {
    setIsScanning(false);
    setIsLoading(true);

    try {
      const result = await login(barcode);
      
      if (result.success) {
        toast.success('Connexion réussie !');
        navigate('/home');
      } else {
        toast.error(result.error || 'Badge non reconnu');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Logo size="lg" />
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-xl mb-2 text-white">Networking</h2>
          <p className="text-gray-400">
            Scannez votre badge pour accéder
          </p>
        </div>

        {/* Scan Button */}
        <Button
          onClick={() => setIsScanning(true)}
          disabled={isLoading}
          size="lg"
          className="w-full h-14 bg-[#CDFF00] hover:bg-[#b8e600] text-black font-bold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Connexion...
            </>
          ) : (
            <>
              <QrCode className="w-5 h-5 mr-2" />
              Scanner mon badge
            </>
          )}
        </Button>

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <p className="text-sm text-gray-400 text-center">
            Autorisez l'accès à la caméra pour scanner votre badge QR
          </p>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScanning}
        onClose={() => setIsScanning(false)}
        onScan={handleScan}
        title="Scanner votre badge"
      />
    </div>
  );
};
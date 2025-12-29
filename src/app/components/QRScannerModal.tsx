import React, { useState } from 'react';
import { X, Camera, CircleAlert, Keyboard } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
  title?: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
  title = "Scanner un badge"
}) => {
  const [manualCode, setManualCode] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
      setShowManualEntry(false);
    }
  };

  const handleQRScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue;
      if (result) {
        onScan(result);
        onClose();
      }
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner Error:', error);
    
    if (error?.name === 'NotAllowedError' || error?.message?.includes('Permission denied')) {
      setPermissionDenied(true);
      setShowManualEntry(true);
      setError('Accès à la caméra refusé. Utilisez la saisie manuelle ci-dessous.');
    } else if (error?.name === 'NotFoundError') {
      setPermissionDenied(true);
      setShowManualEntry(true);
      setError('Aucune caméra détectée sur cet appareil. Utilisez la saisie manuelle.');
    } else if (error?.name === 'NotReadableError') {
      setPermissionDenied(true);
      setShowManualEntry(true);
      setError('La caméra est déjà utilisée par une autre application.');
    } else if (error?.name === 'NotSupportedError' || error?.message?.includes('https')) {
      setPermissionDenied(true);
      setShowManualEntry(true);
      setError('⚠️ HTTPS requis pour la caméra. Utilisez la saisie manuelle.');
    } else {
      setError('Erreur d\'accès à la caméra. Basculement vers la saisie manuelle.');
      setShowManualEntry(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="font-semibold text-blue-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-blue-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex gap-3">
                <CircleAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 mb-1">{error}</p>
                  {permissionDenied && (
                    <div className="text-xs text-amber-700 space-y-1 mt-2">
                      <p className="font-medium">💡 Pour activer la caméra :</p>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        <li>Vérifiez que le site est en HTTPS</li>
                        <li>Cliquez sur l'icône 🔒 dans la barre d'adresse</li>
                        <li>Autorisez l'accès à la caméra</li>
                        <li>Rechargez la page et réessayez</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!showManualEntry ? (
            <>
              {/* QR Scanner with Camera */}
              <div className="bg-black rounded-lg overflow-hidden mb-4" style={{ height: '300px' }}>
                <Scanner
                  onScan={handleQRScan}
                  onError={handleError}
                  styles={{
                    container: { 
                      width: '100%', 
                      height: '100%'
                    },
                    video: {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }
                  }}
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-blue-500" />
                <p className="text-sm text-gray-600">
                  Placez le QR code du badge devant la caméra
                </p>
              </div>

              <Button
                onClick={() => setShowManualEntry(true)}
                variant="outline"
                className="w-full"
              >
                <Keyboard className="w-4 h-4 mr-2" />
                Saisir le code manuellement
              </Button>
            </>
          ) : (
            <>
              {/* Manual Entry */}
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="barcode" className="text-gray-700 flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    Saisissez le code du badge
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="barcode"
                      type="text"
                      placeholder="Ex: 6623809483"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button type="submit" disabled={!manualCode.trim()}>
                      Valider
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Le code se trouve sur le badge du participant
                  </p>
                </div>
              </form>

              {!permissionDenied && (
                <Button
                  onClick={() => {
                    setShowManualEntry(false);
                    setError(null);
                  }}
                  variant="outline"
                  className="w-full mt-4"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Retour au scanner caméra
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

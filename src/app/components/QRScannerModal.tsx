import React, { useState } from 'react';
import { X, QrCode, Zap } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  // Quick test barcodes for development
  const quickTestCodes = [
    { code: 'AIDAY2025001', label: 'Marie (TechCorp)', role: 'Product Manager' },
    { code: 'AIDAY2025002', label: 'Thomas (Innovate)', role: 'CTO' },
    { code: 'AIDAY2025003', label: 'Sophie (AI Start)', role: 'Data Scientist' },
    { code: 'AIDAY2025004', label: 'Laurent (Digital)', role: 'CEO' },
    { code: 'AIDAY2025005', label: 'Julie (MLOps)', role: 'ML Engineer' }
  ];

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
          {/* QR Scanner Placeholder */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 mb-6 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300">
            <QrCode className="w-16 h-16 text-blue-500 mb-3 animate-pulse" />
            <p className="text-gray-700 text-center font-medium">
              Scanner QR simulé
            </p>
            <p className="text-sm text-gray-500 text-center mt-1">
              En production, la caméra s'ouvrira ici
            </p>
          </div>

          {/* Manual Entry */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <Label htmlFor="barcode" className="text-gray-700">
                Ou saisissez le code manuellement
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="barcode"
                  type="text"
                  placeholder="Ex: AIDAY2025001"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!manualCode.trim()}>
                  Scanner
                </Button>
              </div>
            </div>
          </form>

          {/* Quick Test Codes */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-medium text-gray-700">Codes de test rapides</p>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto">
              {quickTestCodes.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    onScan(item.code);
                    setManualCode('');
                  }}
                  className="text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all border border-blue-200 hover:border-blue-300 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-sm text-blue-700 font-medium">{item.code}</span>
                      <div className="text-sm text-gray-700 mt-1">{item.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.role}</div>
                    </div>
                    <QrCode className="w-5 h-5 text-blue-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
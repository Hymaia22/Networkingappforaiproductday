import React, { useState } from 'react';
import { Download, LogOut, Scan, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { BottomNav } from '../components/BottomNav';
import { ContactCard } from '../components/ContactCard';
import { QRScannerModal } from '../components/QRScannerModal';
import { ScanConfirmationModal } from '../components/ScanConfirmationModal';
import { Logo } from '../components/Logo';
import { useApp } from '../context/AppContext';
import { mockScansDB } from '../data/mockData';
import { Scan as ScanType } from '../data/mockData';
import { toast } from 'sonner';

export const NetworkingScreen: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastScan, setLastScan] = useState<ScanType | null>(null);
  const { scans, addScan, updateScanNote, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleScan = async (barcode: string) => {
    setIsScanning(false);

    const result = await addScan(barcode);
    
    if (result.success && result.scan) {
      setLastScan(result.scan);
      setShowConfirmation(true);
    } else {
      toast.error(result.error || 'Erreur lors du scan');
    }
  };

  const handleSaveNote = (note: string) => {
    if (lastScan && note.trim()) {
      updateScanNote(lastScan.id, note);
    }
  };

  const handleViewAllContacts = () => {
    setShowConfirmation(false);
    setLastScan(null);
    // Scroll to top to show the full list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setLastScan(null);
  };

  const handleExportContacts = () => {
    if (scans.length === 0) {
      toast.error('Aucun contact à exporter');
      return;
    }

    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
    let csv = 'Nom,Prénom,Email,Entreprise,Profession,Note,Date du scan\n';

    scans.forEach((scan) => {
      const participant = mockScansDB.getParticipant(scan.scanned_id);
      if (!participant) return;

      const row = [
        participant.name,
        participant.first_name,
        participant.email,
        participant.entreprise,
        participant.profession,
        escapeCsv(scan.note || ''),
        new Date(scan.timestamp).toLocaleString('fr-FR')
      ].join(',');
      csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contacts_scannes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sort scans by timestamp (most recent first)
  const sortedScans = [...scans].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const scannedParticipants = sortedScans
    .map(scan => mockScansDB.getParticipant(scan.scanned_id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const uniqueCompanies = new Set(
    scannedParticipants
      .map(p => p.entreprise)
      .filter(Boolean)
  );

  const lastScanDate = sortedScans[0]?.timestamp;

  // Get the participant details for the last scanned person
  const lastScannedPerson = lastScan ? mockScansDB.getParticipant(lastScan.scanned_id) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-black border-b-2 border-[#CDFF00] sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <Badge variant="secondary" className="rounded-full bg-[#CDFF00] text-black">
              {scans.length}
            </Badge>
          </div>
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
        {scans.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-xs text-gray-500">Contacts scannés</p>
                  <p className="text-2xl font-semibold text-gray-900">{scans.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Entreprises</p>
                  <p className="text-2xl font-semibold text-gray-900">{uniqueCompanies.size}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs text-gray-500">Dernier scan</p>
                  <p className="text-sm font-medium text-gray-900">
                    {lastScanDate ? new Date(lastScanDate).toLocaleString('fr-FR') : '—'}
                  </p>
                </div>
              </div>

              <Button onClick={handleExportContacts} className="bg-[#CDFF00] hover:bg-[#b8e600] text-black">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        )}

        {scans.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="bg-gray-100 rounded-full p-8 mb-6">
              <UserPlus className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-xl mb-2 text-center">
              Aucun contact scanné
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Scannez les badges de vos rencontres pour les ajouter à votre liste
            </p>
            <Button
              onClick={() => setIsScanning(true)}
              size="lg"
            >
              <Scan className="w-5 h-5 mr-2" />
              Scanner un badge
            </Button>
          </div>
        ) : (
          /* Contacts List */
          <div className="space-y-4">
            {sortedScans.map((scan) => (
              <ContactCard
                key={scan.id}
                scan={scan}
                onNoteUpdate={updateScanNote}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {scans.length > 0 && (
        <button
          onClick={() => setIsScanning(true)}
          className="fixed bottom-24 right-6 bg-[#CDFF00] text-black rounded-full p-4 shadow-lg hover:bg-[#b8e600] transition-colors z-20"
          aria-label="Scanner un badge"
        >
          <Scan className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScanning}
        onClose={() => setIsScanning(false)}
        onScan={handleScan}
        title="Scanner un badge"
      />

      {/* Scan Confirmation Modal */}
      <ScanConfirmationModal
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        scannedPerson={lastScannedPerson ?? null}
        scan={lastScan}
        onSaveNote={handleSaveNote}
        onViewAllContacts={handleViewAllContacts}
      />
    </div>
  );
};

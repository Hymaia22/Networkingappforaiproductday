import React, { useState } from 'react';
import { Check, X, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Participant, Scan } from '../data/mockData';

interface ScanConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  scannedPerson: Participant | null;
  scan: Scan | null;
  onSaveNote: (note: string) => void;
  onViewAllContacts: () => void;
}

export const ScanConfirmationModal: React.FC<ScanConfirmationModalProps> = ({
  isOpen,
  onClose,
  scannedPerson,
  scan,
  onSaveNote,
  onViewAllContacts
}) => {
  const [note, setNote] = useState('');

  if (!isOpen || !scannedPerson) return null;

  const handleSaveAndClose = () => {
    if (note.trim()) {
      onSaveNote(note);
    }
    setNote('');
    onClose();
  };

  const handleViewAll = () => {
    if (note.trim()) {
      onSaveNote(note);
    }
    setNote('');
    onViewAllContacts();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Success Header */}
        <div className="bg-green-50 p-6 border-b border-green-100">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-green-100 rounded-full p-3">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-center font-semibold text-green-900 mb-1">
            Contact ajouté avec succès !
          </h2>
          <p className="text-center text-sm text-green-700">
            Vous pouvez ajouter une note maintenant ou plus tard
          </p>
        </div>

        {/* Contact Details */}
        <div className="p-6 border-b">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">
                {scannedPerson.first_name} {scannedPerson.name}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{scannedPerson.entreprise}</p>
              {scannedPerson.profession && (
                <p className="text-gray-500 text-sm">{scannedPerson.profession}</p>
              )}
              <Badge variant="secondary" className="mt-2">
                {scannedPerson.ticket}
              </Badge>
            </div>
          </div>
        </div>

        {/* Note Section */}
        <div className="p-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Ajouter une note (optionnel)
          </label>
          <Textarea
            placeholder="Ex: Intéressé par notre produit IA, à recontacter en janvier..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px] resize-none"
            maxLength={500}
            autoFocus
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {note.length}/500
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 space-y-3">
          <Button
            onClick={handleViewAll}
            className="w-full"
            size="lg"
          >
            Voir tous mes contacts
          </Button>
          <Button
            onClick={handleSaveAndClose}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {note.trim() ? 'Enregistrer et continuer' : 'Continuer à scanner'}
          </Button>
        </div>
      </div>
    </div>
  );
};

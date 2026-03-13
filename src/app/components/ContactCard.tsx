import React, { useState, useEffect, useRef } from 'react';
import { Clock, Edit2, Check } from 'lucide-react';
import { Scan } from '../data/mockData';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApp } from '../context/AppContext';

interface ContactCardProps {
  scan: Scan;
  onNoteUpdate: (scanId: string, note: string) => void | Promise<void>;
}

export const ContactCard: React.FC<ContactCardProps> = ({ scan, onNoteUpdate }) => {
  const { getParticipantById } = useApp();
  const participant = getParticipantById(scan.scanned_id);
  const [note, setNote] = useState(scan.note);
  const [isEditing, setIsEditing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setNote(scan.note);
  }, [scan.note]);

  const handleNoteChange = (newNote: string) => {
    // Limit to 500 characters
    const limitedNote = newNote.substring(0, 500);
    setNote(limitedNote);

    // Auto-save after 1 second of inactivity
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onNoteUpdate(scan.id, limitedNote);
    }, 1000);
  };

  const handleSaveNote = () => {
    onNoteUpdate(scan.id, note);
    setIsEditing(false);
  };

  if (!participant) return null;

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Check if this contact was added in the last 30 seconds
  const isRecent = Date.now() - new Date(scan.timestamp).getTime() < 30000;

  return (
    <div className={`bg-white rounded-lg border transition-all ${
      isRecent ? 'border-green-300 shadow-md' : 'border-gray-200 hover:shadow-md'
    }`}>
      {isRecent && (
        <div className="bg-green-50 px-4 py-2 border-b border-green-100 flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700 font-medium">Nouveau contact</span>
        </div>
      )}
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold">
              {participant.first_name} {participant.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{participant.entreprise}</p>
            {participant.profession && (
              <p className="text-gray-500 text-sm">{participant.profession}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {participant.ticket}
              </Badge>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatTime(scan.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Note
            </label>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Modifier
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                placeholder="Ajouter une note..."
                value={note}
                onChange={(e) => handleNoteChange(e.target.value)}
                className="min-h-[100px] resize-none text-sm"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {note.length}/500
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNote(scan.note);
                      setIsEditing(false);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveNote}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {note ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                  {note}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Aucune note ajoutée
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

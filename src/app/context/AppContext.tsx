import React, { createContext, useContext, useState, useEffect } from 'react';
import { Participant, Scan, Settings, mockSettings } from '../data/mockData';
import { supaParticipants, supaScans, supaSettings } from '../data/supabaseRepo';

interface AppContextType {
  participants: Participant[];
  currentUser: Participant | null;
  scans: Scan[];
  settings: Settings;
  login: (barcode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addScan: (barcode: string) => Promise<{ success: boolean; error?: string; scan?: Scan }>;
  updateScanNote: (scanId: string, note: string) => Promise<void>;
  clearScans: () => void;
  refreshScans: () => void;
  refreshParticipants: () => void;
  getParticipantById: (id: string) => Participant | undefined;
  updateSettings: (settings: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [settings, setSettings] = useState<Settings>(mockSettings);

  const STORAGE_BARCODE = 'aiday_current_barcode';

  useEffect(() => {
    const init = async () => {
      try {
        const [settingsData, participantsData] = await Promise.all([
          supaSettings.get(),
          supaParticipants.getAll()
        ]);
        setSettings(settingsData);
        setParticipants(participantsData);

        const barcode = localStorage.getItem(STORAGE_BARCODE);
        if (barcode) {
          const user = participantsData.find(p => p.barcode === barcode) 
            ?? await supaParticipants.getByBarcode(barcode);
          if (user) {
            setCurrentUser(user);
            const userScans = await supaScans.getByScanner(user.id);
            setScans(userScans);
          }
        }
      } catch (error) {
        console.error('Init error:', error);
      }
    };
    init();
  }, []);

  const login = async (barcode: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = await supaParticipants.getByBarcode(barcode);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem(STORAGE_BARCODE, barcode);
        const userScans = await supaScans.getByScanner(user.id);
        setScans(userScans);
        return { success: true };
      }
      return { success: false, error: 'Badge non reconnu' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur lors de la connexion' };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_BARCODE);
    setCurrentUser(null);
    setScans([]);
  };

  const addScan = async (barcode: string): Promise<{ success: boolean; error?: string; scan?: Scan }> => {
    if (!currentUser) return { success: false, error: "Non authentifié" };

    try {
      let participant = participants.find(p => p.barcode === barcode);
      if (!participant) {
        participant = await supaParticipants.getByBarcode(barcode) ?? undefined;
      }
      if (!participant) {
        return { success: false, error: 'Badge non reconnu' };
      }
      if (participant.id === currentUser.id) {
        return { success: false, error: 'Vous ne pouvez pas scanner votre propre badge' };
      }

      const scan = await supaScans.add(currentUser.id, participant.id);
      const userScans = await supaScans.getByScanner(currentUser.id);
      setScans(userScans);
      return { success: true, scan };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Erreur lors du scan' };
    }
  };

  const updateScanNote = async (scanId: string, note: string) => {
    if (!currentUser) return;
    await supaScans.updateNote(scanId, note);
    const userScans = await supaScans.getByScanner(currentUser.id);
    setScans(userScans);
  };

  const clearScans = () => {
    if (!currentUser) return;
    supaScans.clearForScanner(currentUser.id).then(() => setScans([]));
  };

  const refreshScans = () => {
    if (!currentUser) return;
    supaScans.getByScanner(currentUser.id).then(setScans);
  };

  const refreshParticipants = () => {
    supaParticipants.getAll().then(setParticipants);
  };

  const getParticipantById = (id: string) => {
    return participants.find(p => p.id === id);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    // Optimistic UI update even if storage is slow or blocked
    setSettings((prev) => ({ ...prev, ...newSettings }));
    supaSettings.update(newSettings).catch((error) => {
      console.error('Update settings error:', error);
    });
  };

  return (
    <AppContext.Provider
      value={{
        participants,
        currentUser,
        scans,
        settings,
        login,
        logout,
        addScan,
        updateScanNote,
        clearScans,
        refreshScans,
        refreshParticipants,
        getParticipantById,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

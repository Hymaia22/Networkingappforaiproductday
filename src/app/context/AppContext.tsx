import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAuth, mockScansDB, mockSettingsDB, Participant, Scan, Settings } from '../data/mockData';

interface AppContextType {
  currentUser: Participant | null;
  scans: Scan[];
  settings: Settings;
  login: (barcode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addScan: (barcode: string) => Promise<{ success: boolean; error?: string; scan?: Scan }>;
  updateScanNote: (scanId: string, note: string) => void;
  refreshScans: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Participant | null>(() => mockAuth.getCurrentUser());
  const [scans, setScans] = useState<Scan[]>(() => {
    const user = mockAuth.getCurrentUser();
    return user ? mockScansDB.getAll(user.id) : [];
  });
  const [settings, setSettings] = useState<Settings>(mockSettingsDB.get());

  useEffect(() => {
    // Check if user is already logged in
    const user = mockAuth.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setScans(mockScansDB.getAll(user.id));
    }
  }, []);

  const login = async (barcode: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockAuth.login(barcode);
    if (user) {
      setCurrentUser(user);
      setScans(mockScansDB.getAll(user.id));
      return { success: true };
    }
    return { success: false, error: "Badge non reconnu" };
  };

  const logout = () => {
    mockAuth.logout();
    setCurrentUser(null);
    setScans([]);
  };

  const addScan = async (barcode: string): Promise<{ success: boolean; error?: string; scan?: Scan }> => {
    if (!currentUser) return { success: false, error: "Non authentifié" };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const result = mockScansDB.add(currentUser.id, barcode);
    if (result.success && result.scan) {
      setScans(mockScansDB.getAll(currentUser.id));
      return { success: true, scan: result.scan };
    }
    return { success: false, error: result.error };
  };

  const updateScanNote = (scanId: string, note: string) => {
    mockScansDB.updateNote(scanId, note);
    if (currentUser) {
      setScans(mockScansDB.getAll(currentUser.id));
    }
  };

  const refreshScans = () => {
    if (currentUser) {
      setScans(mockScansDB.getAll(currentUser.id));
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    mockSettingsDB.update(newSettings);
    setSettings(mockSettingsDB.get());
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        scans,
        settings,
        login,
        logout,
        addScan,
        updateScanNote,
        refreshScans,
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

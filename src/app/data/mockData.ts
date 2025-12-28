// Mock data for the networking app

export interface Participant {
  id: string;
  barcode: string;
  name: string;
  first_name: string;
  email: string;
  entreprise: string;
  profession: string;
  ticket: string;
}

export interface Scan {
  id: string;
  scanner_id: string;
  scanned_id: string;
  timestamp: Date;
  note: string;
}

export interface Settings {
  home_title: string;
  home_content: string;
  program_url: string;
}

// Storage helpers for mock data
const STORAGE_KEYS = {
  CURRENT_USER: 'aiday_current_user',
  SCANS: 'aiday_scans',
  SETTINGS: 'aiday_settings',
  PARTICIPANTS: 'aiday_participants', // New key for imported participants
  IMPORT_META: 'aiday_import_meta' // Metadata about last import
};

export interface ImportMetadata {
  lastImportDate: string;
  participantCount: number;
}

export const mockParticipants: Participant[] = [
  {
    id: "1",
    barcode: "AIDAY2025001",
    name: "Dupont",
    first_name: "Marie",
    email: "marie.dupont@techcorp.com",
    entreprise: "TechCorp",
    profession: "Product Manager",
    ticket: "VIP"
  },
  {
    id: "2",
    barcode: "AIDAY2025002",
    name: "Martin",
    first_name: "Thomas",
    email: "thomas.martin@innovate.io",
    entreprise: "Innovate.io",
    profession: "CTO",
    ticket: "Standard"
  },
  {
    id: "3",
    barcode: "AIDAY2025003",
    name: "Bernard",
    first_name: "Sophie",
    email: "sophie.bernard@aistart.fr",
    entreprise: "AI Start",
    profession: "Data Scientist",
    ticket: "Standard"
  },
  {
    id: "4",
    barcode: "AIDAY2025004",
    name: "Petit",
    first_name: "Laurent",
    email: "laurent.petit@digital.com",
    entreprise: "Digital Solutions",
    profession: "CEO",
    ticket: "VIP"
  },
  {
    id: "5",
    barcode: "AIDAY2025005",
    name: "Robert",
    first_name: "Julie",
    email: "julie.robert@mlops.ai",
    entreprise: "MLOps AI",
    profession: "ML Engineer",
    ticket: "Standard"
  }
];

export const mockSettings: Settings = {
  home_title: "Bienvenue [Prénom] !",
  home_content: `## Bienvenue à l'AI Product Day 2025 ! 🚀

**Informations pratiques :**
- Wifi : AIProductDay2025 / Password: innovation2025
- Pause café : 10h30 et 15h30
- Déjeuner : 12h30 - 14h00
- Networking drinks : 18h00

N'oubliez pas de scanner les badges de vos contacts pour faciliter le suivi !`,
  program_url: "https://forwarddata-2025-schedule.netlify.app/"
};

// Helper to get all participants (default + imported)
const getAllParticipants = (): Participant[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
  const imported: Participant[] = stored ? JSON.parse(stored) : [];
  return [...mockParticipants, ...imported];
};

export const mockAuth = {
  login: (barcode: string): Participant | null => {
    const participant = getAllParticipants().find(p => p.barcode === barcode);
    if (participant) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(participant));
    }
    return participant || null;
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
  
  getCurrentUser: (): Participant | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const mockScansDB = {
  getAll: (scanner_id: string): Scan[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.SCANS);
    const allScans: Scan[] = stored ? JSON.parse(stored).map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp)
    })) : [];
    return allScans.filter(s => s.scanner_id === scanner_id);
  },
  
  add: (scanner_id: string, scanned_barcode: string): { success: boolean; scan?: Scan; error?: string } => {
    const participant = getAllParticipants().find(p => p.barcode === scanned_barcode);
    if (!participant) {
      return { success: false, error: "Badge non reconnu" };
    }
    
    if (participant.id === scanner_id) {
      return { success: false, error: "Vous ne pouvez pas scanner votre propre badge" };
    }
    
    const stored = localStorage.getItem(STORAGE_KEYS.SCANS);
    const allScans: Scan[] = stored ? JSON.parse(stored).map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp)
    })) : [];
    
    const existing = allScans.find(s => s.scanner_id === scanner_id && s.scanned_id === participant.id);
    if (existing) {
      return { success: false, error: "Contact déjà dans votre liste" };
    }
    
    const newScan: Scan = {
      id: `scan_${Date.now()}`,
      scanner_id,
      scanned_id: participant.id,
      timestamp: new Date(),
      note: ""
    };
    
    allScans.push(newScan);
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(allScans));
    
    return { success: true, scan: newScan };
  },
  
  updateNote: (scan_id: string, note: string): boolean => {
    const stored = localStorage.getItem(STORAGE_KEYS.SCANS);
    if (!stored) return false;
    
    const allScans: Scan[] = JSON.parse(stored).map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp)
    }));
    const scan = allScans.find(s => s.id === scan_id);
    if (scan) {
      scan.note = note.substring(0, 500); // Limit to 500 characters
      localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(allScans));
      return true;
    }
    return false;
  },
  
  getParticipant: (id: string): Participant | undefined => {
    return getAllParticipants().find(p => p.id === id);
  }
};

export const mockSettingsDB = {
  get: (): Settings => {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : mockSettings;
  },
  
  update: (settings: Partial<Settings>): boolean => {
    const current = mockSettingsDB.get();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return true;
  }
};

// Admin mock auth
export const mockAdminAuth = {
  login: (email: string, password: string): boolean => {
    // Simple mock admin - in production, this would be in Supabase
    return email === "admin@aiproductday.com" && password === "admin123";
  }
};

// Participants DB for admin
export const mockParticipantsDB = {
  getAll: (): Participant[] => {
    return getAllParticipants();
  },
  
  importFromCSV: (csvText: string): { success: boolean; count?: number; error?: string } => {
    try {
      // Helper function to parse CSV line with semicolon and quotes
      const parseCSVLine = (line: string): string[] => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];
          
          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              // Escaped quote
              current += '"';
              i++; // Skip next quote
            } else {
              // Toggle quote state
              inQuotes = !inQuotes;
            }
          } else if (char === ';' && !inQuotes) {
            // End of value
            values.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current); // Add last value
        return values;
      };
      
      const lines = csvText.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        return { success: false, error: "Le fichier CSV est vide" };
      }
      
      // Parse header
      const header = parseCSVLine(lines[0]);
      const barcodeIdx = header.indexOf('Barcode');
      const nameIdx = header.indexOf('Name');
      const firstNameIdx = header.indexOf('First name');
      const emailIdx = header.indexOf('Email');
      const entrepriseIdx = header.indexOf('Entreprise - #11');
      const professionIdx = header.indexOf('Profession - #12');
      const ticketIdx = header.indexOf('Ticket');
      
      if (barcodeIdx === -1 || nameIdx === -1 || firstNameIdx === -1) {
        return { success: false, error: "Colonnes requises manquantes (Barcode, Name, First name)" };
      }
      
      const newParticipants: Participant[] = [];
      
      // Parse data rows (skip header)
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        
        const barcode = cols[barcodeIdx]?.trim();
        const name = cols[nameIdx]?.trim();
        const firstName = cols[firstNameIdx]?.trim();
        
        // Skip empty rows or rows without required fields
        if (!barcode || !name || !firstName) continue;
        
        const participant: Participant = {
          id: `imported_${Date.now()}_${i}`,
          barcode: barcode,
          name: name,
          first_name: firstName,
          email: cols[emailIdx]?.trim() || '',
          entreprise: cols[entrepriseIdx]?.trim() || '',
          profession: cols[professionIdx]?.trim() || '',
          ticket: cols[ticketIdx]?.trim() || 'Standard'
        };
        
        newParticipants.push(participant);
      }
      
      if (newParticipants.length === 0) {
        return { success: false, error: "Aucun participant valide trouvé dans le CSV" };
      }
      
      // Store imported participants
      localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(newParticipants));
      
      // Store import metadata
      const importMeta: ImportMetadata = {
        lastImportDate: new Date().toISOString(),
        participantCount: newParticipants.length
      };
      localStorage.setItem(STORAGE_KEYS.IMPORT_META, JSON.stringify(importMeta));
      
      return { success: true, count: newParticipants.length };
    } catch (error) {
      console.error('CSV parsing error:', error);
      return { success: false, error: "Erreur lors de l'analyse du fichier CSV" };
    }
  },
  
  getImportMetadata: (): ImportMetadata | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.IMPORT_META);
    return stored ? JSON.parse(stored) : null;
  },
  
  clearImported: (): void => {
    localStorage.removeItem(STORAGE_KEYS.PARTICIPANTS);
    localStorage.removeItem(STORAGE_KEYS.IMPORT_META);
  }
};

// Export helpers for admin
export const mockExportDB = {
  getContactsByCompany: (): Map<string, { scanner: Participant; contacts: Array<{ participant: Participant; scan: Scan }> }> => {
    const stored = localStorage.getItem(STORAGE_KEYS.SCANS);
    if (!stored) return new Map();
    
    const allScans: Scan[] = JSON.parse(stored).map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp)
    }));
    
    const allParticipants = getAllParticipants();
    const companyMap = new Map<string, { scanner: Participant; contacts: Array<{ participant: Participant; scan: Scan }> }>();
    
    // Group scans by scanner's company
    allScans.forEach(scan => {
      const scanner = allParticipants.find(p => p.id === scan.scanner_id);
      const scanned = allParticipants.find(p => p.id === scan.scanned_id);
      
      if (!scanner || !scanned || !scanner.entreprise) return;
      
      const company = scanner.entreprise;
      if (!companyMap.has(company)) {
        companyMap.set(company, { scanner, contacts: [] });
      }
      
      const entry = companyMap.get(company)!;
      entry.contacts.push({ participant: scanned, scan });
    });
    
    return companyMap;
  },
  
  generateCSVForCompany: (company: string): string | null => {
    const companyData = mockExportDB.getContactsByCompany();
    const data = companyData.get(company);
    
    if (!data || data.contacts.length === 0) return null;
    
    // CSV Header
    let csv = 'Nom,Prénom,Email,Entreprise,Profession,Note,Date du scan\n';
    
    // CSV Rows
    data.contacts.forEach(({ participant, scan }) => {
      const row = [
        participant.name,
        participant.first_name,
        participant.email,
        participant.entreprise,
        participant.profession,
        `"${scan.note.replace(/"/g, '""')}"`, // Escape quotes
        new Date(scan.timestamp).toLocaleString('fr-FR')
      ].join(',');
      csv += row + '\n';
    });
    
    return csv;
  },
  
  downloadCSVForCompany: (company: string): boolean => {
    const csv = mockExportDB.generateCSVForCompany(company);
    if (!csv) return false;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `contacts_${company.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  },
  
  // Export ALL participants
  generateAllParticipantsCSV: (): string => {
    const allParticipants = getAllParticipants();
    
    // CSV Header
    let csv = 'Barcode,Nom,Prénom,Email,Entreprise,Profession,Ticket\n';
    
    // CSV Rows
    allParticipants.forEach(participant => {
      const row = [
        participant.barcode,
        participant.name,
        participant.first_name,
        participant.email,
        participant.entreprise,
        participant.profession,
        participant.ticket
      ].join(',');
      csv += row + '\n';
    });
    
    return csv;
  },
  
  downloadAllParticipants: (): boolean => {
    const csv = mockExportDB.generateAllParticipantsCSV();
    if (!csv) return false;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `tous_participants_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  }
};
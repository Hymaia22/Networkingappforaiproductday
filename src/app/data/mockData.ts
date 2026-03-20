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
  category?: string;
  created_at?: string;
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

const COOKIE_KEYS = {
  CURRENT_USER: 'aiday_current_user_barcode'
};

const setCookie = (name: string, value: string, days: number) => {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
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
  program_url: "https://hymaia.github.io/ai-product-day-program/planning.html"
};

// Helper to get all participants (imported only; defaults disabled)
const getAllParticipants = (): Participant[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
  return stored ? JSON.parse(stored) : [];
};

export const mockAuth = {
  login: (barcode: string): Participant | null => {
    const participant = getAllParticipants().find(p => p.barcode === barcode);
    if (participant) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(participant));
      setCookie(COOKIE_KEYS.CURRENT_USER, barcode, 7);
    }
    return participant || null;
  },
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    deleteCookie(COOKIE_KEYS.CURRENT_USER);
  },
  
  getCurrentUser: (): Participant | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) return JSON.parse(stored);

    const barcode = getCookie(COOKIE_KEYS.CURRENT_USER);
    if (!barcode) return null;

    const participant = getAllParticipants().find(p => p.barcode === barcode);
    if (participant) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(participant));
      return participant;
    }
    return null;
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
  },

  clearForScanner: (scanner_id: string): void => {
    const stored = localStorage.getItem(STORAGE_KEYS.SCANS);
    if (!stored) return;

    const allScans: Scan[] = JSON.parse(stored).map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp)
    }));
    const remaining = allScans.filter(s => s.scanner_id !== scanner_id);
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(remaining));
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
      // Robust CSV parser for semicolon-delimited data with quotes and embedded newlines
      const parseCSV = (text: string): string[][] => {
        const rows: string[][] = [];
        let row: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const nextChar = text[i + 1];

          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
            continue;
          }

          if (!inQuotes && char === ';') {
            row.push(current);
            current = '';
            continue;
          }

          if (!inQuotes && (char === '\n' || char === '\r')) {
            if (char === '\r' && nextChar === '\n') {
              i++;
            }
            row.push(current);
            current = '';
            if (row.some(cell => cell.trim())) {
              rows.push(row);
            }
            row = [];
            continue;
          }

          current += char;
        }

        row.push(current);
        if (row.some(cell => cell.trim())) {
          rows.push(row);
        }

        return rows;
      };

      const rows = parseCSV(csvText);
      if (rows.length < 2) {
        return { success: false, error: "Le fichier CSV est vide" };
      }
      
      // Parse header
      const header = rows[0];
      const headerHasLeadingEmpty = header[0]?.trim() === '';
      const normalizedHeader = header.map(h =>
        h.replace(/^\uFEFF/, '').trim().toLowerCase()
      );
      const findIndex = (candidates: string[]): number => {
        for (const candidate of candidates) {
          const idx = normalizedHeader.indexOf(candidate);
          if (idx !== -1) return idx;
        }
        return -1;
      };

      const barcodeIdx = findIndex(['barcode']);
      const nameIdx = findIndex(['name', 'nom']);
      const firstNameIdx = findIndex(['first name', 'firstname', 'first_name', 'prénom', 'prenom']);
      const emailIdx = findIndex(['email', 'e-mail']);
      const entrepriseIdx = findIndex([
        'entreprise - #11',
        'entreprise',
        'company',
        'company name',
        'organisation'
      ]);
      const professionIdx = findIndex([
        'profession - #12',
        'profession',
        'role',
        'job title',
        'poste'
      ]);
      const ticketIdx = findIndex(['ticket']);
      
      if (barcodeIdx === -1 || nameIdx === -1 || firstNameIdx === -1) {
        return { success: false, error: "Colonnes requises manquantes (Barcode, Name, First name)" };
      }
      
      const newParticipants: Participant[] = [];
      
      // Parse data rows (skip header)
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i];
        if (headerHasLeadingEmpty && cols.length === header.length - 1) {
          cols.unshift('');
        }
        if (cols.length < header.length) {
          cols.push(...Array(header.length - cols.length).fill(''));
        }
        
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
  },

  resetAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.SCANS);
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
    
  // Group scans by scanned person's company
  allScans.forEach(scan => {
    const scanner = allParticipants.find(p => p.id === scan.scanner_id);
    const scanned = allParticipants.find(p => p.id === scan.scanned_id);
    
    if (!scanner || !scanned || !scanned.entreprise) return;
    
    const company = scanned.entreprise;
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

import { supabase } from '../../lib/supabaseClient';
import { Participant, Scan, Settings, mockSettings } from './mockData';

const SETTINGS_ID = 'default';

export const supaParticipants = {
  getAll: async (): Promise<Participant[]> => {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Participant[];
  },

  getByBarcode: async (barcode: string): Promise<Participant | null> => {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('barcode', barcode)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as Participant | null;
  },

  upsertMany: async (participants: Participant[]): Promise<void> => {
    if (participants.length === 0) return;
    const uniqueByBarcode = new Map<string, Participant>();
    participants.forEach((p) => {
      if (!p.barcode) return;
      uniqueByBarcode.set(p.barcode, p);
    });
    const deduped = Array.from(uniqueByBarcode.values());
    if (deduped.length === 0) return;
    const { error } = await supabase
      .from('participants')
      .upsert(deduped, { onConflict: 'barcode' });
    if (error) throw error;
  },

  deleteAll: async (): Promise<void> => {
    const { error } = await supabase
      .from('participants')
      .delete()
      .neq('id', '');
    if (error) throw error;
  }
};

export const supaScans = {
  getByScanner: async (scannerId: string): Promise<Scan[]> => {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('scanner_id', scannerId)
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp)
    })) as Scan[];
  },

  getAll: async (): Promise<Scan[]> => {
    const { data, error } = await supabase
      .from('scans')
      .select('*');
    if (error) throw error;
    return (data ?? []).map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp)
    })) as Scan[];
  },

  add: async (scannerId: string, scannedId: string): Promise<Scan> => {
    const { data: existing, error: existingError } = await supabase
      .from('scans')
      .select('id')
      .eq('scanner_id', scannerId)
      .eq('scanned_id', scannedId)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing) {
      throw new Error('Contact déjà dans votre liste');
    }

    const newScan: Scan = {
      id: `scan_${Date.now()}`,
      scanner_id: scannerId,
      scanned_id: scannedId,
      timestamp: new Date(),
      note: ''
    };

    const { error } = await supabase
      .from('scans')
      .insert({
        ...newScan,
        timestamp: newScan.timestamp.toISOString()
      });
    if (error) throw error;

    return newScan;
  },

  updateNote: async (scanId: string, note: string): Promise<void> => {
    const { error } = await supabase
      .from('scans')
      .update({ note: note.substring(0, 500) })
      .eq('id', scanId);
    if (error) throw error;
  },

  clearForScanner: async (scannerId: string): Promise<void> => {
    const { error } = await supabase
      .from('scans')
      .delete()
      .eq('scanner_id', scannerId);
    if (error) throw error;
  }
};

export const supaSettings = {
  get: async (): Promise<Settings> => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', SETTINGS_ID)
      .maybeSingle();
    if (error) throw error;

    if (!data) {
      const toInsert = { id: SETTINGS_ID, ...mockSettings };
      const { error: insertError } = await supabase
        .from('settings')
        .insert(toInsert);
      if (insertError) throw insertError;
      return mockSettings;
    }

    return data as Settings;
  },

  update: async (settings: Partial<Settings>): Promise<void> => {
    const { error } = await supabase
      .from('settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', SETTINGS_ID);
    if (error) throw error;
  }
};

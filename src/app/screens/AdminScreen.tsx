import React, { useEffect, useState } from 'react';
import { Upload, LogOut, Settings, Users, BarChart3, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useApp } from '../context/AppContext';
import { mockAdminAuth, mockParticipantsDB, mockExportDB } from '../data/mockData';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export const AdminScreen: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { settings, updateSettings } = useApp();
  const navigate = useNavigate();
  const [totalParticipants, setTotalParticipants] = useState(() => mockParticipantsDB.getAll().length);
  const [importMeta, setImportMeta] = useState(() => mockParticipantsDB.getImportMetadata());
  const [participants, setParticipants] = useState(() => mockParticipantsDB.getAll());
  const [participantSearch, setParticipantSearch] = useState('');

  const setAdminCookie = () => {
    document.cookie = `aiday_admin_session=1; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Lax`;
  };

  const clearAdminCookie = () => {
    document.cookie = 'aiday_admin_session=; Max-Age=0; Path=/; SameSite=Lax';
  };

  const hasAdminCookie = (): boolean => {
    return /(?:^|; )aiday_admin_session=1(?:;|$)/.test(document.cookie);
  };

  useEffect(() => {
    if (hasAdminCookie()) {
      setIsLoggedIn(true);
    }
  }, []);

  // Admin settings state
  const [homeTitle, setHomeTitle] = useState(settings.home_title);
  const [homeContent, setHomeContent] = useState(settings.home_content);
  const [programUrl, setProgramUrl] = useState(settings.program_url);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mockAdminAuth.login(email, password)) {
      setIsLoggedIn(true);
      setAdminCookie();
      toast.success('Connexion admin réussie');
    } else {
      toast.error('Identifiants incorrects');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    clearAdminCookie();
    navigate('/login');
  };

  const handleSaveHomeContent = () => {
    updateSettings({
      home_title: homeTitle,
      home_content: homeContent
    });
    toast.success('Contenu de la page d\'accueil enregistré');
  };

  const handleSaveProgramUrl = () => {
    updateSettings({
      program_url: programUrl
    });
    toast.success('URL du programme enregistrée');
  };

  const refreshParticipantStats = () => {
    const all = mockParticipantsDB.getAll();
    setParticipants(all);
    setTotalParticipants(all.length);
    setImportMeta(mockParticipantsDB.getImportMetadata());
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 5MB)');
      return;
    }

    // Read and parse CSV file
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      const result = mockParticipantsDB.importFromCSV(csvText);
      
      if (result.success) {
        toast.success(`✅ ${result.count} participants importés avec succès !`);
        refreshParticipantStats();
        // Reset file input
        e.target.value = '';
      } else {
        toast.error(`❌ ${result.error}`);
      }
    };
    
    reader.onerror = () => {
      toast.error('Erreur lors de la lecture du fichier');
    };
    
    reader.readAsText(file);
  };

  const handleClearParticipants = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les participants importés ?')) {
      mockParticipantsDB.clearImported();
      refreshParticipantStats();
      toast.success('Participants importés supprimés');
    }
  };

  // Calculate stats
  const allScans = Object.keys(localStorage).filter(key => key === 'aiday_scans').length;

  const normalizedSearch = participantSearch.trim().toLowerCase();
  const filteredParticipants = normalizedSearch
    ? participants.filter(p => {
        const name = `${p.name} ${p.first_name}`.toLowerCase();
        return name.includes(normalizedSearch);
      })
    : participants;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Backoffice Admin</CardTitle>
            <CardDescription>Connectez-vous pour accéder à l'administration</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@aiproductday.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto">
          <h1 className="text-xl">Backoffice Admin</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-8 max-w-screen-xl mx-auto">
        <Tabs defaultValue="participants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl">
            <TabsTrigger value="participants">
              <Users className="w-4 h-4 mr-2" />
              Participants
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="w-4 h-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="home">
              <Settings className="w-4 h-4 mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger value="config">
              <Settings className="w-4 h-4 mr-2" />
              Config
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="w-4 h-4 mr-2" />
              Stats
            </TabsTrigger>
          </TabsList>

          {/* Participants Tab */}
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des participants</CardTitle>
                <CardDescription>
                  Importez un fichier CSV pour ajouter des participants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="csv-upload">Fichier CSV</Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Cliquez pour sélectionner un fichier CSV
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Max 5MB • Format: Barcode, Name, First name, Entreprise, etc.
                        </p>
                      </div>
                      <input
                        id="csv-upload"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleCSVUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm text-blue-900 mb-2">
                        <strong>📊 Base de données :</strong>
                      </p>
                      <ul className="text-sm text-blue-900 space-y-1">
                        <li>• Total de participants : <strong>{totalParticipants}</strong></li>
                        {importMeta && (
                          <>
                            <li>• Dernier import : <strong>{new Date(importMeta.lastImportDate).toLocaleString('fr-FR')}</strong></li>
                            <li>• Participants importés : <strong>{importMeta.participantCount}</strong></li>
                          </>
                        )}
                        {!importMeta && (
                          <li>• Aucun import CSV effectué</li>
                        )}
                      </ul>
                    </div>

                    <div className="w-full md:max-w-sm">
                      <Label htmlFor="participants-search" className="text-blue-900">
                        Recherche participants
                      </Label>
                      <Input
                        id="participants-search"
                        placeholder="Nom ou prénom"
                        value={participantSearch}
                        onChange={(e) => setParticipantSearch(e.target.value)}
                        className="mt-2 bg-white"
                      />
                      <div className="mt-3 max-h-40 overflow-auto rounded-md border border-blue-200 bg-white">
                        {filteredParticipants.length === 0 ? (
                          <p className="p-3 text-sm text-gray-500">Aucun participant trouvé</p>
                        ) : (
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-blue-50 text-blue-900">
                              <tr>
                                <th className="px-3 py-2 text-left font-medium">Name</th>
                                <th className="px-3 py-2 text-left font-medium">First name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredParticipants.map((p) => (
                                <tr key={p.id} className="border-t border-blue-100">
                                  <td className="px-3 py-2 text-gray-900">{p.name}</td>
                                  <td className="px-3 py-2 text-gray-900">{p.first_name}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      const success = mockExportDB.downloadAllParticipants();
                      if (success) {
                        toast.success('Export CSV de tous les participants généré');
                      } else {
                        toast.error('Erreur lors de l\'export');
                      }
                    }}
                    className="flex-1 bg-[#CDFF00] hover:bg-[#b8e600] text-black"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exporter tous les participants (CSV)
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={handleClearParticipants}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer les imports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Export des contacts par entreprise</CardTitle>
                <CardDescription>
                  Téléchargez les contacts scannés, groupés par entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const companyData = mockExportDB.getContactsByCompany();
                  const companies = Array.from(companyData.keys()).sort();
                  
                  if (companies.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucun contact scanné pour le moment</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Les contacts scannés apparaîtront ici groupés par entreprise
                        </p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-3">
                      {companies.map(company => {
                        const data = companyData.get(company)!;
                        const contactCount = data.contacts.length;
                        
                        return (
                          <div
                            key={company}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium">{company}</h4>
                              <p className="text-sm text-gray-600">
                                {contactCount} contact{contactCount > 1 ? 's' : ''} scanné{contactCount > 1 ? 's' : ''}
                              </p>
                            </div>
                            <Button
                              onClick={() => {
                                const success = mockExportDB.downloadCSVForCompany(company);
                                if (success) {
                                  toast.success(`Export CSV généré pour ${company}`);
                                } else {
                                  toast.error('Erreur lors de l\'export');
                                }
                              }}
                              size="sm"
                              className="bg-[#CDFF00] hover:bg-[#b8e600] text-black"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Télécharger CSV
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
                
                <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-yellow-900">
                    💡 <strong>Note :</strong> Le fichier CSV contient les colonnes : Nom, Prénom, Email, Entreprise, Profession, Note, Date du scan
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Home Content Tab */}
          <TabsContent value="home">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contenu de la page d'accueil</CardTitle>
                  <CardDescription>
                    Personnalisez le message affiché aux participants
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="home-title">Titre de bienvenue</Label>
                    <Input
                      id="home-title"
                      placeholder="Bienvenue [Prénom] !"
                      value={homeTitle}
                      onChange={(e) => setHomeTitle(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisez [Prénom] pour personnaliser
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="home-content">Message principal (Markdown)</Label>
                    <Textarea
                      id="home-content"
                      placeholder="## Bienvenue !..."
                      value={homeContent}
                      onChange={(e) => setHomeContent(e.target.value)}
                      className="mt-2 min-h-[300px] font-mono text-sm"
                    />
                  </div>

                  <Button onClick={handleSaveHomeContent} className="w-full">
                    Publier les modifications
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aperçu</CardTitle>
                  <CardDescription>
                    Visualisez le rendu final
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl mb-4">{homeTitle}</h2>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{homeContent}</ReactMarkdown>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>
                  Paramètres de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="program-url">URL du programme</Label>
                  <Input
                    id="program-url"
                    type="url"
                    placeholder="https://forwarddata-2025-schedule.netlify.app/"
                    value={programUrl}
                    onChange={(e) => setProgramUrl(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cette URL sera affichée dans l'onglet Programme
                  </p>
                </div>

                <Button onClick={handleSaveProgramUrl}>
                  Enregistrer
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Participants inscrits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl">{totalParticipants}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Connexions aujourd'hui</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl">-</p>
                  <p className="text-xs text-gray-500 mt-2">Disponible avec Supabase</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total de scans</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl">-</p>
                  <p className="text-xs text-gray-500 mt-2">Disponible avec Supabase</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

# Guide d'Utilisation - AI Product Day Networking App

## 🚀 Démarrage Rapide

L'application est actuellement en mode **mock data** pour tester toutes les fonctionnalités avant l'intégration Supabase.

## 📱 Écrans et Navigation

### 1. Login Screen (`/login`)
- Cliquez sur "Scanner mon badge"
- Utilisez un des codes de test fournis :
  - `AIDAY2025001` - Marie Dupont (TechCorp)
  - `AIDAY2025002` - Thomas Martin (Innovate.io)
  - `AIDAY2025003` - Sophie Bernard (AI Start)
  - `AIDAY2025004` - Laurent Petit (Digital Solutions)
  - `AIDAY2025005` - Julie Robert (MLOps AI)

### 2. Home Screen (`/home`)
- Page d'accueil personnalisée avec le prénom du participant
- Contenu éditable depuis le backoffice admin
- Navigation via la barre inférieure

### 3. Programme Screen (`/programme`)
- Affiche l'URL du programme dans une iframe
- URL par défaut : https://forwarddata-2025-schedule.netlify.app/
- Modifiable depuis le backoffice

### 4. Networking Screen (`/networking`)
- Liste de vos contacts scannés
- Bouton flottant pour scanner de nouveaux contacts
- Ajout de notes personnelles (auto-save après 1s)
- Compteur de contacts
- Protection contre :
  - Scanner son propre badge
  - Scanner deux fois la même personne

### 5. Admin Backoffice (`/admin`)
**Identifiants de test :**
- Email : `admin@aiproductday.com`
- Password : `admin123`

**Fonctionnalités :**
- **Participants** : Simulation d'import CSV (sera connecté à Supabase)
- **Home** : Édition du contenu de la page d'accueil avec prévisualisation Markdown
- **Config** : Modification de l'URL du programme
- **Stats** : Statistiques basiques (complètes avec Supabase)

## 🔧 Fonctionnalités Implémentées

### ✅ Authentification
- Scan de badge QR (simulé)
- Vérification dans la base mock
- Session persistée dans localStorage
- Protection des routes

### ✅ Networking
- Scan de contacts
- Ajout de notes (max 500 caractères)
- Auto-save des notes
- Tri par heure décroissante
- États vides avec illustrations

### ✅ Administration
- Login admin séparé
- Gestion du contenu dynamique
- Configuration de l'URL du programme
- Interface d'import CSV (prête pour Supabase)

### ✅ UX/UI
- Design mobile-first
- Navigation bottom bar
- Toasts de notification
- Loading states
- Messages d'erreur contextuels
- Animations subtiles

## 📊 Structure des Données Mock

### Participants
```typescript
{
  id: string
  barcode: string (ex: "AIDAY2025001")
  name: string
  first_name: string
  email: string
  entreprise: string
  profession: string
  ticket: string
}
```

### Scans
```typescript
{
  id: string
  scanner_id: string (ID du participant qui scanne)
  scanned_id: string (ID du participant scanné)
  timestamp: Date
  note: string
}
```

### Settings
```typescript
{
  home_title: string
  home_content: string (Markdown)
  program_url: string
}
```

## 🔄 Prochaine Étape : Intégration Supabase

### Tables à créer :

1. **participants**
   - Colonnes : id, barcode, name, first_name, email, entreprise, profession, ticket
   - Index unique sur barcode
   - RLS : read own data

2. **scans**
   - Colonnes : id, scanner_id, scanned_id, timestamp, note
   - Foreign keys vers participants
   - RLS : insert/update own scans only

3. **settings**
   - Colonnes : key, value, updated_at
   - RLS : read all, write admins only

4. **admins**
   - Colonnes : id, email, password_hash
   - RLS : admins only

### Migrations nécessaires :
- Authentication avec Supabase Auth
- Row Level Security (RLS) sur toutes les tables
- Edge Function pour l'export email (avec Resend)
- Scheduled jobs pour l'envoi automatique à 20h

## 🎨 Design System

- **Couleur primaire** : Bleu (#2563eb)
- **Border radius** : 8px
- **Spacing** : Système cohérent (4, 8, 12, 16, 24px)
- **Touch targets** : Minimum 44x44px
- **Typography** : System fonts (SF Pro / Roboto)

## 📱 Responsive

- Mobile : 375-414px (optimisé)
- Tablet : 768px+ (adapté)
- Desktop : 1024px+ (centré avec max-width)

## 🐛 Test des Edge Cases

Tous les edge cases sont gérés :
- ✅ Badge invalide
- ✅ Scanner son propre badge
- ✅ Scanner deux fois la même personne
- ✅ Note trop longue (limite 500 caractères)
- ✅ État vide (aucun contact)
- ✅ Erreur réseau (simulation possible)
- ✅ CSV invalide (préparé pour validation)

## 💾 Stockage Local

Les données sont stockées dans localStorage avec les clés :
- `aiday_current_user` : Utilisateur connecté
- `aiday_scans` : Liste de tous les scans
- `aiday_settings` : Configuration de l'app

Pour réinitialiser les données de test :
```javascript
localStorage.clear()
```

## 🔐 Sécurité

**En mode mock :**
- Validation basique des données
- Protection des routes

**Avec Supabase (à venir) :**
- JWT tokens
- Row Level Security
- Rate limiting
- Validation côté serveur
- HTTPS only

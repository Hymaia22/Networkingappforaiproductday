# AI Product Day - Application de Networking
## Version Production

### 🚀 Fonctionnalités activées

#### ✅ Scanner QR Code avec caméra
- **Caméra réelle** activée via `@yudiel/react-qr-scanner`
- **Mode environnement** : utilise la caméra arrière sur mobile
- **Fallback manuel** : possibilité de saisir le code manuellement
- **Gestion d'erreurs** : message si l'accès caméra est refusé

#### ✅ Import/Export CSV
- **Format CSV** : point-virgule (`;`) avec guillemets
- **Colonnes requises** : Barcode, Name, First name, Email, Entreprise, Profession
- **Métadonnées d'import** : date et nombre de participants importés
- **Export global** : tous les participants en un seul fichier
- **Export par entreprise** : contacts scannés groupés par entreprise

#### ✅ Authentification
- **Scan de badge** : connexion via QR code du badge participant
- **Admin** : `admin@aiproductday.com` / `*******`
- **Sécurité** : session persistante dans localStorage

### 📱 Utilisation

#### Pour les participants
1. Scanner votre badge QR à la connexion
2. Scanner les badges des contacts rencontrés
3. Ajouter des notes sur chaque contact
4. Recevoir l'export en fin de journée

#### Pour les administrateurs
1. Se connecter sur `/admin`
2. Importer le CSV des participants
3. Configurer le contenu de la page d'accueil
4. Exporter les contacts par entreprise

### 🔒 Permissions requises

**Caméra** : L'application demande l'accès à la caméra pour scanner les QR codes. Sur mobile, assurez-vous d'autoriser l'accès dans les paramètres du navigateur.

**HTTPS** : La caméra ne fonctionne que sur HTTPS (ou localhost pour dev)

### 📊 Format CSV d'import

```csv
"";"Ticket";"Barcode";"Name";"First name";"Email";"Entreprise - #11";"Profession - #12";...
"";"T542-6116";"6623809483";"DUPONT";"Marie";"marie@example.com";"TechCorp";"Product Manager";...
```

### 🎨 Design

- **Couleurs** : Noir (#000000) et Jaune néon (#CDFF00)
- **Logo** : AI Product Day officiel
- **Mobile-first** : optimisé pour smartphone

### 🔧 Mentions de test supprimées

✅ Pas de codes de test sur l'écran de login
✅ Pas d'identifiants de test affichés dans l'admin
✅ Caméra réelle activée (plus de message "En production...")
✅ Interface épurée pour la production

### 📝 Données stockées

**localStorage** :
- `aiday_current_user` : utilisateur connecté
- `aiday_scans` : contacts scannés
- `aiday_settings` : configuration de l'app
- `aiday_participants` : participants importés
- `aiday_import_meta` : métadonnées d'import

### 🌐 Routes

- `/` → Redirection auto selon état connexion
- `/login` → Connexion par scan de badge
- `/home` → Page d'accueil personnalisée
- `/programme` → Programme de l'événement (iframe)
- `/networking` → Liste des contacts scannés
- `/admin` → Backoffice administrateur
- `/brand-showcase` → Vitrine des marques

### 🚨 Important

- Les données sont stockées dans **localStorage** (pas de base de données pour cette version)
- L'export CSV doit être fait **avant la fin de l'événement**
- Pour une version Supabase complète, voir la documentation backend

---

**Version** : 1.0.0 Production
**Date** : 29 Décembre 2025
**Événement** : AI Product Day 2025

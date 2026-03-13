# 🎯 AI Product Day - Application Networking

Application mobile de networking pour la conférence AI Product Day avec scan QR, gestion de contacts et export automatique.

---

## 🚀 Version Actuelle

**Version 1.0.0 PRODUCTION** - Prête pour déploiement

---

## ✨ Fonctionnalités

### 🎥 Scanner QR avec Caméra
- ✅ Caméra réelle activée (nécessite HTTPS)
- ✅ Basculement automatique vers saisie manuelle si erreur
- ✅ Gestion intelligente des permissions
- ✅ Messages d'erreur clairs et instructions

### 📱 Écrans Principaux
1. **Login** : Authentification par scan de badge QR
2. **Home** : Bienvenue personnalisée avec message configurable
3. **Programme** : Agenda de la conférence (URL configurable)
4. **Networking** : Scanner des contacts + ajout de notes
5. **Brand Showcase** : Découverte des sponsors

### 🔐 Admin Backoffice (`/admin`)
- Import CSV des participants (format point-virgule)
- Configuration du contenu (Home, Programme)
- Export global des participants
- Export par entreprise des contacts scannés
- Statistiques en temps réel

---

## 📋 Documentation

| Document | Description |
|----------|-------------|
| **[PRODUCTION_READY.md](./PRODUCTION_READY.md)** | Guide complet pour la mise en production |
| **[GUIDE_TEST_LOCAL.md](./GUIDE_TEST_LOCAL.md)** | Guide de test en développement local |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Instructions de déploiement |
| **[SECURITY.md](./SECURITY.md)** | Considérations de sécurité |

---

## ⚡ Démarrage Rapide

### Test en Local (HTTP)

**Important** : En local, la caméra ne fonctionne pas (erreur normale). L'app bascule automatiquement vers la saisie manuelle.

### Accès Admin

**URL** : `/admin`

**Identifiants par défaut** :
```
Email    : admin@aiproductday.com
Password : *****
```

⚠️ **À CHANGER avant la production !** (voir [PRODUCTION_READY.md](./PRODUCTION_READY.md))

---

## 🎨 Design

**Palette AI Product Day** :
- Noir : `#000000`
- Jaune néon : `#CDFF00`
- Hover : `#b8e600`

**Logo** : Intégré dans `/src/imports/`

---

## 📥 Import CSV

### Format Attendu
- **Séparateur** : Point-virgule (`;`)
- **Quotes** : Guillemets doubles (`"`)
- **Colonnes obligatoires** :
  - `Barcode`
  - `Name`
  - `First name`
  - `Email`
  - `Entreprise - #11`
  - `Profession - #12`
  - `Ticket`

### Exemple
```csv
"";"Ticket";"Barcode";"Name";"First name";"Email";"Entreprise - #11";"Profession - #12"
"";"Regular";"6623809483";"HUILLARD";"Corentin";"corentin@example.com";"Gorgias";"Product Director"
```

Voir le guide complet dans [GUIDE_TEST_LOCAL.md](./GUIDE_TEST_LOCAL.md)

---

## 🔒 Permissions Caméra

### En Production (HTTPS)
✅ La caméra fonctionne parfaitement
✅ L'utilisateur autorise l'accès au premier scan
✅ Scan automatique des QR codes

### En Développement (HTTP)
⚠️ Erreur attendue : `NotAllowedError: Permission denied`
✅ Basculement automatique vers saisie manuelle
✅ Application 100% fonctionnelle sans caméra

**Pourquoi ?** Les navigateurs bloquent la caméra sur HTTP pour des raisons de sécurité.

---

## 📦 Technologies

- **Frontend** : React 18.3 + TypeScript
- **Routing** : React Router v7
- **Styling** : Tailwind CSS v4
- **UI Components** : Radix UI + shadcn/ui
- **QR Scanner** : @yudiel/react-qr-scanner v2.5.0
- **Icons** : lucide-react
- **Notifications** : sonner
- **Backend** : Supabase (préconfigré, actuellement LocalStorage)

---

## 📊 État de la Base de Données

**Mode actuel** : LocalStorage (pas besoin de Supabase pour fonctionner)

**Stockage** :
- Participants importés
- Scans/Contacts par utilisateur
- Notes personnelles
- Configuration admin

**Migration future** : Supabase pour synchronisation multi-appareils et export email automatique

---

## 🐛 Erreurs Connues et Solutions

### Erreur Caméra en HTTP
```
NotAllowedError: Permission denied
```
**Solution** : Normal en développement. Utilisez la saisie manuelle ou déployez sur HTTPS.

### Import CSV échoue
**Solution** : Vérifiez le format (point-virgule + guillemets). Voir [GUIDE_TEST_LOCAL.md](./GUIDE_TEST_LOCAL.md)

### Participant non trouvé
**Solution** : Vérifiez que le barcode existe dans l'admin > Participants

---

## ✅ Checklist Production

- [ ] Changer les identifiants admin dans `/src/app/data/mockData.ts`
- [ ] Importer le CSV des vrais participants via `/admin`
- [ ] Tester la caméra sur HTTPS
- [ ] Configurer le contenu Home dans `/admin`
- [ ] Configurer l'URL du programme dans `/admin`
- [ ] Vérifier les exports CSV (global + par entreprise)

---

## 📞 Support

Pour toute question, consultez :
1. [PRODUCTION_READY.md](./PRODUCTION_READY.md) - Guide complet
2. [GUIDE_TEST_LOCAL.md](./GUIDE_TEST_LOCAL.md) - Tests locaux
3. Console du navigateur (F12) - Logs détaillés

---

## 📜 Licence

Propriété de AI Product Day - Tous droits réservés

---

**🎉 Prêt pour l'AI Product Day !**

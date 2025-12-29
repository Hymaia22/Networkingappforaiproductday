# Guide de déploiement - AI Product Day App

## 🚀 Prérequis

### Permissions navigateur
L'application nécessite l'accès à la caméra pour scanner les QR codes. Assurez-vous que :
- ✅ L'application est servie en **HTTPS** (obligatoire pour la caméra)
- ✅ Les utilisateurs autorisent l'accès caméra quand demandé

### Navigateurs compatibles
- ✅ Chrome/Edge (recommandé)
- ✅ Safari (iOS/macOS)
- ✅ Firefox
- ⚠️ Navigateurs mobiles : utiliser Chrome ou Safari

## 📋 Checklist avant l'événement

### 1. Import des participants
1. Aller sur `/admin`
2. Se connecter : `admin@aiproductday.com` / `admin123`
3. Onglet "Participants"
4. Uploader le fichier CSV avec les participants
5. Vérifier le nombre de participants importés

### 2. Configuration du contenu
1. Onglet "Home" : personnaliser le message d'accueil
2. Onglet "Config" : définir l'URL du programme
3. Tester la connexion avec un badge de test

### 3. Test du scanner
1. Ouvrir l'app sur mobile
2. Cliquer "Scanner mon badge"
3. Autoriser l'accès caméra
4. Tester avec un QR code

## 📱 Instructions pour les participants

### Connexion
1. Ouvrir l'application sur votre smartphone
2. Cliquer sur "Scanner mon badge"
3. Autoriser l'accès à la caméra
4. Scanner le QR code de votre badge

### Scanner des contacts
1. Aller sur l'onglet "Networking" (icône en bas)
2. Cliquer sur le bouton de scan (icône scan)
3. Scanner le badge du contact
4. Ajouter une note si besoin

### Navigation
- **Home** : Informations pratiques de l'événement
- **Programme** : Planning de la journée
- **Networking** : Vos contacts scannés

## 🔒 Sécurité

### Admin
- **Email** : `admin@aiproductday.com`
- **Password** : `admin123`
- ⚠️ **À CHANGER** : Modifier les credentials dans `/src/app/data/mockData.ts`

```typescript
export const mockAdminAuth = {
  login: (email: string, password: string): boolean => {
    return email === "VOTRE_EMAIL" && password === "VOTRE_PASSWORD";
  }
};
```

### Données
- Stockage : **localStorage** (navigateur)
- Pas de synchronisation cloud
- ⚠️ Ne pas vider le cache navigateur pendant l'événement

## 📊 Export des données

### Pendant l'événement
Les participants scannent leurs contacts normalement.

### Fin de journée
1. Aller sur `/admin`
2. Onglet "Export"
3. **Option 1** : Export par entreprise
   - Liste des entreprises avec nombre de contacts
   - Cliquer "Télécharger CSV" pour chaque entreprise
4. **Option 2** : Export global
   - Onglet "Participants"
   - Cliquer "Exporter tous les participants (CSV)"

### Format CSV exporté

**Par entreprise** :
```
Nom,Prénom,Email,Entreprise,Profession,Note,Date du scan
```

**Tous les participants** :
```
Barcode,Nom,Prénom,Email,Entreprise,Profession,Ticket
```

## 🐛 Dépannage

### La caméra ne s'ouvre pas
1. Vérifier que l'app est en HTTPS
2. Vérifier les permissions dans les paramètres du navigateur
3. Essayer de recharger la page
4. Fallback : utiliser "Saisir le code manuellement"

### Le badge n'est pas reconnu
1. Vérifier que le participant a été importé dans le CSV
2. Vérifier que le code-barres correspond
3. Utiliser la saisie manuelle comme alternative

### Données perdues
⚠️ **IMPORTANT** : Les données sont en localStorage
- Ne pas vider le cache
- Ne pas changer de navigateur
- Faire l'export avant de fermer le navigateur

## 📧 Support

Pour toute question ou problème pendant l'événement :
- Contacter l'équipe technique sur place
- Documentation complète : `/PRODUCTION.md`

---

**Bon événement ! 🎉**

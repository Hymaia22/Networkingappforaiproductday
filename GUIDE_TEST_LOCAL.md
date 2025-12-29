# 🧪 Guide de Test Local - AI Product Day App

## 📋 Contexte

En développement local (HTTP), **la caméra ne peut pas fonctionner** pour des raisons de sécurité navigateur.

L'application bascule automatiquement vers le **mode saisie manuelle** avec un message explicatif.

---

## ✅ Mode Saisie Manuelle (Recommandé pour les Tests)

### 🔐 Connexion (LoginScreen)

1. Cliquez sur **"Scanner mon badge"**
2. Vous verrez l'erreur : `"Accès à la caméra refusé. Utilisez la saisie manuelle ci-dessous."`
3. L'app bascule automatiquement vers **le formulaire de saisie**
4. Tapez un des codes suivants :

#### 🎯 Participants de Test Disponibles

| Barcode | Nom | Entreprise | Poste |
|---------|-----|------------|-------|
| `AIDAY2025001` | Marie Dupont | TechCorp | Product Manager |
| `AIDAY2025002` | Thomas Martin | Innovate.io | CTO |
| `AIDAY2025003` | Sophie Bernard | AI Start | Data Scientist |
| `AIDAY2025004` | Laurent Petit | Digital Solutions | CEO |
| `AIDAY2025005` | Julie Robert | MLOps AI | ML Engineer |

5. Cliquez sur **"Valider"**
6. ✅ Vous êtes connecté !

---

### 🤝 Scanner des Contacts (NetworkingScreen)

1. Sur l'écran **Networking**, cliquez sur **"Scanner un contact"**
2. Même chose : basculement automatique vers saisie manuelle
3. Tapez un barcode différent du vôtre (ex: si connecté avec `AIDAY2025001`, tapez `AIDAY2025002`)
4. ✅ Le contact est ajouté à votre liste !

---

## 🔒 Pourquoi la Caméra ne Fonctionne pas en Local ?

### Règles de Sécurité des Navigateurs

Les navigateurs modernes (Chrome, Firefox, Safari) **bloquent l'accès à la caméra** sur HTTP pour protéger la vie privée.

**Erreur typique** :
```
NotAllowedError: Permission denied
```

### Solutions

#### Option 1 : Utiliser la Saisie Manuelle ✅
- **Avantage** : Fonctionne immédiatement
- **Inconvénient** : Pas de test caméra réel
- **Recommandé pour** : Tests de développement

#### Option 2 : Configurer HTTPS en Local
```bash
# Nécessite un certificat SSL local
# Configuration complexe, non recommandé pour tests rapides
```

#### Option 3 : Déployer sur un Domaine HTTPS 🚀
- **Avantage** : Caméra fonctionne parfaitement
- **Recommandé pour** : Tests finaux avant production

---

## 🧪 Scénario de Test Complet

### 1️⃣ Test Connexion

```
✅ Ouvrir l'app
✅ Cliquer "Scanner mon badge"
✅ Voir le message d'erreur caméra
✅ L'app bascule automatiquement en saisie manuelle
✅ Taper : AIDAY2025001
✅ Valider
✅ Vérifier : Redirection vers /home avec "Bienvenue Marie !"
```

### 2️⃣ Test Networking

```
✅ Aller sur l'onglet "Networking"
✅ Cliquer "Scanner un contact"
✅ Taper : AIDAY2025002
✅ Valider
✅ Vérifier : Thomas Martin apparaît dans la liste
✅ Cliquer sur le contact
✅ Ajouter une note : "Discuté de l'IA générative"
✅ Sauvegarder (auto-save)
✅ Vérifier : La note est bien enregistrée
```

### 3️⃣ Test Admin

```
✅ Aller sur /admin
✅ Se connecter : admin@aiproductday.com / admin123
✅ Onglet "Participants" : Vérifier les 5 participants par défaut
✅ Onglet "Stats" : Vérifier les statistiques
✅ Onglet "Export" : Télécharger le CSV global
✅ Tester l'export par entreprise (TechCorp, Innovate.io, etc.)
```

### 4️⃣ Test Import CSV

```
✅ Dans /admin > Participants
✅ Préparer un fichier CSV avec le format point-virgule
✅ Uploader le fichier
✅ Vérifier : Nombre de participants importés affiché
✅ Vérifier : Date d'import mise à jour
✅ Tester une connexion avec un nouveau barcode importé
```

---

## 🎯 Exemple de Fichier CSV pour Test

Créez un fichier `test_participants.csv` :

```csv
"";"Ticket";"Barcode";"Date";"Day";"Session";"Ticket";"Category";"Seating";"Name";"First name";"Email";"Purchaser name";"Purchaser first name";"Purchaser email";"Order";"Origin";"Operator";"Payment";"Price";"Amount repaid";"Discount";"Discount amount";"Authorization";"Paid";"Valid";"Used";"Date of use";"Day of use";"Checkpoint";"How Did You Hear About Us? (Order) - #162835";"Entreprise - #11";"Profession - #12";"I agree to share my personal information (name, email address) with our sponsors. - #162833";"I agree to share my company information (company name, role) with our sponsors. - #162834";"Détails"
"";"T001";"TEST001";"2025-12-29 10:00";"2025-12-29";"";"VIP";"";"";"DURAND";"Alice";"alice@example.com";"DURAND";"Alice";"alice@example.com";"C001";"web";"";"Card";"299.00";"0.00";"";"0";"";"Yes";"Yes";"No";"0000-00-00 00:00";"0000-00-00";"";"LinkedIn";"StartupX";"CEO";"1";"1";""
"";"T002";"TEST002";"2025-12-29 10:15";"2025-12-29";"";"Regular";"";"";"MARTIN";"Bob";"bob@example.com";"MARTIN";"Bob";"bob@example.com";"C002";"web";"";"Card";"199.00";"0.00";"";"0";"";"Yes";"Yes";"No";"0000-00-00 00:00";"0000-00-00";"";"Twitter";"BigCorp";"CTO";"1";"1";""
```

---

## ✅ Checklist de Test

- [ ] ✅ Connexion avec saisie manuelle fonctionne
- [ ] ✅ Message d'erreur caméra s'affiche correctement
- [ ] ✅ Basculement automatique vers saisie manuelle
- [ ] ✅ Instructions claires affichées
- [ ] ✅ Ajout de contacts en saisie manuelle
- [ ] ✅ Notes enregistrées et affichées
- [ ] ✅ Import CSV fonctionne
- [ ] ✅ Export global CSV téléchargeable
- [ ] ✅ Export par entreprise fonctionne
- [ ] ✅ Statistiques affichées correctement
- [ ] ✅ Navigation entre écrans fluide

---

## 🚀 Test Final avec Caméra (Production)

### Pré-requis
- ✅ Application déployée sur **domaine HTTPS**
- ✅ Navigateur à jour (Chrome/Firefox/Safari)
- ✅ Webcam/Caméra fonctionnelle

### Procédure
1. Ouvrir l'app sur HTTPS
2. Cliquer "Scanner mon badge"
3. **Autoriser** l'accès caméra dans le popup navigateur
4. Présenter un QR code devant la caméra
5. ✅ Connexion automatique !

### Génération de QR Codes pour Tests

**En ligne** :
- https://www.qr-code-generator.com/
- Taper le barcode : `AIDAY2025001`
- Télécharger le QR code
- Présenter devant la caméra

**Avec Node.js** :
```bash
npm install qrcode
node -e "require('qrcode').toFile('badge.png', 'AIDAY2025001')"
```

---

## 📊 Logs de Debug

Si vous rencontrez des problèmes, ouvrez la **Console Développeur** (F12) :

### Erreurs Normales en HTTP
```
QR Scanner Error: NotAllowedError: Permission denied
```
✅ **Normal** : C'est attendu en HTTP local

### Erreurs à Investiguer
```
Error: Participant not found
```
❌ Vérifiez que le barcode existe dans la base

```
CSV Import Error: Invalid format
```
❌ Vérifiez le format CSV (point-virgule + guillemets)

---

## 💡 Astuces

### Test Rapide
Utilisez les barcodes courts pour aller vite :
- `AIDAY2025001` → Marie
- `AIDAY2025002` → Thomas
- etc.

### Test Multi-Utilisateurs
Ouvrez plusieurs onglets en navigation privée avec différents comptes pour simuler plusieurs participants.

### Reset Complet
Si besoin de repartir à zéro :
1. Ouvrir la Console (F12)
2. Aller dans "Application" > "Local Storage"
3. Supprimer toutes les entrées
4. Recharger la page

---

## ✅ Conclusion

**L'erreur caméra est normale en développement local HTTP.**

L'application est conçue pour :
1. ✅ Détecter l'erreur automatiquement
2. ✅ Basculer vers la saisie manuelle
3. ✅ Informer l'utilisateur clairement
4. ✅ Fonctionner parfaitement sans caméra

**Pour tester la caméra réelle → Déployer sur HTTPS** 🚀

---

**Bon test ! 🎉**

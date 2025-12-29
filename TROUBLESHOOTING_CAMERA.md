# 📸 Résolution des Problèmes de Caméra

## Erreur : "Permission denied" / "Accès refusé"

Cette erreur apparaît quand le navigateur bloque l'accès à la caméra. Voici comment la résoudre :

---

## ✅ Solutions par Navigateur

### 🌐 Google Chrome / Edge / Brave

1. **Vérifier HTTPS**
   - ✅ L'URL doit commencer par `https://`
   - ❌ `http://` ne permet PAS l'accès à la caméra
   - 💡 En local : utilisez `localhost` (autorisé même en HTTP)

2. **Autoriser la caméra**
   - Cliquez sur l'icône 🔒 (ou ⓘ) à gauche de l'URL
   - Cliquez sur "Paramètres du site"
   - Trouvez "Caméra" → Sélectionnez "Autoriser"
   - Rechargez la page (F5)

3. **Si le problème persiste**
   ```
   chrome://settings/content/camera
   ```
   - Vérifiez que la caméra n'est pas bloquée globalement
   - Ajoutez votre site dans "Autorisé"

### 🦊 Firefox

1. **Autoriser la caméra**
   - Cliquez sur l'icône 🔒 à gauche de l'URL
   - Cliquez sur "Connexion sécurisée"
   - Trouvez "Caméra" → Cochez "Autoriser"
   - Rechargez la page

2. **Paramètres avancés**
   ```
   about:permissions
   ```
   - Trouvez votre site
   - Autorisez "Utiliser la caméra"

### 🧭 Safari (macOS/iOS)

1. **macOS**
   - Safari → Préférences → Sites web → Caméra
   - Trouvez votre site → Sélectionnez "Autoriser"

2. **iOS/iPad**
   - Réglages → Safari → Caméra
   - Sélectionnez "Autoriser"
   - Ou : Réglages → [Votre App] → Caméra → Activer

---

## 🔧 Vérifications Techniques

### 1. HTTPS Obligatoire

**❌ Ne fonctionne PAS :**
```
http://example.com
http://192.168.1.100
```

**✅ Fonctionne :**
```
https://example.com
https://monsite.com
http://localhost:3000      ← Exception : localhost est autorisé
http://127.0.0.1:3000      ← Exception : 127.0.0.1 est autorisé
```

### 2. Permissions Système

**macOS :**
```
Préférences Système → Sécurité et confidentialité → Caméra
→ Cochez votre navigateur
```

**Windows :**
```
Paramètres → Confidentialité → Caméra
→ Autoriser les applications de bureau à accéder à votre caméra
```

**Linux :**
```bash
# Vérifier que la caméra est détectée
ls /dev/video*

# Vérifier les permissions
ls -l /dev/video0
```

### 3. Caméra en Cours d'Utilisation

Si vous voyez : **"La caméra est déjà utilisée"**
- Fermez toutes les autres applications utilisant la caméra
- Fermez tous les onglets du navigateur
- Redémarrez le navigateur

---

## 🚀 Solution de Secours : Saisie Manuelle

**Si la caméra ne fonctionne toujours pas :**

1. Cliquez sur "Saisir le code manuellement"
2. Tapez le code du badge (ex: `6623809483`)
3. Cliquez sur "Valider"

✅ Cette méthode fonctionne **sans caméra** et **sans HTTPS**.

---

## 🎯 Pour les Développeurs

### Test en Local

**Option 1 : localhost (recommandé)**
```bash
npm run dev
# Accédez à http://localhost:5173
```

**Option 2 : HTTPS local avec certificat**
```bash
# Créer un certificat auto-signé
npm install -g mkcert
mkcert localhost 127.0.0.1

# Lancer avec HTTPS
vite --https
```

**Option 3 : Tunnel HTTPS (ngrok, localtunnel)**
```bash
# Installer ngrok
npm install -g ngrok

# Exposer votre app locale en HTTPS
ngrok http 5173
# → https://abc123.ngrok.io
```

### Détection des Erreurs

```typescript
const handleError = (error: any) => {
  switch (error.name) {
    case 'NotAllowedError':
      // Permission refusée par l'utilisateur
      console.log('User denied camera access');
      break;
      
    case 'NotFoundError':
      // Aucune caméra détectée
      console.log('No camera found');
      break;
      
    case 'NotReadableError':
      // Caméra déjà utilisée
      console.log('Camera already in use');
      break;
      
    case 'NotSupportedError':
      // HTTPS requis
      console.log('HTTPS required');
      break;
      
    default:
      console.log('Unknown error:', error);
  }
};
```

---

## 📱 Mobile (iOS/Android)

### iOS Safari
1. Réglages → Safari → Caméra → "Demander" ou "Autoriser"
2. Réglages → Confidentialité → Caméra → Safari → Activer
3. Rechargez la page et acceptez la permission

### Android Chrome
1. Paramètres → Applications → Chrome → Autorisations → Appareil photo → Autoriser
2. Ou : Cliquez sur 🔒 dans l'URL → Autorisations du site → Appareil photo → Autoriser

---

## ⚠️ Erreurs Fréquentes

### "getUserMedia is not defined"
➡️ **Cause** : Pas en HTTPS  
➡️ **Solution** : Utilisez HTTPS ou localhost

### "Permission denied" même après autorisation
➡️ **Cause** : Cache du navigateur  
➡️ **Solution** : 
   1. Ouvrez DevTools (F12)
   2. Cliquez droit sur le bouton de rafraîchissement
   3. Sélectionnez "Vider le cache et actualiser"

### "No camera found" sur desktop
➡️ **Cause** : Caméra désactivée ou déconnectée  
➡️ **Solution** : 
   1. Vérifiez que la caméra est branchée
   2. Vérifiez le Gestionnaire de périphériques (Windows)
   3. Vérifiez les Informations Système (macOS)

### Caméra floue ou pixelisée
➡️ **Cause** : Mauvaise qualité de caméra ou faible éclairage  
➡️ **Solution** : 
   1. Augmentez l'éclairage
   2. Nettoyez la lentille de la caméra
   3. Utilisez la saisie manuelle en dernier recours

---

## 📊 Checklist de Débogage

- [ ] Site en HTTPS (ou localhost)
- [ ] Permission caméra autorisée dans le navigateur
- [ ] Permission caméra autorisée dans le système d'exploitation
- [ ] Caméra pas utilisée par une autre application
- [ ] Caméra détectée dans les paramètres système
- [ ] Navigateur à jour
- [ ] Page rechargée après changement de permissions
- [ ] Cache du navigateur vidé

---

## 💡 Recommandations pour la Production

### Pour les Participants
1. **Message d'accueil** : Informez qu'il faut autoriser la caméra
2. **Mode secours** : Proposez toujours la saisie manuelle
3. **Test préalable** : Testez la caméra avant l'événement
4. **Support on-site** : Prévoyez du personnel pour aider

### Pour les Admins
1. **Stand de test** : Zone dédiée pour tester la caméra avant l'événement
2. **QR codes imprimés** : Codes bien visibles et de bonne qualité
3. **Backup codes** : Possibilité de saisir manuellement en cas de problème
4. **Wifi stable** : Connexion internet fiable

---

## 🆘 Support d'Urgence

**Le jour de l'événement, si un participant a un problème :**

1. **Solution immédiate** : Cliquez sur "Saisir le code manuellement"
2. **Demandez le code** du badge (numéro sur le badge)
3. **Tapez le code** dans le champ de saisie
4. **Validez** → Connexion réussie !

✅ Temps de résolution : **< 10 secondes**

---

**Date** : 29 décembre 2024  
**Application** : AI Product Day - Networking  
**Support** : Ce document est fourni comme aide pour résoudre les problèmes de caméra

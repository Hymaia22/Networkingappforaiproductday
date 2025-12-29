# Sécurité - Configuration Admin

## ⚠️ IMPORTANT - À faire AVANT l'événement

Les identifiants admin par défaut sont :
- **Email** : `admin@aiproductday.com`
- **Password** : `admin123`

**Ces identifiants DOIVENT être changés pour la production !**

## 🔒 Comment changer les identifiants admin

### Étape 1 : Modifier le fichier mockData.ts

Ouvrir le fichier `/src/app/data/mockData.ts` et trouver cette section :

```typescript
// Admin mock auth
export const mockAdminAuth = {
  login: (email: string, password: string): boolean => {
    // Simple mock admin - in production, this would be in Supabase
    return email === "admin@aiproductday.com" && password === "admin123";
  }
};
```

### Étape 2 : Remplacer par vos identifiants

```typescript
// Admin mock auth
export const mockAdminAuth = {
  login: (email: string, password: string): boolean => {
    return email === "VOTRE_EMAIL@example.com" && password === "VOTRE_MOT_DE_PASSE_SECURISE";
  }
};
```

### Étape 3 : Rebuild l'application

```bash
npm run build
```

## 🛡️ Bonnes pratiques

### Mot de passe sécurisé
- ✅ Minimum 12 caractères
- ✅ Mélange de majuscules, minuscules, chiffres
- ��� Caractères spéciaux
- ❌ Pas de mots du dictionnaire
- ❌ Pas d'informations personnelles

Exemple de mot de passe fort :
```
Ai#Prod2025!SecureEvent@Day
```

### Conservation des identifiants
- ✅ Noter les identifiants dans un gestionnaire de mots de passe
- ✅ Partager uniquement avec les admins autorisés
- ✅ Ne jamais les afficher publiquement
- ❌ Ne pas les envoyer par email non chiffré

## 🔐 Recommandations supplémentaires

### Pour une sécurité maximale

1. **Utiliser Supabase Auth** (version complète)
   - Authentification sécurisée
   - Hash des mots de passe
   - Sessions gérées côté serveur
   - MFA (authentification multi-facteurs) optionnel

2. **Variables d'environnement**
   - Ne jamais commit les credentials dans le code
   - Utiliser des variables d'environnement
   - Exemple avec `.env` :
     ```
     VITE_ADMIN_EMAIL=admin@example.com
     VITE_ADMIN_PASSWORD=SecurePassword123!
     ```

3. **HTTPS obligatoire**
   - Toujours servir l'app en HTTPS
   - Empêche l'interception des données

## 📝 Checklist de sécurité

Avant le déploiement, vérifier :

- [ ] Identifiants admin changés
- [ ] Mot de passe sécurisé (12+ caractères)
- [ ] Application servie en HTTPS
- [ ] Identifiants notés en lieu sûr
- [ ] Équipe technique informée
- [ ] Accès admin testé

## 🚨 En cas de compromission

Si les identifiants admin sont compromis :

1. **Immédiatement** :
   - Changer les identifiants dans le code
   - Rebuild et redéployer l'application

2. **Après l'événement** :
   - Vérifier les logs d'activité admin
   - Examiner les exports CSV suspects
   - Documenter l'incident

## 📞 Support

Pour toute question de sécurité :
- Contacter l'équipe DevOps
- Documentation officielle : `/PRODUCTION.md`

---

**La sécurité de l'événement dépend de vous ! 🔒**

# Give to God - Boutique en Ligne Officielle de Prêt-à-Porter

Bienvenue sur le projet complet de la boutique en ligne **Give to God**, une plateforme e-commerce moderne, rapide, élégante et entièrement en français, connectée à Firebase Firestore et dotée de l'intelligence artificielle Gemini.

---

## 🌟 Choix Technologiques & Pourquoi cette Architecture ?

Pour un débutant qui souhaite une solution professionnelle, nous avons choisi la stack suivante :
1. **Frontend : React 19 + Vite + Tailwind CSS**
   - **Pourquoi :** Ultra-rapide au chargement, affichage moderne et fluide, interface adaptée mobile-first (car plus de 80% des clients visiteront votre boutique depuis leur smartphone).
2. **Base de Données & Temps Réel : Firebase Firestore**
   - **Pourquoi :** Aucune maintenance de serveur requise, synchronisation instantanée (dès que vous changez le nom ou le téléphone dans l'admin, tout le site se met à jour en 1 seconde), niveau gratuit très généreux.
3. **Sécurité & Authentification : Firebase Auth**
   - **Pourquoi :** Connexion sécurisée avec Google ou email/mot de passe avec sessions protégées.
4. **Backend & IA : Node.js Express + Google Gemini 3.8 Flash**
   - **Pourquoi :** Génération automatique de descriptions de vêtements haut de gamme et d'accroches promotionnelles en français sans exposer vos clés d'API au navigateur.

---

## 📁 Structure du Projet

```
├── firebase-blueprint.json       # Spécification du schéma de base de données Firestore
├── firestore.rules               # Règles de sécurité ABAC de la base de données
├── firebase-applet-config.json   # Configuration de connexion Firebase
├── server.ts                     # Serveur Express fullstack avec endpoints IA Gemini
├── index.html                    # Entrée HTML avec typographies haute couture & SEO
├── src/
│   ├── main.tsx                  # Point de montage de l'application
│   ├── App.tsx                   # Routeur de navigation & modals
│   ├── firebase/
│   │   └── config.ts             # Initialisation de Firebase Firestore & Auth
│   ├── types/
│   │   └── store.ts              # Modèles TypeScript (Produits, Offres, Commandes, Paramètres)
│   ├── data/
│   │   └── seedData.ts           # Données de démo prêtes à l'emploi (vêtements, prix en FCFA)
│   ├── context/
│   │   ├── AuthContext.tsx       # Gestion des sessions et de l'administrateur
│   │   ├── StoreContext.tsx      # Paramètres dynamiques (Nom, Téléphone WhatsApp, Slogan, Devises)
│   │   ├── ProductsContext.tsx   # Catalogue produits & gestion des offres
│   │   ├── CartContext.tsx       # Panier d'achat persistant (localStorage)
│   │   └── OrdersContext.tsx     # Enregistrement des commandes & calcul des statistiques
│   ├── components/
│   │   ├── Header.tsx            # Barre de navigation, bandeau d'annonce et badge panier
│   │   ├── Footer.tsx            # Pied de page dynamique, réseaux sociaux et garanties
│   │   ├── ProductCard.tsx       # Carte produit épurée avec photos et prix
│   │   ├── ProductDetailModal.tsx# Fiche produit complète (galerie, sélection taille & couleur)
│   │   ├── CartDrawer.tsx        # Panier latéral avec calculs et commande WhatsApp directe
│   │   └── WhatsAppFloatingButton.tsx # Bouton WhatsApp flottant 24/7
│   └── pages/
│       ├── HomePage.tsx          # Accueil (Hero banner, nouvelles offres, pièces phares, avis)
│       ├── ShopPage.tsx          # Boutique avec recherche en direct, filtres de catégories et tailles
│       ├── OffersPage.tsx        # Offres & promotions avec réductions et dates de fin
│       ├── AboutPage.tsx         # Notre Histoire & Vision de la marque
│       ├── ContactPage.tsx       # Formulaire de contact, coordonnées et FAQ interactive
│       ├── CheckoutPage.tsx      # Validation de commande & bouton "Commander via WhatsApp"
│       └── AdminPage.tsx         # Espace d'administration complet
```

---

## 🚀 Guide de Démarrage Rapide en Local

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancer l'application
```bash
npm run dev
```
Ouvrez votre navigateur sur `http://localhost:3000`.

---

## 🔐 Comment Accéder à l'Espace Administrateur ?

L'espace admin est accessible :
- En cliquant sur le lien discret **« Espace Gestion »** situé tout en bas à droite dans le pied de page (footer) ou en naviguant sur `/admin`.
- Pour vous connecter :
  - **Email administrateur :** `adjechrist58@gmail.com`
  - **Mot de passe maître rapide :** `give2god` (ou connexion directe en 1 clic avec votre compte Google).

---

## 🛠️ Guide Pratique Débutant

### A. Comment modifier le nom du magasin et le numéro de téléphone ?
1. Rendez-vous dans l'**Espace Gestion** (`/admin`).
2. Cliquez sur l'onglet **« Paramètres Boutique »**.
3. Modifiez :
   - Le **Nom de la boutique** (ex: *Give to God*).
   - Le **Numéro WhatsApp / Téléphone** (ex: *0710071833*).
   - L'indicatif pays (ex: *+225*).
   - Les frais de livraison ou le bandeau d'annonce du haut.
4. Cliquez sur **« Enregistrer toutes les modifications »**.
5. **Résultat instantané :** Le nom et le téléphone se mettent à jour immédiatement sur tout le site (en-tête, pied de page, boutons de commande WhatsApp, lien flottant et titre de l'onglet du navigateur).

### B. Comment ajouter une nouvelle offre promotionnelle ?
1. Dans l'espace admin, cliquez sur l'onglet **« Offres »**.
2. Cliquez sur le bouton noir **« Nouvelle Promotion »**.
3. Remplissez les informations (titre, ancien prix, nouveau prix promo, date de fin, badge).
   - *Astuce IA :* Cliquez sur **« Générer slogan promo »** pour que l'IA Gemini vous rédige une formule percutante !
4. Cochez **« Offre active et visible sur le site »** puis validez.
5. L'offre apparaît instantanément sur la page d'accueil dans **« Nouvelles Offres du Moment »** et sur la page **« Offres & Promotions »**. Dès que la date de fin est dépassée, elle disparaît automatiquement.

### C. Comment ajouter ou modifier un produit ?
1. Dans l'espace admin, cliquez sur l'onglet **« Produits »** puis sur **« Nouveau Produit »**.
2. Renseignez le nom, la catégorie, le prix et les tailles disponibles.
3. Cliquez sur **« Générer la description »** pour laisser l'IA Gemini rédiger un texte élégant, haut de gamme et inspirant en français.
4. Enregistrez pour publier le produit dans la boutique.

---

## 🌐 Guide de Mise en Ligne Gratuit avec Nom de Domaine Personnalisé

### Méthode Recommandée : Déploiement sur Vercel (Gratuit)
1. Créez un compte gratuit sur [Vercel](https://vercel.com).
2. Poussez votre code sur GitHub ou importez directement votre dossier.
3. Dans les paramètres du projet sur Vercel :
   - Allez dans **Settings > Environment Variables**.
   - Ajoutez `GEMINI_API_KEY` avec votre clé Google AI Studio.
4. Cliquez sur **Deploy**. Votre boutique est en ligne avec un lien sécurisé en HTTPS (ex: `give-to-god.vercel.app`).

### Associer votre propre nom de domaine (ex: `givetogod.store` ou `givetogod.ci`)
1. Achetez votre nom de domaine chez un registrar (Namecheap, Hostinger, OVH, etc.).
2. Dans votre tableau de bord Vercel, allez dans **Settings > Domains**.
3. Tapez votre domaine (ex: `givetogod.store`).
4. Vercel vous donnera deux enregistrements DNS simples (un `A Record` ou un `CNAME`).
5. Copiez-les dans la zone DNS de votre registrar.
6. En quelques minutes, votre boutique est accessible sur votre propre adresse avec certificat SSL (cadenas vert) activé automatiquement !

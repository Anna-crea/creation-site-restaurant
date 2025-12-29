
# L'Éclat de Saveurs - Plateforme Gastronomique Intelligente

## 🎯 Concept
Ce projet est une application web vitrine pour un restaurant de haute gastronomie, intégrant des fonctionnalités d'Intelligence Artificielle générative pour sublimer l'expérience utilisateur.

## 🚀 Technologies Utilisées
- **Frontend** : React 19 (Hooks, Context, Memo).
- **Style** : Tailwind CSS (Design System sur mesure : "Stitch UI").
- **IA** : Google Gemini API (@google/genai).
  - **Gemini 3 Flash** : Recommandations de menus et Conciergerie (Chatbot).
  - **Gemini 3 Pro Image** : Génération d'images culinaires 2K photoréalistes.
- **Visualisation** : Recharts pour le dashboard administrateur.
- **Icônes** : Lucide React.

## 🛠 Fonctionnalités Clés
1. **Galerie Culinaire IA** : Les utilisateurs peuvent générer une vision artistique de chaque plat en haute définition grâce à l'IA.
2. **Conciergerie Digitale** : Un chatbot "Chatbase-style" qui agit comme un majordome pour répondre aux questions sur la carte et le restaurant.
3. **Système de Réservation Hybride** : Un tunnel de réservation natif combiné à une intégration JotForm/Airtable.
4. **Dashboard Admin** : Analyse des ventes, gestion des stocks et suivi des réservations avec pagination.
5. **UI "Stitch"** : Un design luxueux utilisant des bordures en pointillés dorés, du glassmorphism et des textures de papier.

## 🔑 Installation & API
Le projet nécessite une clé API Google Gemini pour les fonctionnalités d'IA.
- **Localement** : La clé est lue depuis `process.env.API_KEY`.
- **En ligne** : Le site utilise `window.aistudio.openSelectKey()` pour permettre au testeur (le professeur) d'utiliser sa propre clé en toute sécurité.

## 📂 Structure du Projet
- `App.tsx` : Point d'entrée, gestion du routing et du panier.
- `geminiService.ts` : Logique d'interaction avec les modèles d'IA.
- `views/` : Contient les différentes pages (Home, Menu, Reservation, Admin).
- `components/` : Composants réutilisables (Navigation, Chat, Filtres).
- `constants.ts` : Base de données statique du menu et des options.

---
*Projet réalisé dans le cadre d'un exercice de développement Full-Stack & UI/UX.*

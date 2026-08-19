#!/bin/bash
echo "🔧 Setup production CAFM Pro"
echo "============================"

# 1. Installer les dépendances
echo "📦 Installation des dépendances..."
cd backend && npm ci --production
cd ../frontend && npm ci
cd ..

# 2. Générer Prisma Client
echo "🗃️  Génération Prisma Client..."
cd backend && npx prisma generate
cd ..

# 3. Générer les icônes PWA
echo "🎨 Génération des icônes..."
cd frontend && npm run icons
cd ..

# 4. Build frontend
echo "🏗️  Build frontend..."
cd frontend && npm run build
cd ..

# 5. Vérification finale
echo "✅ Vérification..."
[ -d "frontend/dist" ] && echo "✅ Build frontend OK" || echo "❌ Build frontend MANQUANT"
[ -f "backend/.env" ] && echo "✅ .env backend présent" || echo "⚠️  .env backend manquant"

echo ""
echo "🚀 Prêt pour le déploiement !"
echo "   - Backend: docker-compose up -d"
echo "   - Frontend: vercel --prod"

# 🤝 Guide de Contribution - ReclamTrack

Merci de votre intérêt pour contribuer à ReclamTrack ! Ce document vous guidera à travers le processus de contribution.

## 📋 Table des Matières

1. [Code de Conduite](#code-de-conduite)
2. [Comment Contribuer](#comment-contribuer)
3. [Standards de Code](#standards-de-code)
4. [Processus de Pull Request](#processus-de-pull-request)
5. [Conventions de Commit](#conventions-de-commit)
6. [Structure du Projet](#structure-du-projet)

---

## 📜 Code de Conduite

### Notre Engagement

Nous nous engageons à faire de la participation à ce projet une expérience sans harcèlement pour tous, indépendamment de :
- L'âge
- La taille corporelle
- Le handicap
- L'ethnicité
- L'identité et l'expression de genre
- Le niveau d'expérience
- La nationalité
- L'apparence personnelle
- La race
- La religion
- L'identité et l'orientation sexuelle

### Comportements Attendus

- Utiliser un langage accueillant et inclusif
- Respecter les points de vue et expériences différents
- Accepter gracieusement les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté
- Faire preuve d'empathie envers les autres membres

---

## 🚀 Comment Contribuer

### Signaler des Bugs

Les bugs sont suivis via les [GitHub Issues](https://github.com/votre-org/reclamtrack/issues).

**Avant de créer un bug report**, vérifiez qu'il n'existe pas déjà.

**Pour créer un bon bug report**, incluez :

- **Titre clair et descriptif**
- **Description détaillée** du problème
- **Étapes pour reproduire** le bug
- **Comportement attendu** vs **comportement actuel**
- **Screenshots** si applicable
- **Environnement** (OS, navigateur, version Node.js, etc.)

**Template de Bug Report** :

```markdown
## Description
[Description claire du bug]

## Étapes pour Reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Scroller jusqu'à '...'
4. Voir l'erreur

## Comportement Attendu
[Ce qui devrait se passer]

## Comportement Actuel
[Ce qui se passe réellement]

## Screenshots
[Si applicable]

## Environnement
- OS: [e.g. Windows 11]
- Navigateur: [e.g. Chrome 120]
- Version Node.js: [e.g. 18.17.0]
- Version de l'app: [e.g. 1.0.0]

## Informations Additionnelles
[Tout autre contexte pertinent]
```

### Suggérer des Améliorations

Les suggestions d'amélioration sont également suivies via GitHub Issues.

**Pour suggérer une amélioration**, incluez :

- **Titre clair et descriptif**
- **Description détaillée** de la fonctionnalité
- **Justification** - Pourquoi cette fonctionnalité serait utile
- **Exemples** d'utilisation
- **Alternatives considérées**

---

## 💻 Standards de Code

### TypeScript/JavaScript

#### Style de Code

Nous utilisons **ESLint** et **Prettier** pour maintenir la cohérence du code.

```bash
# Vérifier le code
npm run lint

# Formater le code
npm run format
```

#### Conventions de Nommage

```typescript
// Variables et fonctions : camelCase
const userName = 'John';
function getUserData() {}

// Classes et Types : PascalCase
class UserService {}
interface UserData {}
type UserRole = 'admin' | 'user';

// Constantes : UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// Fichiers composants : PascalCase
// Header.tsx, UserProfile.tsx

// Fichiers utilitaires : camelCase
// formatDate.ts, validateEmail.ts

// Dossiers : kebab-case
// user-profile/, auth-service/
```

#### Bonnes Pratiques

```typescript
// ✅ BON - Typage explicite
interface User {
    id: string;
    name: string;
    email: string;
}

function getUser(id: string): Promise<User> {
    return api.get(`/users/${id}`);
}

// ❌ MAUVAIS - any types
function getUser(id: any): Promise<any> {
    return api.get(`/users/${id}`);
}

// ✅ BON - Destructuring
const { name, email } = user;

// ❌ MAUVAIS
const name = user.name;
const email = user.email;

// ✅ BON - Arrow functions pour callbacks
users.map(user => user.name);

// ✅ BON - Async/await
async function fetchData() {
    try {
        const data = await api.get('/data');
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// ❌ MAUVAIS - Promises sans gestion d'erreur
function fetchData() {
    return api.get('/data');
}
```

### React/Next.js

#### Composants Fonctionnels

```typescript
// ✅ BON - Composant fonctionnel avec TypeScript
interface ButtonProps {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

export default function Button({ 
    label, 
    onClick, 
    variant = 'primary',
    disabled = false 
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant}`}
        >
            {label}
        </button>
    );
}
```

#### Hooks

```typescript
// ✅ BON - Custom hooks
function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user data
        fetchUser().then(setUser).finally(() => setLoading(false));
    }, []);

    return { user, loading };
}

// Utilisation
function Profile() {
    const { user, loading } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    if (!user) return <LoginPrompt />;
    
    return <UserProfile user={user} />;
}
```

### CSS/Tailwind

```tsx
// ✅ BON - Classes Tailwind organisées
<div className="
    flex items-center justify-between
    p-4 rounded-lg
    bg-white dark:bg-slate-900
    border border-slate-200 dark:border-slate-800
    shadow-sm hover:shadow-md
    transition-all duration-200
">
    {/* Content */}
</div>

// ✅ BON - Classes conditionnelles
<button className={`
    px-4 py-2 rounded-lg font-bold
    ${variant === 'primary' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
`}>
    {label}
</button>
```

### Backend (Node.js/Express)

```typescript
// ✅ BON - Route avec validation et gestion d'erreur
router.post('/complaints',
    authenticate,
    validate(complaintSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const complaint = await Complaint.create(req.body);
            res.status(201).json({
                success: true,
                data: complaint
            });
        } catch (error) {
            next(error);
        }
    }
);

// ✅ BON - Modèle Mongoose
const ComplaintSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'resolved', 'urgent'],
        default: 'new'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
```

---

## 🔄 Processus de Pull Request

### 1. Fork et Clone

```bash
# Fork le repository sur GitHub
# Puis clone votre fork
git clone https://github.com/votre-username/reclamtrack.git
cd reclamtrack

# Ajouter le repository original comme remote
git remote add upstream https://github.com/votre-org/reclamtrack.git
```

### 2. Créer une Branche

```bash
# Mettre à jour main
git checkout main
git pull upstream main

# Créer une nouvelle branche
git checkout -b feature/nom-de-la-fonctionnalite
# ou
git checkout -b fix/nom-du-bug
```

### 3. Développer

```bash
# Faire vos modifications
# ...

# Tester localement
npm run dev
npm run lint
npm test

# Commit (voir conventions ci-dessous)
git add .
git commit -m "feat: ajouter fonctionnalité X"
```

### 4. Push et Pull Request

```bash
# Push vers votre fork
git push origin feature/nom-de-la-fonctionnalite

# Créer une Pull Request sur GitHub
```

### 5. Checklist PR

Avant de soumettre votre PR, vérifiez :

- [ ] Le code suit les standards du projet
- [ ] Les tests passent (`npm test`)
- [ ] Le linting passe (`npm run lint`)
- [ ] La documentation est à jour
- [ ] Les commits suivent les conventions
- [ ] La PR a une description claire
- [ ] Les screenshots sont inclus (si UI)

### Template de Pull Request

```markdown
## Description
[Description claire de ce que fait cette PR]

## Type de Changement
- [ ] Bug fix (changement non-breaking qui corrige un problème)
- [ ] Nouvelle fonctionnalité (changement non-breaking qui ajoute une fonctionnalité)
- [ ] Breaking change (fix ou feature qui causerait un dysfonctionnement des fonctionnalités existantes)
- [ ] Documentation

## Comment Tester
1. [Étape 1]
2. [Étape 2]
3. [Étape 3]

## Screenshots
[Si applicable]

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai effectué une auto-review de mon code
- [ ] J'ai commenté mon code, particulièrement dans les zones difficiles
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai ajouté des tests qui prouvent que mon fix fonctionne ou que ma fonctionnalité fonctionne
- [ ] Les tests unitaires nouveaux et existants passent localement
- [ ] Tous les changements dépendants ont été mergés et publiés

## Issues Liées
Closes #[numéro de l'issue]
```

---

## 📝 Conventions de Commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

### Types

- **feat**: Nouvelle fonctionnalité
- **fix**: Correction de bug
- **docs**: Documentation uniquement
- **style**: Changements qui n'affectent pas le sens du code (espaces, formatage, etc.)
- **refactor**: Changement de code qui ne corrige pas de bug ni n'ajoute de fonctionnalité
- **perf**: Changement de code qui améliore les performances
- **test**: Ajout de tests manquants ou correction de tests existants
- **chore**: Changements aux outils de build ou dépendances

### Exemples

```bash
# Nouvelle fonctionnalité
git commit -m "feat(complaints): ajouter filtrage par catégorie"

# Correction de bug
git commit -m "fix(auth): corriger la validation du token JWT"

# Documentation
git commit -m "docs(readme): mettre à jour les instructions d'installation"

# Refactoring
git commit -m "refactor(api): simplifier la logique de validation"

# Performance
git commit -m "perf(dashboard): optimiser le chargement des KPIs"

# Tests
git commit -m "test(teams): ajouter tests pour la création d'équipe"

# Avec scope et description détaillée
git commit -m "feat(map): ajouter clustering de marqueurs

- Implémenter MarkerClusterer
- Ajouter options de configuration
- Optimiser les performances pour 1000+ marqueurs

Closes #123"
```

---

## 📁 Structure du Projet

### Frontend

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── (auth)/            # Groupe de routes auth
│   ├── (dashboard)/       # Groupe de routes dashboard
│   └── layout.tsx         # Layout racine
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   └── features/         # Composants spécifiques aux fonctionnalités
├── lib/                  # Utilitaires et helpers
│   ├── api.ts           # Client API
│   └── utils.ts         # Fonctions utilitaires
├── store/               # State management (Zustand)
│   └── authStore.ts     # Store d'authentification
├── types/               # Types TypeScript
│   └── index.ts         # Types globaux
└── styles/              # Styles globaux
    └── globals.css      # CSS global
```

### Backend

```
src/
├── models/              # Modèles Mongoose
│   ├── User.ts
│   ├── Complaint.ts
│   └── Team.ts
├── routes/              # Routes Express
│   ├── auth.ts
│   ├── complaints.ts
│   └── teams.ts
├── controllers/         # Logique métier
│   ├── authController.ts
│   └── complaintController.ts
├── middleware/          # Middlewares
│   ├── auth.ts
│   └── errorHandler.ts
└── utils/               # Utilitaires
    └── validators.ts
```

---

## 🧪 Tests

### Frontend (Jest + React Testing Library)

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
    it('renders with label', () => {
        render(<Button label="Click me" onClick={() => {}} />);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Button label="Click me" onClick={handleClick} />);
        
        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button label="Click me" onClick={() => {}} disabled />);
        expect(screen.getByText('Click me')).toBeDisabled();
    });
});
```

### Backend (Jest + Supertest)

```typescript
// complaints.test.ts
import request from 'supertest';
import app from '../app';
import { connectDB, closeDB } from '../config/database';

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await closeDB();
});

describe('POST /api/complaints', () => {
    it('should create a new complaint', async () => {
        const res = await request(app)
            .post('/api/complaints')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Water leak',
                description: 'Water leak on main street',
                category: 'water'
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('id');
    });

    it('should return 400 for invalid data', async () => {
        const res = await request(app)
            .post('/api/complaints')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: ''  // Invalid: empty title
            });

        expect(res.status).toBe(400);
    });
});
```

---

## 📞 Questions ?

Si vous avez des questions, n'hésitez pas à :

- Ouvrir une [Discussion GitHub](https://github.com/votre-org/reclamtrack/discussions)
- Contacter l'équipe : dev@reclamtrack.com
- Consulter la [Documentation](https://docs.reclamtrack.com)

---

**Merci de contribuer à ReclamTrack ! 🎉**

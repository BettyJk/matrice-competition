# Project Structure Guide

Comprehensive overview of the Capgemini Skill Forge project organization and file hierarchy.

## Directory Structure

```
capgemini-skill-forge/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn/ui component library
│   │   │   ├── accordion.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── [other UI components...]
│   │   ├── AppHeader.tsx           # Global navigation header
│   │   ├── NavLink.tsx             # Navigation link component
│   │   └── AddCompetenceDialog.tsx # Competency input dialog
│   │
│   ├── pages/
│   │   ├── Login.tsx              # Authentication page (login/signup)
│   │   ├── ActivitySelection.tsx  # Activity list and selection
│   │   ├── MatrixForm.tsx         # Competency matrix form
│   │   ├── Dashboard.tsx          # User analytics dashboard
│   │   ├── AdminDashboard.tsx     # Admin management panel
│   │   ├── NotFound.tsx           # 404 error page
│   │   └── Index.tsx              # Index page (if used)
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx            # Authentication context hook
│   │   ├── use-toast.ts           # Toast notification hook
│   │   └── use-mobile.tsx         # Mobile device detection hook
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client initialization
│   │       └── types.ts           # TypeScript types for database
│   │
│   ├── lib/
│   │   ├── competencies.ts        # Competency utilities
│   │   └── utils.ts               # General utility functions
│   │
│   ├── App.tsx                    # Root component with routing
│   ├── main.tsx                   # Application entry point
│   ├── index.css                  # Global styles
│   ├── App.css                    # App-specific styles
│   └── vite-env.d.ts              # Vite type definitions
│
├── supabase/
│   ├── config.toml                # Supabase CLI configuration
│   └── migrations/
│       └── [timestamp]_*.sql      # Database schema migrations
│
├── public/
│   └── robots.txt                 # SEO robots file
│
├── .env                           # Environment variables (git-ignored)
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── .eslintrc.js                   # ESLint configuration
├── components.json                # Shadcn/ui configuration
├── index.html                     # HTML entry point
├── package.json                   # Project dependencies
├── package-lock.json              # Dependency lock file
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.ts             # TailwindCSS configuration
├── vite.config.ts                 # Vite build configuration
├── vitest.config.ts               # Vitest testing configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # TypeScript app configuration
├── tsconfig.node.json             # TypeScript node configuration
├── README.md                      # Project documentation
├── CHANGELOG.md                   # Version history
├── CONTRIBUTING.md                # Contribution guidelines
└── bun.lockb                      # Bun lock file (optional)
```

## Key Directories Detail

### `/src/components/`
**Purpose**: Reusable React components

- **`ui/`**: Collection of low-level, unstyled UI components from Shadcn/ui
  - Used as building blocks for pages
  - Customizable and accessible
  - Examples: Button, Card, Input, Dialog, Form

- **Custom Components**: Application-specific components
  - `AppHeader.tsx`: Navigation header on protected pages
  - `AddCompetenceDialog.tsx`: Modal for adding competencies
  - Each component is self-contained and reusable

### `/src/pages/`
**Purpose**: Page-level components (one per route)

- `Login.tsx`: Entry point for new and existing users
  - Dual-tab interface (Login/Signup)
  - Email validation for @capgemini.com domain
  - Form state management

- `ActivitySelection.tsx`: Browse and select competency activities
  - List of available activities
  - Card-based layout
  - Navigation to MatrixForm

- `MatrixForm.tsx`: Main competency input interface
  - Add competencies with details
  - Set priority and status
  - Submit assessments

- `Dashboard.tsx`: Personal analytics and statistics
  - Competency count cards
  - Progress charts
  - Activity overview

- `AdminDashboard.tsx`: Admin management interface
  - User management
  - All submissions oversight
  - System statistics

- `NotFound.tsx`: 404 error page for invalid routes

### `/src/hooks/`
**Purpose**: Custom React hooks for shared logic

- `useAuth.tsx`: **Most important** - Authentication context
  - User state management
  - Session persistence
  - Admin role checking
  - Sign in/up/out functions
  - Real-time auth listeners

- `use-toast.ts`: Toast notification hook
  - Display success/error messages
  - Controlled dismissal

- `use-mobile.tsx`: Responsive design helper
  - Detect mobile devices
  - Conditional rendering

### `/src/integrations/`
**Purpose**: External service clients and configurations

- **`supabase/`**: Supabase (backend) integration
  - `client.ts`: Initialize Supabase client with API credentials
  - `types.ts`: TypeScript types for all database tables and queries

### `/src/lib/`
**Purpose**: Utility functions and helpers

- `competencies.ts`: 
  - Priority mapping
  - Status constants
  - Competency validation
  - Data transformation

- `utils.ts`:
  - Class name merging (cn utility)
  - Date formatting
  - String utilities
  - Common helpers

### `/supabase/`
**Purpose**: Database configuration and migrations

- `config.toml`: Supabase CLI configuration
  - Project settings
  - Authentication config
  - Database config

- `migrations/`: Version-controlled database changes
  - Each migration is timestamped SQL file
  - Creates/modifies tables and functions
  - Ensure schema consistency across environments

## File Naming Conventions

### Components
```
PascalCase.tsx          # React components
useHookName.tsx         # Custom hooks
util-function.ts        # Standalone utilities
```

### Folders
```
lowercase/              # Regular folders
PascalCase/             # Component folders (with index)
```

### Configuration Files
```
tailwind.config.ts      # Tool configurations
.env                    # Environment variables
.gitignore              # Git rules
```

## Import Path Aliases

The project uses path aliases for cleaner imports:

```typescript
// Instead of:
import { Button } from "../../../../components/ui/button";

// Use:
import { Button } from "@/components/ui/button";
```

**Configured in**:
- `tsconfig.json` (TypeScript)
- `vite.config.ts` (Vite build tool)

**Common aliases**:
- `@/components` → `src/components/`
- `@/pages` → `src/pages/`
- `@/hooks` → `src/hooks/`
- `@/lib` → `src/lib/`
- `@/integrations` → `src/integrations/`

## Data Flow

### Authentication Flow
```
1. User visits /login (PublicRoute)
2. useAuth hook manages login/signup
3. Supabase authenticates and stores session
4. AuthProvider updates global state
5. Protected routes check useAuth() hook
6. If authenticated, route renders normally
7. If not, redirect to /login
```

### Data Fetching Flow
```
1. useEffect in page component triggers
2. Query Supabase via client.ts
3. Update local state with results
4. Render with fetched data
5. Component re-renders on state change
```

### Component Hierarchy Example
```
App (routing + providers)
└── BrowserRouter
    └── AuthProvider (useAuth context)
        └── Routes
            ├── /login → PublicRoute
            │   └── Login
            │       ├── Input (from shadow/ui)
            │       ├── Button (from shadow/ui)
            │       └── Card (from shadow/ui)
            │
            └── /activities → ProtectedRoute
                └── ActivitySelection
                    ├── AppHeader
                    │   ├── NavLink
                    │   └── Button
                    └── Card (activity list)
```

## Testing Structure

```
src/
├── components/
│   └── Button.test.tsx          # Component tests
├── hooks/
│   └── useAuth.test.tsx         # Hook tests
├── lib/
│   └── utils.test.ts            # Utility tests
└── pages/
    └── Dashboard.test.tsx       # Page tests
```

## Environment Variables

**Required (.env file)**:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

**Optional**:
- `NODE_ENV`: Development or production mode
- Custom feature flags or API endpoints

See `.env.example` for template.

## Build Output

```
dist/                           # Production build output
├── index.html                  # Main HTML file
├── assets/
│   ├── [name].[hash].js        # Bundled JavaScript
│   ├── [name].[hash].css       # Compiled CSS
│   └── [other assets]
└── robots.txt                  # SEO configuration
```

## Performance Optimization

- **Code Splitting**: Routes are lazy loaded for faster initial load
- **Image Optimization**: Assets are minified and optimized
- **CSS Purging**: Tailwind removes unused styles
- **Asset Hashing**: Filename versioning for cache busting

---

For more information, see:
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Supabase Docs](https://supabase.com/docs)

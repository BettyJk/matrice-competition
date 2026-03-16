# Contributing to Capgemini Skill Forge

Thank you for your interest in contributing to Skill Forge! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and professional in all interactions
- Provide constructive feedback
- Help others learn and grow
- Report issues promptly

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/matrice-competition.git
   cd matrice-competition
   ```
3. **Add upstream remote** to sync with main repo:
   ```bash
   git remote add upstream https://github.com/BettyJk/matrice-competition.git
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Before you start:
- Check existing issues and pull requests to avoid duplicates
- Create an issue for significant features before starting work
- Discuss breaking changes in an issue first

### Making changes:

1. **Follow code style**:
   - Use TypeScript for type safety
   - Use functional components with hooks
   - Follow the existing naming conventions
   - Keep functions small and focused

2. **Run linter**:
   ```bash
   npm run lint
   ```
   Fix any linting errors before committing.

3. **Write comments** for complex logic:
   ```typescript
   // Explain WHY, not WHAT (code explains what)
   // Check if user has admin role before allowing access
   if (!isAdmin) {
     return <Navigate to="/activities" />;
   }
   ```

4. **Test your changes**:
   ```bash
   npm run test
   ```
   Write tests for new features and bug fixes.

### Committing:

- Write clear, descriptive commit messages:
  ```
  feat: add email validation for signup
  
  - Only allow @capgemini.com email addresses
  - Show error message if domain doesn't match
  - Prevent signup with invalid email
  ```

- Use conventional commit types:
  - `feat:` - New feature
  - `fix:` - Bug fix
  - `docs:` - Documentation
  - `style:` - Code style (formatting, semicolons, etc.)
  - `refactor:` - Code refactoring
  - `test:` - Test additions/changes
  - `chore:` - Dependency updates, config changes

## Pull Request Process

1. **Sync with main** before creating PR:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request** on GitHub:
   - Use a clear title describing the change
   - Reference related issues: `Fixes #123`
   - Describe what you've changed and why
   - Screenshot changes if UI-related

4. **Address review feedback**:
   - Make requested changes
   - Push updates to the same branch
   - Respond to comments
   - Request re-review when ready

5. **Merge**:
   - Once approved, the maintainers will merge
   - Delete your feature branch after merge

## Types of Contributions

### Bug Reports
- **Use the bug report template** if available
- **Include steps to reproduce**
- **Describe expected vs actual behavior**
- **Add relevant error messages or screenshots**

### Feature Requests
- **Check if already requested** to avoid duplicates
- **Explain the use case** and user benefit
- **Provide examples** if helpful
- **Be open to discussion** about implementation

### Documentation
- **Fix typos and unclear sentences**
- **Add examples** where helpful
- **Update outdated information**
- **Clarify complex concepts**

### Code Improvements
- **Add comments** for complex logic
- **Refactor for clarity** and maintainability
- **Improve test coverage**
- **Update dependencies** (minor versions only in basic PRs)

## Project Structure Conventions

```
src/
├── components/        # React components (UI + custom)
│   └── ui/           # Shadcn/ui components
├── pages/            # Page-level components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and helpers
├── integrations/     # External service clients
└── styles/           # Global styles
```

### Component Naming
- Functional components: `PascalCase` (e.g., `UserProfile.tsx`)
- Utility functions: `camelCase` (e.g., `formatDate.ts`)
- Hooks: `use*` prefix (e.g., `useAuth.tsx`)

### File Organization
Each component can have its own folder:
```
src/components/UserCard/
├── UserCard.tsx        # Main component
├── UserCard.test.ts    # Tests
└── UserCard.module.css # Scoped styles (if needed)
```

Or colocated tests:
```
src/components/UserCard.tsx
src/components/UserCard.test.ts
```

## Testing Guidelines

- **Unit tests** for utility functions
- **Component tests** for UI logic
- **Integration tests** for auth flows
- **Aim for 80%+ coverage** on critical paths

Example:
```typescript
import { render, screen } from '@testing-library/react';
import { Login } from './Login';

describe('Login Component', () => {
  it('shows email input field', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });
});
```

## Performance Considerations

- Use `React.memo` for expensive renders
- Lazy load routes with `Suspense`
- Memoize callbacks with `useCallback`
- Use `useMemo` for expensive computations
- Minimize bundle size with tree-shaking

## Database Changes

If modifying database schema:
1. **Create a migration** in `/supabase/migrations/`
2. **Document changes** in the migration file
3. **Update types** in `/src/integrations/supabase/types.ts`
4. **Test migration** locally before submitting PR

## Getting Help

- **Questions?** Open a discussion in GitHub Discussions
- **Stuck?** Comment on related issues or ask in PR
- **Need clarification?** Tag maintainers with @mention

## License

By contributing, you agree that your contributions will be licensed under the project's license (Proprietary - Capgemini).

---

Thank you for helping improve Capgemini Skill Forge! 🚀

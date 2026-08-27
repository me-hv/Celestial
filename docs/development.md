# CELESTIAL Developer Guide & Standards

This guide contains engineering conventions, local workflow setup, testing protocols, and contribution standards for **CELESTIAL**.

## 1. Prerequisites

- **Node.js**: `v20.x` or `v22.x` / `v24.x`
- **Package Manager**: `npm` or `pnpm`
- **PostgreSQL / Supabase CLI** (optional for local database emulator)

---

## 2. Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/me-hv/Celestial.git
cd Celestial

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Start development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

---

## 3. Development Commands

| Command                | Purpose                                                          |
| :--------------------- | :--------------------------------------------------------------- |
| `npm run dev`          | Starts Next.js development server with hot reload                |
| `npm run build`        | Builds optimized production bundle                               |
| `npm run start`        | Runs the production build server locally                         |
| `npm run lint`         | Runs ESLint analysis for code quality & Next.js rules            |
| `npm run format`       | Runs Prettier to automatically format code                       |
| `npm run format:check` | Verifies code conforms to Prettier rules without modifying files |
| `npm run typecheck`    | Runs TypeScript compiler (`tsc --noEmit`) to verify types        |
| `npm run test`         | Runs Vitest unit & integration test suite                        |
| `npm run test:watch`   | Runs Vitest in interactive watch mode                            |
| `npm run test:e2e`     | Runs Playwright end-to-end browser tests                         |

---

## 4. Code Quality & Architectural Rules

1. **Strict TypeScript**: Avoid `any`. Use discriminated unions, generics, and Zod schemas for runtime boundary safety.
2. **Domain Decoupling**: Never import React hooks or UI components inside `src/domain/` or `src/lib/ingestion/`. Domain logic must remain 100% pure TypeScript.
3. **Semantic Design Tokens**: Never hardcode hex color strings or arbitrary margin numbers in components. Always use the semantic Tailwind tokens (`text-celestial-cyan`, `bg-celestial-surface`, `border-celestial-border`).
4. **Git & Commit Conventions**: Use Conventional Commits:
   - `feat: add celestial object search scoring`
   - `fix: resolve coordinate transform edge case`
   - `docs: update data architecture diagram`
   - `test: add unit test for orbit validator`
   - `refactor: extract search provider interface`
   - `chore: update dependencies`

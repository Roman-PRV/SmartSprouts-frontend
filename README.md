# SmartSprouts Frontend

SmartSprouts Frontend is a web application component developed for the SmartSprouts educational platform. Built on React, TypeScript, and Vite, it provides a comfortable working environment for developers and lightning-fast performance.

## 1. Domain

This app helps children improve their cognitive skills.

---

## 2. Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Vitest
- ESLint + Prettier
- Husky + lint-staged

---

## 3. Installation

Clone the repository and install dependencies:

```
Frontend component:
git clone git@github.com:Roman-PRV/SmartSprouts-frontend.git
npm install
npm run dev

Backend component:
git clone git@github.com:Roman-PRV/SmartSprouts-backend.git
See the instructions in the corresponding repository.
```

## 4. Scripts

- `dev` Starts the Vite development server for local development.
- `build` Runs a full TypeScript build (tsc -b) and then compiles the app with Vite for production.
- `preview` Serves the production build locally using Vite’s preview server.
- `lint` Runs ESLint on all .ts and .tsx files in src/, automatically fixing issues.
- `format` Formats all .ts, .tsx, .css, and .md files in src/ using Prettier.
- `typecheck` Performs a full TypeScript type check without emitting output files.
- `check-config` Runs both linting and type checking to validate code quality before commits or builds.

## 5. Database Schema

## 6. Folder Structure

## 7. Development Flow

### 7.1 Pull Request Flow

```
<type>: <ticket-title> <project-prefix>-<issue-number>
```

For the full list of types check [Conventional Commits](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)

Examples:

- `feat: add dashboard screen ss-123`

### 7.2 Branch Flow

```
<issue-number>-<type>-<short-desc>
```

Examples:

- `123-feat-add-dashboard`
- `12-feat-add-user-flow`
- `34-fix-user-flow`

### 7.3 Commit Flow

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0) to handle commit messages

```
<type>: <description> <project-prefix>-<issue-number>
```

Examples:

- `feat: add dashboard component ss-45`
- `fix: update dashboard card size ss-212`

## Contributors:

- **Prokopenko Roman** github: _roman-prv_, discord: _@roman_27794_

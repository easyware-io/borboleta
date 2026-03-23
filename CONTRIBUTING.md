# Contributing to Borboleta

Thanks for your interest in contributing! Here's how to get started.

## Setup

```bash
git clone <repo-url>
cd borboleta
npm install
```

## Workflow

1. Create a branch from `main`.
2. Make your changes in `projects/borboleta/src/lib/`.
3. Export any new public API from `projects/borboleta/src/public-api.ts`.
4. Add or update tests (co-located `*.spec.ts` files).
5. Run build and tests:
   ```bash
   npm run build && npm test
   ```
6. Open a pull request.

## Code style

- **Prettier** formats all files — run `npx prettier --write .` before committing.
- **Single quotes**, 2-space indent, 100-char print width (see `.prettierrc`).
- Avoid `any` where possible; prefer `unknown` and narrowing.

## Tests

Tests use **Vitest** via Angular's `@angular/build:unit-test` builder. Globals (`describe`, `it`, `expect`, `vi`) are available without imports.

```bash
npm test                                         # Run all tests (watch mode)
npm test -- --no-watch                           # Run once
npm test -- --testPathPattern='compose-schemas'  # Run a single file
```

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for JSON Schema `oneOf`
fix: handle empty enum arrays without throwing
docs: clarify composeSchemas usage in README
```

## Adding a new JSON Schema keyword

1. Add the keyword to the `JsonSchema` interface in `json-schema.types.ts`.
2. Handle it in `applyFieldValidators()` (or `applyObjectValidators()` for structural keywords) in `to-signal-schema.ts`.
3. Add a test case in `to-signal-schema.spec.ts`.
4. Update the "Supported JSON Schema keywords" table in `README.md`.

## License

By contributing you agree that your contributions will be licensed under the [MIT License](LICENSE).

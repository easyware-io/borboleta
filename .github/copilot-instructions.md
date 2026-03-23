# Borboleta — JSON Schema to Angular Signal Forms

Borboleta converts JSON Schema definitions into Angular `@angular/forms` signal-based form schemas. It is an Angular library built with ng-packagr.

## Reference Documentation

- Signal Forms overview: https://angular.dev/guide/forms/signals/overview
- The `schema()` function (validation): https://angular.dev/guide/forms/signals/validation#the-schema-function

## Commands

```sh
npm run build                                    # Build the library (ng-packagr → dist/borboleta/)
npm test                                         # Run all Vitest tests
npm test -- --testPathPattern='borboleta.spec'   # Run a single test file
```

The test runner is **Vitest** (via Angular's `@angular/build:unit-test` builder). Test files use `describe`/`it`/`expect` from `vitest/globals` — no explicit imports needed.

## Architecture

```
projects/borboleta/
  src/
    lib/
      to-signal-schema.ts   ← toSignalSchema() — main transform function
      compose-schemas.ts     ← composeSchemas() — schema composition utility
      json-schema.types.ts   ← JsonSchema type definition
    public-api.ts            ← Barrel file — every public export must be listed here
  ng-package.json            ← ng-packagr config (entry: src/public-api.ts)
dist/borboleta/              ← Build output (not committed)
```

This is an Angular workspace with a single library project (`projectType: "library"`). There is no application project — the library is the product.

The root `tsconfig.json` maps `"borboleta"` → `"./dist/borboleta"` so consuming apps resolve the package name after building.

When adding a new JSON Schema keyword: add the keyword to `JsonSchema`, handle it in `applyFieldValidators()` (or `applyObjectValidators()` for structural keywords) in `to-signal-schema.ts`, add a test, and update the table in `README.md`.

## Angular & TypeScript Conventions

- **Angular 21**: `standalone: true` is the default — never set it explicitly in decorators.
- **Signals over decorators**: Use `input()`, `output()`, `computed()`, `signal()` — not `@Input()`, `@Output()`.
- **`inject()` over constructors**: Use `inject()` for DI, not constructor parameters.
- **OnPush by default**: Components must set `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Control flow**: Use `@if`, `@for`, `@switch` — not `*ngIf`, `*ngFor`, `*ngSwitch`.
- **Host bindings**: Use the `host` property in decorators — not `@HostBinding`/`@HostListener`.
- **Reactive forms**: Prefer Reactive forms over Template-driven.
- **Strict TypeScript**: `strict: true` plus `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`. Avoid `any`; use `unknown`.
- **Formatting**: Prettier with `printWidth: 100`, single quotes, 2-space indent.

# Borboleta 🦋

Convert JSON Schema definitions into Angular Signal Forms schema functions.

> **Requires Angular 21+** — Signal Forms are experimental. See the [Angular docs](https://angular.dev/guide/forms/signals/validation#the-schema-function) for details.

## Why "Borboleta"?

*Borboleta* is Portuguese for **butterfly** — a symbol of transformation. This library transforms [JSON Schema](https://json-schema.org/) definitions into [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) schemas, much like a caterpillar becomes a butterfly. 🦋

## Installation

```bash
npm install @easyware/borboleta
```

Peer dependencies: `@angular/core`, `@angular/common`, `@angular/forms` (all `^21.2.0`).

## Quick start

```typescript
import { signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { toSignalSchema } from '@easyware/borboleta';

const jsonSchema = {
  type: 'object',
  required: ['email', 'age'],
  properties: {
    email: { type: 'string', format: 'email' },
    age:   { type: 'number', minimum: 18, maximum: 120 },
    role:  { type: 'string', enum: ['admin', 'user', 'guest'] },
  },
};

const model = signal({ email: '', age: 0, role: '' });
const myForm = form(model, toSignalSchema(jsonSchema));
```

This generates the same validators as writing the schema by hand:

```typescript
const myForm = form(model, (s) => {
  required(s.email);
  email(s.email);
  required(s.age);
  min(s.age, 18);
  max(s.age, 120);
  validate(s.role, ({ value }) => {
    const v = value();
    if (v != null && v !== '' && !['admin', 'user', 'guest'].includes(v)) {
      return { kind: 'enum', message: 'Must be one of: admin, user, guest' };
    }
    return null;
  });
});
```

## Supported JSON Schema keywords

| JSON Schema             | Signal Forms validator        |
| ----------------------- | ----------------------------- |
| `required`              | `required()`                  |
| `enum`                  | `validate()` (custom)         |
| `minimum` / `maximum`   | `min()` / `max()`             |
| `minLength` / `maxLength` | `minLength()` / `maxLength()` |
| `pattern`               | `pattern()`                   |
| `format: "email"`       | `email()`                     |
| Nested `object`         | Recursive descent             |
| `items` (array)         | `applyEach()`                 |

## Adding custom validators

Use `composeSchemas()` to layer custom validators on top of the generated ones:

```typescript
import { form, validate, required } from '@angular/forms/signals';
import { toSignalSchema, composeSchemas } from '@easyware/borboleta';

const myForm = form(
  model,
  composeSchemas(
    toSignalSchema(jsonSchema),
    (s) => {
      // Custom: URL must use HTTPS
      validate(s.run.url, ({ value }) => {
        if (!value().startsWith('https://')) {
          return { kind: 'https', message: 'URL must use HTTPS' };
        }
        return null;
      });

      // Custom: conditional required
      required(s.monitor.url, {
        when: ({ valueOf }) => valueOf(s.monitor.isMonitored),
      });
    },
  ),
);
```

Or just call `toSignalSchema()` inside your own schema function — no utility needed:

```typescript
const myForm = form(model, (s) => {
  toSignalSchema(jsonSchema)(s);
  validate(s.run.url, /* ... */);
});
```

## API

### `toSignalSchema<T>(jsonSchema: JsonSchema): SchemaFn<T>`

Converts a JSON Schema object into an Angular Signal Forms `SchemaFn<T>`. Pass the result directly to `form()` or combine it with `composeSchemas()`.

### `composeSchemas<T>(...schemas: SchemaFn<T>[]): SchemaFn<T>`

Combines multiple schema functions into one. Each schema is called in order on the same `SchemaPathTree`, so validators accumulate.

### `JsonSchema` (type)

TypeScript interface describing the subset of JSON Schema Draft-07 that Borboleta understands.

## Development

```bash
npm install          # Install dependencies
npm run build        # Build the library (output: dist/borboleta/)
npm test             # Run tests (Vitest)
```

## License

[MIT](LICENSE)

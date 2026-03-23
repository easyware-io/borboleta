import {
  required,
  validate,
  pattern as patternValidator,
  min,
  max,
  minLength,
  maxLength,
  email,
  applyEach,
} from '@angular/forms/signals';
import type { SchemaFn } from '@angular/forms/signals';
import type { JsonSchema } from './json-schema.types';

/**
 * Converts a JSON Schema (draft-07) definition into an Angular Signal Forms
 * schema function.
 *
 * The returned function can be passed directly to `form()`:
 *
 * ```typescript
 * const model = signal<MyModel>({ ... });
 * const myForm = form(model, toSignalSchema<MyModel>(jsonSchema));
 * ```
 *
 * ### Supported JSON Schema keywords
 *
 * | JSON Schema         | Signal Forms validator |
 * |---------------------|------------------------|
 * | `required`          | `required()`           |
 * | `enum`              | `validate()` (custom)  |
 * | `minimum`/`maximum` | `min()` / `max()`      |
 * | `minLength`/`maxLength` | `minLength()` / `maxLength()` |
 * | `pattern`           | `pattern()`            |
 * | `format: "email"`   | `email()`              |
 * | nested `object`     | recursive descent      |
 * | `items` (array)     | `applyEach()`          |
 */
export function toSignalSchema<T>(jsonSchema: JsonSchema): SchemaFn<T> {
  return (schemaPath) => {
    applyObjectValidators(schemaPath as any, jsonSchema);
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function applyObjectValidators(currentPath: any, schema: JsonSchema): void {
  if (!schema.properties) return;

  const requiredFields = new Set(schema.required ?? []);

  for (const [key, propSchema] of Object.entries(schema.properties)) {
    const fieldPath = currentPath[key];

    if (requiredFields.has(key)) {
      required(fieldPath);
    }

    applyFieldValidators(fieldPath, propSchema);
  }
}

function applyFieldValidators(fieldPath: any, schema: JsonSchema): void {
  // Enum constraint — works for any type
  if (schema.enum != null) {
    const allowed = schema.enum;
    validate(fieldPath, ({ value }) => {
      const v = value();
      if (v != null && v !== '' && !allowed.includes(v as never)) {
        return { kind: 'enum', message: `Must be one of: ${allowed.join(', ')}` };
      }
      return null;
    });
  }

  // String-specific validations
  if (schema.type === 'string') {
    if (schema.format === 'email') {
      email(fieldPath);
    }
    if (schema.minLength != null) {
      minLength(fieldPath, schema.minLength);
    }
    if (schema.maxLength != null) {
      maxLength(fieldPath, schema.maxLength);
    }
    if (schema.pattern != null) {
      patternValidator(fieldPath, new RegExp(schema.pattern));
    }
  }

  // Number / integer validations
  if (schema.type === 'number' || schema.type === 'integer') {
    if (schema.minimum != null) {
      min(fieldPath, schema.minimum);
    }
    if (schema.maximum != null) {
      max(fieldPath, schema.maximum);
    }
  }

  // Nested object — recurse
  if (schema.type === 'object' && schema.properties) {
    applyObjectValidators(fieldPath, schema);
  }

  // Array items — recurse with applyEach
  if (schema.type === 'array' && schema.items && !Array.isArray(schema.items)) {
    const itemSchema = schema.items;
    applyEach(fieldPath, ((itemPath: any) => {
      if (itemSchema.type === 'object') {
        applyObjectValidators(itemPath, itemSchema);
      } else {
        applyFieldValidators(itemPath, itemSchema);
      }
    }) as any);
  }
}

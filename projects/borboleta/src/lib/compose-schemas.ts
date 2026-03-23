import type { SchemaFn } from '@angular/forms/signals';

/**
 * Combines multiple schema functions into one.
 *
 * Each schema function is called in order on the same `SchemaPathTree`,
 * so validators from all schemas accumulate on the form.
 *
 * ```typescript
 * const myForm = form(
 *   model,
 *   composeSchemas<MyModel>(
 *     toSignalSchema(jsonSchema),
 *     (s) => {
 *       validate(s.run.url, ({ value }) => {
 *         if (!value().startsWith('https://')) {
 *           return { kind: 'https', message: 'URL must use HTTPS' };
 *         }
 *         return null;
 *       });
 *     },
 *   ),
 * );
 * ```
 */
export function composeSchemas<T>(...schemas: SchemaFn<T>[]): SchemaFn<T> {
  return (schemaPath) => {
    for (const schema of schemas) {
      schema(schemaPath);
    }
  };
}

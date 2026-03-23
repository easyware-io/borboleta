/**
 * Subset of JSON Schema Draft-07 that Borboleta can convert into
 * Angular Signal Forms schema functions.
 */
export interface JsonSchema {
  $schema?: string;
  title?: string;
  description?: string;
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  enum?: unknown[];
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  items?: JsonSchema;
  additionalProperties?: boolean | JsonSchema;
  default?: unknown;
}

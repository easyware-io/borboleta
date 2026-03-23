import { toSignalSchema } from './to-signal-schema';
import type { JsonSchema } from './json-schema.types';

describe('toSignalSchema', () => {
  it('should return a function', () => {
    const schema: JsonSchema = { type: 'object', properties: {} };
    expect(typeof toSignalSchema(schema)).toBe('function');
  });

  it('should handle schema with no properties', () => {
    const schema: JsonSchema = { type: 'object' };
    expect(typeof toSignalSchema(schema)).toBe('function');
  });

  it('should handle nested object schemas', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
          },
          required: ['street'],
        },
      },
    };
    expect(typeof toSignalSchema(schema)).toBe('function');
  });

  it('should handle enum, required, and number constraints', () => {
    const schema: JsonSchema = {
      type: 'object',
      required: ['status', 'count'],
      properties: {
        status: { type: 'string', enum: ['active', 'inactive'] },
        count: { type: 'number', minimum: 0, maximum: 100 },
        label: { type: 'string', minLength: 1, maxLength: 255, pattern: '^[a-z]+$' },
        email: { type: 'string', format: 'email' },
      },
    };
    expect(typeof toSignalSchema(schema)).toBe('function');
  });
});

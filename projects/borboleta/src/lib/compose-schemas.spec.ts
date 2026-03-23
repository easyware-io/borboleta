import { composeSchemas } from './compose-schemas';

describe('composeSchemas', () => {
  it('should return a function', () => {
    const composed = composeSchemas(() => {}, () => {});
    expect(typeof composed).toBe('function');
  });

  it('should call all schema functions in order', () => {
    const order: number[] = [];
    const s1 = () => order.push(1);
    const s2 = () => order.push(2);
    const s3 = () => order.push(3);

    const composed = composeSchemas(s1, s2, s3);
    composed({} as any);

    expect(order).toEqual([1, 2, 3]);
  });

  it('should pass the same schemaPath to every function', () => {
    const received: unknown[] = [];
    const s1 = (p: any) => received.push(p);
    const s2 = (p: any) => received.push(p);

    const fakePath = { name: {} };
    composeSchemas(s1, s2)(fakePath as any);

    expect(received[0]).toBe(fakePath);
    expect(received[1]).toBe(fakePath);
  });

  it('should handle zero schemas', () => {
    const composed = composeSchemas();
    expect(() => composed({} as any)).not.toThrow();
  });
});

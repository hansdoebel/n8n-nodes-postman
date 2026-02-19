// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeSpec } from '../../nodes/Postman/resources/spec/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeSpec', () => {
	describe('getAll', () => {
		it('calls GET /apis/:id/schemas and returns full response', async () => {
			const { ctx, httpMock } = makeMockContext({ apiId: 'api-1' });
			const schemasData = { schemas: [] };
			httpMock.mockResolvedValueOnce(schemasData);
			const result = await executeSpec.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.API_SCHEMAS('api-1'));
			expect(result.json).toEqual(schemasData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('get', () => {
		it('calls GET /apis/:id/schemas/:schemaId and unwraps response.schema', async () => {
			const { ctx, httpMock } = makeMockContext({ apiId: 'api-1', schemaId: 'schema-1' });
			const schemaData = { id: 'schema-1', type: 'openapi3' };
			httpMock.mockResolvedValueOnce({ schema: schemaData });
			const result = await executeSpec.call(ctx, 'get', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.url).toBe(ENDPOINTS.API_SCHEMA('api-1', 'schema-1'));
			expect(result.json).toEqual(schemaData);
		});

		it('falls back to full response when response.schema is undefined', async () => {
			const { ctx, httpMock } = makeMockContext({ apiId: 'api-1', schemaId: 'schema-1' });
			const raw = { id: 'schema-1' };
			httpMock.mockResolvedValueOnce(raw);
			const result = await executeSpec.call(ctx, 'get', 0);
			expect(result.json).toEqual(raw);
		});
	});

	describe('create', () => {
		it('calls POST /apis/:id/schemas with type and schema in body', async () => {
			const { ctx, httpMock } = makeMockContext({
				apiId: 'api-1',
				type: 'openapi3',
				schema: '{"openapi":"3.0.0"}',
			});
			httpMock.mockResolvedValueOnce({ schema: { id: 'schema-1' } });
			await executeSpec.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.API_SCHEMAS('api-1'));
			expect(options.body).toEqual({ type: 'openapi3', schema: '{"openapi":"3.0.0"}' });
		});
	});

	describe('update', () => {
		it('calls PUT /apis/:id/schemas/:schemaId with only schema in body (no type)', async () => {
			const { ctx, httpMock } = makeMockContext({
				apiId: 'api-1',
				schemaId: 'schema-1',
				schema: '{"openapi":"3.0.1"}',
			});
			httpMock.mockResolvedValueOnce({});
			await executeSpec.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.API_SCHEMA('api-1', 'schema-1'));
			expect(options.body).toEqual({ schema: '{"openapi":"3.0.1"}' });
			expect((options.body as Record<string, unknown>).type).toBeUndefined();
		});
	});

	describe('delete', () => {
		it('calls DELETE /apis/:id/schemas/:schemaId', async () => {
			const { ctx, httpMock } = makeMockContext({ apiId: 'api-1', schemaId: 'schema-1' });
			httpMock.mockResolvedValueOnce({ schema: { id: 'schema-1' } });
			const result = await executeSpec.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.API_SCHEMA('api-1', 'schema-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeSpec.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

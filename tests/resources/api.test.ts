// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeApi } from '../../nodes/Postman/resources/api/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeApi', () => {
	describe('getAll', () => {
		it('calls GET /apis with workspaceId in qs when provided', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: 'ws-1' });
			httpMock.mockResolvedValueOnce({});
			await executeApi.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.APIS);
			expect(options.qs).toEqual({ workspaceId: 'ws-1' });
		});

		it('omits qs when workspaceId is empty', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: '' });
			httpMock.mockResolvedValueOnce({});
			await executeApi.call(ctx, 'getAll', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.qs).toBeUndefined();
		});
	});

	describe('get', () => {
		it('calls GET /apis/:id and unwraps response.api', async () => {
			const { ctx, httpMock } = makeMockContext({ apiId: 'api-1' });
			const apiData = { id: 'api-1', name: 'My API' };
			httpMock.mockResolvedValueOnce({ api: apiData });
			const result = await executeApi.call(ctx, 'get', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.url).toBe(ENDPOINTS.API('api-1'));
			expect(result.json).toEqual(apiData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});

		it('falls back to full response when response.api is undefined', async () => {
			const { ctx, httpMock } = makeMockContext({ apiId: 'api-1' });
			const raw = { id: 'api-1' };
			httpMock.mockResolvedValueOnce(raw);
			const result = await executeApi.call(ctx, 'get', 0);
			expect(result.json).toEqual(raw);
		});
	});

	describe('create', () => {
		it('calls POST /apis with name and additionalFields in body', async () => {
			const { ctx, httpMock } = makeMockContext({
				name: 'New API',
				workspaceId: '',
				additionalFields: { summary: 'A summary' },
			});
			httpMock.mockResolvedValueOnce({ api: { id: 'api-1' } });
			await executeApi.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.APIS);
			expect(options.body).toEqual({ name: 'New API', summary: 'A summary' });
			expect(options.qs).toBeUndefined();
		});

		it('includes workspaceId in qs when provided', async () => {
			const { ctx, httpMock } = makeMockContext({
				name: 'New API',
				workspaceId: 'ws-1',
				additionalFields: {},
			});
			httpMock.mockResolvedValueOnce({});
			await executeApi.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.qs).toEqual({ workspaceId: 'ws-1' });
		});
	});

	describe('update', () => {
		it('calls PUT /apis/:id with updateFields as body', async () => {
			const { ctx, httpMock } = makeMockContext({
				apiId: 'api-1',
				updateFields: { name: 'Updated API', description: 'New desc' },
			});
			httpMock.mockResolvedValueOnce({});
			await executeApi.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.API('api-1'));
			expect(options.body).toEqual({ name: 'Updated API', description: 'New desc' });
		});
	});

	describe('delete', () => {
		it('calls DELETE /apis/:id and unwraps response.api', async () => {
			const { ctx, httpMock } = makeMockContext({ apiId: 'api-1' });
			const apiData = { id: 'api-1' };
			httpMock.mockResolvedValueOnce({ api: apiData });
			const result = await executeApi.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.API('api-1'));
			expect(result.json).toEqual(apiData);
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeApi.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

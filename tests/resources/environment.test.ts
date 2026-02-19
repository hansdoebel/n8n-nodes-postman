// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeEnvironment } from '../../nodes/Postman/resources/environment/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeEnvironment', () => {
	describe('getAll', () => {
		it('calls GET /environments with workspace qs when provided', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: 'ws-1' });
			httpMock.mockResolvedValueOnce({});
			await executeEnvironment.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.ENVIRONMENTS);
			expect(options.qs).toEqual({ workspace: 'ws-1' });
		});

		it('omits qs when workspaceId is empty', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: '' });
			httpMock.mockResolvedValueOnce({});
			await executeEnvironment.call(ctx, 'getAll', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.qs).toBeUndefined();
		});
	});

	describe('get', () => {
		it('calls GET /environments/:id and unwraps response.environment', async () => {
			const { ctx, httpMock } = makeMockContext({ environmentId: 'env-1' });
			const envData = { id: 'env-1', name: 'Production' };
			httpMock.mockResolvedValueOnce({ environment: envData });
			const result = await executeEnvironment.call(ctx, 'get', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.url).toBe(ENDPOINTS.ENVIRONMENT('env-1'));
			expect(result.json).toEqual(envData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('create', () => {
		it('calls POST /environments with environment wrapper and variables', async () => {
			const vars = [{ key: 'API_URL', value: 'https://api.example.com', type: 'default' }];
			const { ctx, httpMock } = makeMockContext({
				name: 'Production',
				workspaceId: 'ws-1',
				variables: { values: vars },
			});
			httpMock.mockResolvedValueOnce({ environment: { id: 'env-1' } });
			await executeEnvironment.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.ENVIRONMENTS);
			expect(options.body).toEqual({ environment: { name: 'Production', values: vars } });
			expect(options.qs).toEqual({ workspace: 'ws-1' });
		});

		it('uses empty array when no variables provided', async () => {
			const { ctx, httpMock } = makeMockContext({
				name: 'Staging',
				workspaceId: '',
				variables: {},
			});
			httpMock.mockResolvedValueOnce({});
			await executeEnvironment.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.body).toEqual({ environment: { name: 'Staging', values: [] } });
		});
	});

	describe('update', () => {
		it('sets name and values when both provided', async () => {
			const vars = [{ key: 'API_URL', value: 'https://new.example.com', type: 'default' }];
			const { ctx, httpMock } = makeMockContext({
				environmentId: 'env-1',
				name: 'Updated Env',
				variables: { values: vars },
			});
			httpMock.mockResolvedValueOnce({});
			await executeEnvironment.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.ENVIRONMENT('env-1'));
			expect(options.body).toEqual({ environment: { name: 'Updated Env', values: vars } });
		});

		it('sends empty environment object when name is empty and no variables', async () => {
			const { ctx, httpMock } = makeMockContext({
				environmentId: 'env-1',
				name: '',
				variables: {},
			});
			httpMock.mockResolvedValueOnce({});
			await executeEnvironment.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.body).toEqual({ environment: {} });
		});
	});

	describe('delete', () => {
		it('calls DELETE /environments/:id', async () => {
			const { ctx, httpMock } = makeMockContext({ environmentId: 'env-1' });
			httpMock.mockResolvedValueOnce({ environment: { id: 'env-1' } });
			const result = await executeEnvironment.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.ENVIRONMENT('env-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeEnvironment.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

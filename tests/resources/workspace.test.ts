// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeWorkspace } from '../../nodes/Postman/resources/workspace/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeWorkspace', () => {
	describe('getAll', () => {
		it('calls GET /workspaces with no params', async () => {
			const { ctx, httpMock } = makeMockContext();
			const workspacesData = { workspaces: [] };
			httpMock.mockResolvedValueOnce(workspacesData);
			const result = await executeWorkspace.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.WORKSPACES);
			expect(options.qs).toBeUndefined();
			expect(result.json).toEqual(workspacesData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('get', () => {
		it('calls GET /workspaces/:id and unwraps response.workspace', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: 'ws-1' });
			const wsData = { id: 'ws-1', name: 'My Workspace' };
			httpMock.mockResolvedValueOnce({ workspace: wsData });
			const result = await executeWorkspace.call(ctx, 'get', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.url).toBe(ENDPOINTS.WORKSPACE('ws-1'));
			expect(result.json).toEqual(wsData);
		});
	});

	describe('create', () => {
		it('calls POST /workspaces with workspace wrapper and includes description when provided', async () => {
			const { ctx, httpMock } = makeMockContext({
				name: 'My Workspace',
				type: 'personal',
				description: 'A description',
			});
			httpMock.mockResolvedValueOnce({ workspace: { id: 'ws-1' } });
			await executeWorkspace.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.WORKSPACES);
			expect(options.body).toEqual({ workspace: { name: 'My Workspace', type: 'personal', description: 'A description' } });
		});

		it('omits description when empty string', async () => {
			const { ctx, httpMock } = makeMockContext({
				name: 'My Workspace',
				type: 'team',
				description: '',
			});
			httpMock.mockResolvedValueOnce({});
			await executeWorkspace.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect((options.body as Record<string, Record<string, unknown>>).workspace.description).toBeUndefined();
		});
	});

	describe('update', () => {
		it('calls PUT /workspaces/:id with workspace-wrapped updateFields', async () => {
			const { ctx, httpMock } = makeMockContext({
				workspaceId: 'ws-1',
				updateFields: { name: 'Updated Workspace' },
			});
			httpMock.mockResolvedValueOnce({});
			await executeWorkspace.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.WORKSPACE('ws-1'));
			expect(options.body).toEqual({ workspace: { name: 'Updated Workspace' } });
		});
	});

	describe('delete', () => {
		it('calls DELETE /workspaces/:id', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: 'ws-1' });
			httpMock.mockResolvedValueOnce({ workspace: { id: 'ws-1' } });
			const result = await executeWorkspace.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.WORKSPACE('ws-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('getGlobalVariables', () => {
		it('calls GET /workspaces/:id/global-variables', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: 'ws-1' });
			httpMock.mockResolvedValueOnce({});
			await executeWorkspace.call(ctx, 'getGlobalVariables', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.WORKSPACE_GLOBAL_VARIABLES('ws-1'));
		});
	});

	describe('updateGlobalVariables', () => {
		it('calls PUT /workspaces/:id/global-variables with values from variables.values', async () => {
			const vars = [{ key: 'API_URL', value: 'https://api.example.com', type: 'default' }];
			const { ctx, httpMock } = makeMockContext({
				workspaceId: 'ws-1',
				variables: { values: vars },
			});
			httpMock.mockResolvedValueOnce({});
			await executeWorkspace.call(ctx, 'updateGlobalVariables', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.WORKSPACE_GLOBAL_VARIABLES('ws-1'));
			expect(options.body).toEqual({ values: vars });
		});

		it('uses empty array when variables has no values key', async () => {
			const { ctx, httpMock } = makeMockContext({
				workspaceId: 'ws-1',
				variables: {},
			});
			httpMock.mockResolvedValueOnce({});
			await executeWorkspace.call(ctx, 'updateGlobalVariables', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.body).toEqual({ values: [] });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeWorkspace.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

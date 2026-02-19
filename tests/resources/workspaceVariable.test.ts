// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeWorkspaceVariable } from '../../nodes/Postman/resources/workspaceVariable/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeWorkspaceVariable', () => {
	describe('getAll', () => {
		it('calls GET /workspaces/:id/global-variables', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: 'ws-1' });
			const varsData = { values: [{ key: 'API_URL', value: 'https://example.com' }] };
			httpMock.mockResolvedValueOnce(varsData);
			const result = await executeWorkspaceVariable.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.WORKSPACE_GLOBAL_VARIABLES('ws-1'));
			expect(result.json).toEqual(varsData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('update', () => {
		it('calls PUT /workspaces/:id/global-variables with object variablesJson', async () => {
			const varsObj = [{ key: 'API_URL', value: 'https://api.example.com', type: 'default' }];
			const { ctx, httpMock } = makeMockContext({
				workspaceId: 'ws-1',
				variablesJson: varsObj,
			});
			httpMock.mockResolvedValueOnce({});
			await executeWorkspaceVariable.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.WORKSPACE_GLOBAL_VARIABLES('ws-1'));
			expect(options.body).toEqual({ values: varsObj });
		});

		it('parses variablesJson string as JSON', async () => {
			const varsObj = [{ key: 'TOKEN', value: 'abc123', type: 'secret' }];
			const { ctx, httpMock } = makeMockContext({
				workspaceId: 'ws-1',
				variablesJson: JSON.stringify(varsObj),
			});
			httpMock.mockResolvedValueOnce({});
			await executeWorkspaceVariable.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.body).toEqual({ values: varsObj });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeWorkspaceVariable.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

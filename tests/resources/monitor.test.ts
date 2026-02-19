// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeMonitor } from '../../nodes/Postman/resources/monitor/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeMonitor', () => {
	describe('getAll', () => {
		it('calls GET /monitors with workspace qs when provided', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: 'ws-1' });
			httpMock.mockResolvedValueOnce({});
			await executeMonitor.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.MONITORS);
			expect(options.qs).toEqual({ workspace: 'ws-1' });
		});

		it('omits qs when workspaceId is empty', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: '' });
			httpMock.mockResolvedValueOnce({});
			await executeMonitor.call(ctx, 'getAll', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.qs).toBeUndefined();
		});
	});

	describe('get', () => {
		it('calls GET /monitors/:id and unwraps response.monitor', async () => {
			const { ctx, httpMock } = makeMockContext({ monitorId: 'mon-1' });
			const monData = { id: 'mon-1', name: 'My Monitor' };
			httpMock.mockResolvedValueOnce({ monitor: monData });
			const result = await executeMonitor.call(ctx, 'get', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.url).toBe(ENDPOINTS.MONITOR('mon-1'));
			expect(result.json).toEqual(monData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('create', () => {
		it('calls POST /monitors with minimal body when no optional fields', async () => {
			const { ctx, httpMock } = makeMockContext({
				name: 'My Monitor',
				collectionId: 'col-1',
				workspaceId: '',
				additionalFields: {},
			});
			httpMock.mockResolvedValueOnce({ monitor: { id: 'mon-1' } });
			await executeMonitor.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.MONITORS);
			expect(options.body).toEqual({ monitor: { name: 'My Monitor', collection: 'col-1' } });
			expect(options.qs).toBeUndefined();
		});

		it('sets schedule.cron when cron is in additionalFields', async () => {
			const { ctx, httpMock } = makeMockContext({
				name: 'Scheduled Monitor',
				collectionId: 'col-1',
				workspaceId: '',
				additionalFields: { cron: '0 * * * *' },
			});
			httpMock.mockResolvedValueOnce({});
			await executeMonitor.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect((options.body as Record<string, unknown>).monitor).toEqual({
				name: 'Scheduled Monitor',
				collection: 'col-1',
				schedule: { cron: '0 * * * *' },
			});
		});

		it('sets environment when environment is in additionalFields', async () => {
			const { ctx, httpMock } = makeMockContext({
				name: 'Env Monitor',
				collectionId: 'col-1',
				workspaceId: 'ws-1',
				additionalFields: { environment: 'env-1' },
			});
			httpMock.mockResolvedValueOnce({});
			await executeMonitor.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect((options.body as Record<string, unknown>).monitor).toEqual({
				name: 'Env Monitor',
				collection: 'col-1',
				environment: 'env-1',
			});
			expect(options.qs).toEqual({ workspace: 'ws-1' });
		});
	});

	describe('update', () => {
		it('calls PUT /monitors/:id with monitor-wrapped updateFields', async () => {
			const { ctx, httpMock } = makeMockContext({
				monitorId: 'mon-1',
				updateFields: { name: 'Updated Monitor' },
			});
			httpMock.mockResolvedValueOnce({});
			await executeMonitor.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.MONITOR('mon-1'));
			expect(options.body).toEqual({ monitor: { name: 'Updated Monitor' } });
		});
	});

	describe('delete', () => {
		it('calls DELETE /monitors/:id', async () => {
			const { ctx, httpMock } = makeMockContext({ monitorId: 'mon-1' });
			httpMock.mockResolvedValueOnce({ monitor: { id: 'mon-1' } });
			const result = await executeMonitor.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.MONITOR('mon-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('run', () => {
		it('calls POST /monitors/:id/run and unwraps response.run', async () => {
			const { ctx, httpMock } = makeMockContext({ monitorId: 'mon-1' });
			const runData = { status: 'running', startedAt: '2024-01-01' };
			httpMock.mockResolvedValueOnce({ run: runData });
			const result = await executeMonitor.call(ctx, 'run', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.MONITOR_RUN('mon-1'));
			expect(options.body).toBeUndefined();
			expect(result.json).toEqual(runData);
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeMonitor.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeFork } from '../../nodes/Postman/resources/fork/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeFork', () => {
	describe('getAll', () => {
		it('calls GET /collections/:id/forks with additionalFields as qs', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				additionalFields: { limit: 10, direction: 'asc' },
			});
			httpMock.mockResolvedValueOnce({});
			await executeFork.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_FORKS('col-1'));
			expect(options.qs).toEqual({ limit: 10, direction: 'asc' });
		});

		it('omits qs when additionalFields is empty', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				additionalFields: {},
			});
			httpMock.mockResolvedValueOnce({});
			await executeFork.call(ctx, 'getAll', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.qs).toBeUndefined();
		});
	});

	describe('getUserForks', () => {
		it('calls GET /collections/forks with additionalFields as qs', async () => {
			const { ctx, httpMock } = makeMockContext({
				additionalFields: { cursor: 'abc', limit: 5 },
			});
			httpMock.mockResolvedValueOnce({});
			await executeFork.call(ctx, 'getUserForks', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_FORKS_MERGE);
			expect(options.qs).toEqual({ cursor: 'abc', limit: 5 });
		});
	});

	describe('merge', () => {
		it('calls POST /collection-merges with source, destination, strategy', async () => {
			const { ctx, httpMock } = makeMockContext({
				source: 'col-source',
				destination: 'col-dest',
				strategy: 'updateSourceWithDestination',
			});
			httpMock.mockResolvedValueOnce({});
			await executeFork.call(ctx, 'merge', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_MERGES);
			expect(options.body).toEqual({
				source: 'col-source',
				destination: 'col-dest',
				strategy: 'updateSourceWithDestination',
			});
			expect(options.qs).toBeUndefined();
		});
	});

	describe('getSourceStatus', () => {
		it('calls GET /collections/:id/source-status', async () => {
			const { ctx, httpMock } = makeMockContext({ collectionId: 'col-1' });
			httpMock.mockResolvedValueOnce({});
			const result = await executeFork.call(ctx, 'getSourceStatus', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_SOURCE_STATUS('col-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeFork.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

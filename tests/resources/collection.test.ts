// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeCollection } from '../../nodes/Postman/resources/collection/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeCollection', () => {
	describe('getAll', () => {
		it('calls GET /collections with workspace qs when provided', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: 'ws-1' });
			httpMock.mockResolvedValueOnce({});
			await executeCollection.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.COLLECTIONS);
			expect(options.qs).toEqual({ workspace: 'ws-1' });
		});

		it('omits qs when workspaceId is empty', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: '' });
			httpMock.mockResolvedValueOnce({});
			await executeCollection.call(ctx, 'getAll', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.qs).toBeUndefined();
		});
	});

	describe('get', () => {
		it('calls GET /collections/:id and unwraps response.collection', async () => {
			const { ctx, httpMock } = makeMockContext({ collectionId: 'col-1' });
			const colData = { id: 'col-1', name: 'My Collection' };
			httpMock.mockResolvedValueOnce({ collection: colData });
			const result = await executeCollection.call(ctx, 'get', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.url).toBe(ENDPOINTS.COLLECTION('col-1'));
			expect(result.json).toEqual(colData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('create', () => {
		it('wraps collectionJson object in collection key', async () => {
			const collectionObj = { info: { name: 'Test' }, item: [] };
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				workspaceId: '',
				collectionJson: collectionObj,
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollection.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.COLLECTIONS);
			expect(options.body).toEqual({ collection: collectionObj });
		});

		it('parses collectionJson string as JSON', async () => {
			const collectionObj = { info: { name: 'Test' }, item: [] };
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				workspaceId: 'ws-1',
				collectionJson: JSON.stringify(collectionObj),
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollection.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.body).toEqual({ collection: collectionObj });
			expect(options.qs).toEqual({ workspace: 'ws-1' });
		});
	});

	describe('update', () => {
		it('calls PATCH /collections/:id with collection.info wrapper', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				updateFields: { name: 'Updated', description: 'New desc' },
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollection.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PATCH');
			expect(options.url).toBe(ENDPOINTS.COLLECTION('col-1'));
			expect(options.body).toEqual({ collection: { info: { name: 'Updated', description: 'New desc' } } });
		});
	});

	describe('delete', () => {
		it('calls DELETE /collections/:id', async () => {
			const { ctx, httpMock } = makeMockContext({ collectionId: 'col-1' });
			httpMock.mockResolvedValueOnce({ collection: { id: 'col-1' } });
			const result = await executeCollection.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.COLLECTION('col-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('fork', () => {
		it('calls POST /collections/:id/forks with label and workspace qs', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				label: 'My Fork',
				workspaceId: 'ws-1',
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollection.call(ctx, 'fork', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_FORKS('col-1'));
			expect(options.body).toEqual({ label: 'My Fork' });
			expect(options.qs).toEqual({ workspace: 'ws-1' });
		});
	});

	describe('duplicate', () => {
		it('calls POST /collections/:id/copy with no body', async () => {
			const { ctx, httpMock } = makeMockContext({ collectionId: 'col-1' });
			httpMock.mockResolvedValueOnce({});
			await executeCollection.call(ctx, 'duplicate', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_COPY('col-1'));
			expect(options.body).toBeUndefined();
		});
	});

	describe('run', () => {
		it('calls POST /collections/:id/run with additionalFields as body', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				additionalFields: { environment: 'env-1' },
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollection.call(ctx, 'run', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_RUN('col-1'));
			expect(options.body).toEqual({ environment: 'env-1' });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeCollection.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

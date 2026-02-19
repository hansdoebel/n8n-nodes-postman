// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeCollectionRequest } from '../../nodes/Postman/resources/collectionRequest/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeCollectionRequest', () => {
	describe('create', () => {
		it('calls POST /collections/:id/requests with object body', async () => {
			const requestObj = { name: 'My Request', request: { method: 'GET', url: { raw: 'http://example.com' } } };
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				requestBody: requestObj,
				folderId: '',
			});
			const dataResult = { id: 'req-1' };
			httpMock.mockResolvedValueOnce({ data: dataResult });
			const result = await executeCollectionRequest.call(ctx, 'create', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_REQUESTS('col-1'));
			expect(options.body).toEqual(requestObj);
			expect(options.qs).toBeUndefined();
			expect(result.json).toEqual(dataResult);
			expect(result.pairedItem).toEqual({ item: 0 });
		});

		it('parses requestBody string as JSON', async () => {
			const requestObj = { name: 'My Request' };
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				requestBody: JSON.stringify(requestObj),
				folderId: '',
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollectionRequest.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.body).toEqual(requestObj);
		});

		it('sets qs.folder when folderId is provided', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				requestBody: { name: 'My Request' },
				folderId: 'fold-1',
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollectionRequest.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.qs).toEqual({ folder: 'fold-1' });
		});
	});

	describe('get', () => {
		it('calls GET /collections/:id/requests/:requestId and unwraps response.data', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				requestId: 'req-1',
			});
			const dataResult = { id: 'req-1', name: 'My Request' };
			httpMock.mockResolvedValueOnce({ data: dataResult });
			const result = await executeCollectionRequest.call(ctx, 'get', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_REQUEST('col-1', 'req-1'));
			expect(result.json).toEqual(dataResult);
		});
	});

	describe('update', () => {
		it('calls PUT /collections/:id/requests/:requestId with parsed body', async () => {
			const requestObj = { name: 'Updated Request' };
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				requestId: 'req-1',
				requestBody: JSON.stringify(requestObj),
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollectionRequest.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_REQUEST('col-1', 'req-1'));
			expect(options.body).toEqual(requestObj);
		});
	});

	describe('delete', () => {
		it('calls DELETE /collections/:id/requests/:requestId', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				requestId: 'req-1',
			});
			httpMock.mockResolvedValueOnce({ data: { id: 'req-1' } });
			const result = await executeCollectionRequest.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_REQUEST('col-1', 'req-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeCollectionRequest.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

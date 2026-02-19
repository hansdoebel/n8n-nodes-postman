// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeCollectionFolder } from '../../nodes/Postman/resources/collectionFolder/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeCollectionFolder', () => {
	describe('create', () => {
		it('calls POST /collections/:id/folders with name body and unwraps response.data', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				name: 'My Folder',
			});
			const folderData = { id: 'fold-1', name: 'My Folder' };
			httpMock.mockResolvedValueOnce({ data: folderData });
			const result = await executeCollectionFolder.call(ctx, 'create', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_FOLDERS('col-1'));
			expect(options.body).toEqual({ name: 'My Folder' });
			expect(result.json).toEqual(folderData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('get', () => {
		it('calls GET /collections/:id/folders/:folderId and unwraps response.data', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				folderId: 'fold-1',
			});
			const folderData = { id: 'fold-1', name: 'My Folder' };
			httpMock.mockResolvedValueOnce({ data: folderData });
			const result = await executeCollectionFolder.call(ctx, 'get', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_FOLDER('col-1', 'fold-1'));
			expect(result.json).toEqual(folderData);
		});

		it('falls back to full response when response.data is undefined', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				folderId: 'fold-1',
			});
			const raw = { id: 'fold-1' };
			httpMock.mockResolvedValueOnce(raw);
			const result = await executeCollectionFolder.call(ctx, 'get', 0);
			expect(result.json).toEqual(raw);
		});
	});

	describe('update', () => {
		it('calls PUT /collections/:id/folders/:folderId with updateFields as body directly', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				folderId: 'fold-1',
				updateFields: { name: 'Renamed Folder' },
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollectionFolder.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_FOLDER('col-1', 'fold-1'));
			expect(options.body).toEqual({ name: 'Renamed Folder' });
		});
	});

	describe('delete', () => {
		it('calls DELETE /collections/:id/folders/:folderId', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				folderId: 'fold-1',
			});
			httpMock.mockResolvedValueOnce({ data: { id: 'fold-1' } });
			const result = await executeCollectionFolder.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_FOLDER('col-1', 'fold-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeCollectionFolder.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

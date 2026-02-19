// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executePrivateApiNetwork } from '../../nodes/Postman/resources/privateApiNetwork/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executePrivateApiNetwork', () => {
	describe('getAll', () => {
		it('calls GET /network/private with selected qs fields', async () => {
			const { ctx, httpMock } = makeMockContext({
				additionalFields: { name: 'My API', type: 'api', limit: 10, offset: 0 },
			});
			httpMock.mockResolvedValueOnce({});
			await executePrivateApiNetwork.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.NETWORK_PRIVATE);
			expect(options.qs).toEqual({ name: 'My API', type: 'api', limit: 10, offset: 0 });
		});

		it('excludes undefined additionalFields from qs', async () => {
			const { ctx, httpMock } = makeMockContext({
				additionalFields: { name: 'Test', parentFolderId: undefined },
			});
			httpMock.mockResolvedValueOnce({});
			await executePrivateApiNetwork.call(ctx, 'getAll', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect((options.qs as Record<string, unknown>).parentFolderId).toBeUndefined();
			expect((options.qs as Record<string, unknown>).name).toBe('Test');
		});

		it('omits qs when additionalFields is empty', async () => {
			const { ctx, httpMock } = makeMockContext({ additionalFields: {} });
			httpMock.mockResolvedValueOnce({});
			await executePrivateApiNetwork.call(ctx, 'getAll', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.qs).toBeUndefined();
		});
	});

	describe('getRequests', () => {
		it('calls GET /network/private/network-entity/request/all', async () => {
			const { ctx, httpMock } = makeMockContext({
				additionalFields: { status: 'pending', limit: 5 },
			});
			httpMock.mockResolvedValueOnce({});
			await executePrivateApiNetwork.call(ctx, 'getRequests', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.NETWORK_PRIVATE_REQUEST_ALL);
			expect(options.qs).toEqual({ status: 'pending', limit: 5 });
		});
	});

	describe('add', () => {
		it('adds a folder with name and optional description', async () => {
			const { ctx, httpMock } = makeMockContext({
				elementType: 'folder',
				folderName: 'My Folder',
				additionalFields: { folderDescription: 'A folder', parentFolderId: 5 },
			});
			httpMock.mockResolvedValueOnce({});
			await executePrivateApiNetwork.call(ctx, 'add', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.NETWORK_PRIVATE);
			expect(options.body).toEqual({
				type: 'folder',
				name: 'My Folder',
				description: 'A folder',
				parentFolderId: 5,
			});
		});

		it('adds a non-folder element with id and parentFolderId', async () => {
			const { ctx, httpMock } = makeMockContext({
				elementType: 'api',
				elementId: 'api-1',
				parentFolderId: 10,
			});
			httpMock.mockResolvedValueOnce({});
			await executePrivateApiNetwork.call(ctx, 'add', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.body).toEqual({ type: 'api', id: 'api-1', parentFolderId: 10 });
		});
	});

	describe('update', () => {
		it('calls PUT /network/private/:elementType/:elementId with mapped updateFields', async () => {
			const { ctx, httpMock } = makeMockContext({
				elementType: 'folder',
				elementId: 'folder-1',
				updateFields: { folderName: 'Renamed', folderDescription: 'New desc', parentFolderId: 3 },
			});
			httpMock.mockResolvedValueOnce({});
			await executePrivateApiNetwork.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.NETWORK_PRIVATE_ELEMENT('folder', 'folder-1'));
			expect(options.body).toEqual({ name: 'Renamed', description: 'New desc', parentFolderId: 3 });
		});
	});

	describe('remove', () => {
		it('calls DELETE /network/private/:elementType/:elementId', async () => {
			const { ctx, httpMock } = makeMockContext({
				elementType: 'api',
				elementId: 'api-1',
			});
			httpMock.mockResolvedValueOnce({});
			const result = await executePrivateApiNetwork.call(ctx, 'remove', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.NETWORK_PRIVATE_ELEMENT('api', 'api-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executePrivateApiNetwork.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeMock } from '../../nodes/Postman/resources/mock/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeMock', () => {
	describe('getAll', () => {
		it('calls GET /mocks with workspace qs when provided', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: 'ws-1' });
			httpMock.mockResolvedValueOnce({});
			await executeMock.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.MOCKS);
			expect(options.qs).toEqual({ workspace: 'ws-1' });
		});

		it('omits qs when workspaceId is empty', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: '' });
			httpMock.mockResolvedValueOnce({});
			await executeMock.call(ctx, 'getAll', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.qs).toBeUndefined();
		});
	});

	describe('get', () => {
		it('calls GET /mocks/:id and unwraps response.mock', async () => {
			const { ctx, httpMock } = makeMockContext({ mockId: 'mock-1' });
			const mockData = { id: 'mock-1', name: 'My Mock' };
			httpMock.mockResolvedValueOnce({ mock: mockData });
			const result = await executeMock.call(ctx, 'get', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.url).toBe(ENDPOINTS.MOCK('mock-1'));
			expect(result.json).toEqual(mockData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('create', () => {
		it('calls POST /mocks with mock-wrapped body including collection', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				workspaceId: 'ws-1',
				additionalFields: {},
			});
			httpMock.mockResolvedValueOnce({ mock: { id: 'mock-1' } });
			await executeMock.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.MOCKS);
			expect(options.body).toEqual({ mock: { collection: 'col-1' } });
			expect(options.qs).toEqual({ workspace: 'ws-1' });
		});

		it('spreads additionalFields into mock body', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				workspaceId: '',
				additionalFields: { name: 'My Mock', private: true },
			});
			httpMock.mockResolvedValueOnce({});
			await executeMock.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.body).toEqual({ mock: { collection: 'col-1', name: 'My Mock', private: true } });
		});
	});

	describe('update', () => {
		it('calls PUT /mocks/:id with mock-wrapped updateFields', async () => {
			const { ctx, httpMock } = makeMockContext({
				mockId: 'mock-1',
				updateFields: { name: 'Updated Mock' },
			});
			httpMock.mockResolvedValueOnce({});
			await executeMock.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.MOCK('mock-1'));
			expect(options.body).toEqual({ mock: { name: 'Updated Mock' } });
		});
	});

	describe('delete', () => {
		it('calls DELETE /mocks/:id', async () => {
			const { ctx, httpMock } = makeMockContext({ mockId: 'mock-1' });
			httpMock.mockResolvedValueOnce({ mock: { id: 'mock-1' } });
			const result = await executeMock.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.MOCK('mock-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('publish', () => {
		it('calls POST /mocks/:id/publish with no body', async () => {
			const { ctx, httpMock } = makeMockContext({ mockId: 'mock-1' });
			httpMock.mockResolvedValueOnce({});
			await executeMock.call(ctx, 'publish', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.MOCK_PUBLISH('mock-1'));
			expect(options.body).toBeUndefined();
		});
	});

	describe('unpublish', () => {
		it('calls DELETE /mocks/:id/unpublish', async () => {
			const { ctx, httpMock } = makeMockContext({ mockId: 'mock-1' });
			httpMock.mockResolvedValueOnce({});
			await executeMock.call(ctx, 'unpublish', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.MOCK_UNPUBLISH('mock-1'));
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeMock.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

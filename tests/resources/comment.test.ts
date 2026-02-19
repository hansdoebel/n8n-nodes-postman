// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeComment } from '../../nodes/Postman/resources/comment/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeComment', () => {
	describe('getAll', () => {
		it('calls GET /collections/:id/comments and returns full response', async () => {
			const { ctx, httpMock } = makeMockContext({ collectionId: 'col-1' });
			const responseData = { comments: [{ id: 1, body: 'Hello' }] };
			httpMock.mockResolvedValueOnce(responseData);
			const result = await executeComment.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_COMMENTS('col-1'));
			expect(result.json).toEqual(responseData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('create', () => {
		it('calls POST /collections/:id/comments with body field wrapped and unwraps response.comment', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				body: 'Great collection!',
			});
			const commentData = { id: 1, body: 'Great collection!' };
			httpMock.mockResolvedValueOnce({ comment: commentData });
			const result = await executeComment.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_COMMENTS('col-1'));
			expect(options.body).toEqual({ body: 'Great collection!' });
			expect(result.json).toEqual(commentData);
		});
	});

	describe('update', () => {
		it('calls PUT /collections/:id/comments/:commentId with numeric comment id', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				commentId: 42,
				body: 'Updated comment',
			});
			httpMock.mockResolvedValueOnce({});
			await executeComment.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_COMMENT('col-1', 42));
			expect(options.body).toEqual({ body: 'Updated comment' });
		});
	});

	describe('delete', () => {
		it('calls DELETE /collections/:id/comments/:commentId with numeric comment id', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				commentId: 42,
			});
			httpMock.mockResolvedValueOnce({});
			const result = await executeComment.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_COMMENT('col-1', 42));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeComment.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

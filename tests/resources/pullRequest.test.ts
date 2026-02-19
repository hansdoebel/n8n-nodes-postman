// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executePullRequest } from '../../nodes/Postman/resources/pullRequest/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executePullRequest', () => {
	describe('getAll', () => {
		it('calls GET /collections/:id/pull-requests', async () => {
			const { ctx, httpMock } = makeMockContext({ collectionId: 'col-1' });
			const prList = { pullRequests: [] };
			httpMock.mockResolvedValueOnce(prList);
			const result = await executePullRequest.call(ctx, 'getAll', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_PULL_REQUESTS('col-1'));
			expect(result.json).toEqual(prList);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('create', () => {
		it('calls POST with title, description, and destination wrapped body', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				title: 'My PR',
				description: 'PR description',
				destinationId: 'col-dest',
			});
			const prData = { id: 'pr-1', title: 'My PR' };
			httpMock.mockResolvedValueOnce({ pullRequest: prData });
			const result = await executePullRequest.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_PULL_REQUESTS('col-1'));
			expect(options.body).toEqual({
				title: 'My PR',
				description: 'PR description',
				destination: { id: 'col-dest' },
			});
			expect(result.json).toEqual(prData);
		});
	});

	describe('get', () => {
		it('calls GET /collection-pull-requests/:id using getNodeParameter (not rlcValue)', async () => {
			const { ctx, httpMock } = makeMockContext({ pullRequestId: 'pr-1' });
			const prData = { id: 'pr-1', title: 'My PR' };
			httpMock.mockResolvedValueOnce({ pullRequest: prData });
			const result = await executePullRequest.call(ctx, 'get', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.PULL_REQUEST('pr-1'));
			expect(result.json).toEqual(prData);
		});
	});

	describe('update', () => {
		it('calls PUT /collection-pull-requests/:id with updateFields as body', async () => {
			const { ctx, httpMock } = makeMockContext({
				pullRequestId: 'pr-1',
				updateFields: { title: 'Updated PR', description: 'New desc' },
			});
			httpMock.mockResolvedValueOnce({});
			await executePullRequest.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.PULL_REQUEST('pr-1'));
			expect(options.body).toEqual({ title: 'Updated PR', description: 'New desc' });
		});
	});

	describe('delete', () => {
		it('calls DELETE /collection-pull-requests/:id', async () => {
			const { ctx, httpMock } = makeMockContext({ pullRequestId: 'pr-1' });
			httpMock.mockResolvedValueOnce({ pullRequest: { id: 'pr-1' } });
			const result = await executePullRequest.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.PULL_REQUEST('pr-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('merge', () => {
		it('calls POST /collection-pull-requests/:id/merge with no body', async () => {
			const { ctx, httpMock } = makeMockContext({ pullRequestId: 'pr-1' });
			httpMock.mockResolvedValueOnce({});
			await executePullRequest.call(ctx, 'merge', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.PULL_REQUEST_MERGE('pr-1'));
			expect(options.body).toBeUndefined();
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executePullRequest.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

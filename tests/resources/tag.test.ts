// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeTag } from '../../nodes/Postman/resources/tag/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeTag', () => {
	describe('getCollectionTags', () => {
		it('calls GET /collections/:id/tags', async () => {
			const { ctx, httpMock } = makeMockContext({ collectionId: 'col-1' });
			const tagsData = { tags: [{ slug: 'alpha' }] };
			httpMock.mockResolvedValueOnce(tagsData);
			const result = await executeTag.call(ctx, 'getCollectionTags', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_TAGS('col-1'));
			expect(result.json).toEqual(tagsData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	describe('setCollectionTags', () => {
		it('parses comma-separated tags and calls PUT /collections/:id/tags', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				tags: 'alpha, beta, gamma',
			});
			httpMock.mockResolvedValueOnce({});
			await executeTag.call(ctx, 'setCollectionTags', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_TAGS('col-1'));
			expect(options.body).toEqual({ tags: [{ slug: 'alpha' }, { slug: 'beta' }, { slug: 'gamma' }] });
		});

		it('trims whitespace and filters empty slugs', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				tags: 'alpha, , beta',
			});
			httpMock.mockResolvedValueOnce({});
			await executeTag.call(ctx, 'setCollectionTags', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.body).toEqual({ tags: [{ slug: 'alpha' }, { slug: 'beta' }] });
		});
	});

	describe('getWorkspaceTags', () => {
		it('calls GET /workspaces/:id/tags', async () => {
			const { ctx, httpMock } = makeMockContext({ workspaceId: 'ws-1' });
			httpMock.mockResolvedValueOnce({});
			await executeTag.call(ctx, 'getWorkspaceTags', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.WORKSPACE_TAGS('ws-1'));
		});
	});

	describe('setWorkspaceTags', () => {
		it('parses comma-separated tags and calls PUT /workspaces/:id/tags', async () => {
			const { ctx, httpMock } = makeMockContext({
				workspaceId: 'ws-1',
				tags: 'backend, frontend',
			});
			httpMock.mockResolvedValueOnce({});
			await executeTag.call(ctx, 'setWorkspaceTags', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.WORKSPACE_TAGS('ws-1'));
			expect(options.body).toEqual({ tags: [{ slug: 'backend' }, { slug: 'frontend' }] });
		});
	});

	describe('getTaggedEntities', () => {
		it('calls GET /tags/:tagSlug/entities using getNodeParameter (not rlcValue)', async () => {
			const { ctx, httpMock } = makeMockContext({ tagSlug: 'my-tag' });
			httpMock.mockResolvedValueOnce({});
			const result = await executeTag.call(ctx, 'getTaggedEntities', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.TAGS_ENTITIES('my-tag'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeTag.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import {
	searchWorkspaces,
	searchCollections,
	searchEnvironments,
	searchApis,
	searchMocks,
	searchMonitors,
} from '../nodes/Postman/utils/loadOptions';
import { makeMockLoadOptionsContext } from './helpers/mockContext';

describe('searchWorkspaces', () => {
	it('returns all workspaces mapped to name/value', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			workspaces: [
				{ name: 'Alpha', id: 'id-1' },
				{ name: 'Beta', id: 'id-2' },
			],
		});
		const result = await searchWorkspaces.call(ctx);
		expect(result.results).toHaveLength(2);
		expect(result.results[0]).toEqual({ name: 'Alpha', value: 'id-1' });
		expect(result.results[1]).toEqual({ name: 'Beta', value: 'id-2' });
	});

	it('filters results by name when filter provided', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			workspaces: [{ name: 'Alpha', id: 'id-1' }, { name: 'Beta', id: 'id-2' }],
		});
		const result = await searchWorkspaces.call(ctx, 'alp');
		expect(result.results).toHaveLength(1);
		expect(result.results[0].name).toBe('Alpha');
	});

	it('returns empty results on error', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockRejectedValueOnce(new Error('Network error'));
		const result = await searchWorkspaces.call(ctx);
		expect(result.results).toEqual([]);
	});

	it('returns empty results when response has no workspaces key', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({});
		const result = await searchWorkspaces.call(ctx);
		expect(result.results).toEqual([]);
	});
});

describe('searchCollections', () => {
	it('maps uid (not id) to value', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			collections: [{ name: 'My Collection', uid: 'uid-1', id: 'id-1' }],
		});
		const result = await searchCollections.call(ctx);
		expect(result.results[0]).toEqual({ name: 'My Collection', value: 'uid-1' });
	});

	it('filters by name', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			collections: [
				{ name: 'Alpha', uid: 'uid-1' },
				{ name: 'Beta', uid: 'uid-2' },
			],
		});
		const result = await searchCollections.call(ctx, 'beta');
		expect(result.results).toHaveLength(1);
		expect(result.results[0].name).toBe('Beta');
	});

	it('returns empty results on error', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockRejectedValueOnce(new Error('fail'));
		const result = await searchCollections.call(ctx);
		expect(result.results).toEqual([]);
	});
});

describe('searchEnvironments', () => {
	it('maps uid (not id) to value', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			environments: [{ name: 'Prod', uid: 'env-uid-1', id: 'env-id-1' }],
		});
		const result = await searchEnvironments.call(ctx);
		expect(result.results[0]).toEqual({ name: 'Prod', value: 'env-uid-1' });
	});

	it('filters by name', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			environments: [
				{ name: 'Production', uid: 'uid-1' },
				{ name: 'Staging', uid: 'uid-2' },
			],
		});
		const result = await searchEnvironments.call(ctx, 'stag');
		expect(result.results).toHaveLength(1);
		expect(result.results[0].name).toBe('Staging');
	});

	it('returns empty results on error', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockRejectedValueOnce(new Error('fail'));
		const result = await searchEnvironments.call(ctx);
		expect(result.results).toEqual([]);
	});
});

describe('searchApis', () => {
	it('maps id to value', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			apis: [{ name: 'My API', id: 'api-1' }],
		});
		const result = await searchApis.call(ctx);
		expect(result.results[0]).toEqual({ name: 'My API', value: 'api-1' });
	});

	it('filters by name case-insensitively', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			apis: [{ name: 'Payments API', id: 'api-1' }, { name: 'Users API', id: 'api-2' }],
		});
		const result = await searchApis.call(ctx, 'PAYMENT');
		expect(result.results).toHaveLength(1);
		expect(result.results[0].name).toBe('Payments API');
	});

	it('returns empty results on error', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockRejectedValueOnce(new Error('fail'));
		const result = await searchApis.call(ctx);
		expect(result.results).toEqual([]);
	});
});

describe('searchMocks', () => {
	it('maps id to value', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			mocks: [{ name: 'My Mock', id: 'mock-1' }],
		});
		const result = await searchMocks.call(ctx);
		expect(result.results[0]).toEqual({ name: 'My Mock', value: 'mock-1' });
	});

	it('filters by name', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			mocks: [{ name: 'Alpha Mock', id: 'mock-1' }, { name: 'Beta Mock', id: 'mock-2' }],
		});
		const result = await searchMocks.call(ctx, 'alpha');
		expect(result.results).toHaveLength(1);
	});

	it('returns empty results on error', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockRejectedValueOnce(new Error('fail'));
		const result = await searchMocks.call(ctx);
		expect(result.results).toEqual([]);
	});
});

describe('searchMonitors', () => {
	it('maps id to value', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			monitors: [{ name: 'My Monitor', id: 'mon-1' }],
		});
		const result = await searchMonitors.call(ctx);
		expect(result.results[0]).toEqual({ name: 'My Monitor', value: 'mon-1' });
	});

	it('filters by name', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockResolvedValueOnce({
			monitors: [{ name: 'Prod Monitor', id: 'mon-1' }, { name: 'Staging Monitor', id: 'mon-2' }],
		});
		const result = await searchMonitors.call(ctx, 'prod');
		expect(result.results).toHaveLength(1);
	});

	it('returns empty results on error', async () => {
		const { ctx, httpMock } = makeMockLoadOptionsContext();
		httpMock.mockRejectedValueOnce(new Error('fail'));
		const result = await searchMonitors.call(ctx);
		expect(result.results).toEqual([]);
	});
});

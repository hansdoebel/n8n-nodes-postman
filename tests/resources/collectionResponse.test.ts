// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeCollectionResponse } from '../../nodes/Postman/resources/collectionResponse/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeCollectionResponse', () => {
	describe('get', () => {
		it('calls GET /collections/:id/responses/:responseId and unwraps response.response', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				responseId: 'resp-1',
			});
			const respData = { id: 'resp-1', name: 'My Response' };
			httpMock.mockResolvedValueOnce({ response: respData });
			const result = await executeCollectionResponse.call(ctx, 'get', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_RESPONSE('col-1', 'resp-1'));
			expect(result.json).toEqual(respData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});

		it('falls back to full response when response.response is undefined', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				responseId: 'resp-1',
			});
			const raw = { id: 'resp-1' };
			httpMock.mockResolvedValueOnce(raw);
			const result = await executeCollectionResponse.call(ctx, 'get', 0);
			expect(result.json).toEqual(raw);
		});
	});

	describe('create', () => {
		it('wraps responseJson object in response key', async () => {
			const responseObj = { name: 'My Response', code: 200, status: 'OK' };
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				responseJson: responseObj,
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollectionResponse.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('POST');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_RESPONSES('col-1'));
			expect(options.body).toEqual({ response: responseObj });
		});

		it('parses responseJson string as JSON', async () => {
			const responseObj = { name: 'My Response', code: 200 };
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				responseJson: JSON.stringify(responseObj),
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollectionResponse.call(ctx, 'create', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.body).toEqual({ response: responseObj });
		});
	});

	describe('update', () => {
		it('calls PUT /collections/:id/responses/:responseId with response-wrapped updateFields', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				responseId: 'resp-1',
				updateFields: { name: 'Updated Response', code: 201 },
			});
			httpMock.mockResolvedValueOnce({});
			await executeCollectionResponse.call(ctx, 'update', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('PUT');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_RESPONSE('col-1', 'resp-1'));
			expect(options.body).toEqual({ response: { name: 'Updated Response', code: 201 } });
		});
	});

	describe('delete', () => {
		it('calls DELETE /collections/:id/responses/:responseId', async () => {
			const { ctx, httpMock } = makeMockContext({
				collectionId: 'col-1',
				responseId: 'resp-1',
			});
			httpMock.mockResolvedValueOnce({ response: { id: 'resp-1' } });
			const result = await executeCollectionResponse.call(ctx, 'delete', 0);
			const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(options.method).toBe('DELETE');
			expect(options.url).toBe(ENDPOINTS.COLLECTION_RESPONSE('col-1', 'resp-1'));
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeCollectionResponse.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

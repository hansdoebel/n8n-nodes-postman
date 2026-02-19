// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect, mock } from 'bun:test';
import { postmanApiRequest } from '../nodes/Postman/transport';
import type { IExecuteFunctions } from 'n8n-workflow';
import { BASE_URL } from '../nodes/Postman/utils/constants';

function makeCtx() {
	const httpMock = mock(() => Promise.resolve({ result: 'ok' }));
	const ctx = {
		helpers: { httpRequestWithAuthentication: httpMock },
	} as unknown as IExecuteFunctions;
	return { ctx, httpMock };
}

describe('postmanApiRequest', () => {
	it('uses baseURL, json:true, and postmanApi credential', async () => {
		const { ctx, httpMock } = makeCtx();
		await postmanApiRequest.call(ctx, 'GET', '/test');
		const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
		expect(credKey).toBe('postmanApi');
		expect(options.baseURL).toBe(BASE_URL);
		expect(options.json).toBe(true);
	});

	it('sets method and url', async () => {
		const { ctx, httpMock } = makeCtx();
		await postmanApiRequest.call(ctx, 'DELETE', '/workspaces/123');
		const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
		expect(options.method).toBe('DELETE');
		expect(options.url).toBe('/workspaces/123');
	});

	it('omits body key when body is empty', async () => {
		const { ctx, httpMock } = makeCtx();
		await postmanApiRequest.call(ctx, 'GET', '/test', {});
		const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
		expect(options.body).toBeUndefined();
	});

	it('sets body when non-empty', async () => {
		const { ctx, httpMock } = makeCtx();
		await postmanApiRequest.call(ctx, 'POST', '/test', { name: 'foo' });
		const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
		expect(options.body).toEqual({ name: 'foo' });
	});

	it('omits qs key when qs is empty', async () => {
		const { ctx, httpMock } = makeCtx();
		await postmanApiRequest.call(ctx, 'GET', '/test', {}, {});
		const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
		expect(options.qs).toBeUndefined();
	});

	it('sets qs when non-empty', async () => {
		const { ctx, httpMock } = makeCtx();
		await postmanApiRequest.call(ctx, 'GET', '/test', {}, { workspace: 'ws-1' });
		const [, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
		expect(options.qs).toEqual({ workspace: 'ws-1' });
	});

	it('passes through the return value from httpRequestWithAuthentication', async () => {
		const { ctx } = makeCtx();
		const result = await postmanApiRequest.call(ctx, 'GET', '/test');
		expect(result).toEqual({ result: 'ok' });
	});
});

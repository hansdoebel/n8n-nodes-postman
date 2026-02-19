// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { mock } from 'bun:test';
import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';

export function makeMockContext(params: Record<string, unknown> = {}) {
	const httpMock = mock(() => Promise.resolve({}));
	const ctx = {
		helpers: { httpRequestWithAuthentication: httpMock },
		getNodeParameter: mock((name: string, _i: number, fallback?: unknown) => {
			if (name in params) return params[name];
			if (fallback !== undefined) return fallback;
			return '';
		}),
	} as unknown as IExecuteFunctions;
	return { ctx, httpMock };
}

export function makeMockLoadOptionsContext() {
	const httpMock = mock(() => Promise.resolve({}));
	const ctx = {
		helpers: { httpRequestWithAuthentication: httpMock },
	} as unknown as ILoadOptionsFunctions;
	return { ctx, httpMock };
}

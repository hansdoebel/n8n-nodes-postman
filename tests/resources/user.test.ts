// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { executeUser } from '../../nodes/Postman/resources/user/execute';
import { makeMockContext } from '../helpers/mockContext';
import { ENDPOINTS } from '../../nodes/Postman/utils/constants';

describe('executeUser', () => {
	describe('get', () => {
		it('calls GET /me and unwraps response.user', async () => {
			const { ctx, httpMock } = makeMockContext();
			const userData = { id: 123, username: 'testuser', email: 'test@example.com' };
			httpMock.mockResolvedValueOnce({ user: userData });
			const result = await executeUser.call(ctx, 'get', 0);
			const [credKey, options] = httpMock.mock.calls[0] as [string, Record<string, unknown>];
			expect(credKey).toBe('postmanApi');
			expect(options.method).toBe('GET');
			expect(options.url).toBe(ENDPOINTS.ME);
			expect(options.body).toBeUndefined();
			expect(options.qs).toBeUndefined();
			expect(result.json).toEqual(userData);
			expect(result.pairedItem).toEqual({ item: 0 });
		});

		it('falls back to full response when response.user is undefined', async () => {
			const { ctx, httpMock } = makeMockContext();
			const raw = { id: 123 };
			httpMock.mockResolvedValueOnce(raw);
			const result = await executeUser.call(ctx, 'get', 0);
			expect(result.json).toEqual(raw);
		});
	});

	it('throws for unknown operation', async () => {
		const { ctx } = makeMockContext();
		await expect(executeUser.call(ctx, 'nonexistent', 0)).rejects.toThrow('Unknown operation: nonexistent');
	});
});

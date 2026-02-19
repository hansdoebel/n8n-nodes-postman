// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import { rlcValue } from '../nodes/Postman/utils/helpers';
import type { IExecuteFunctions } from 'n8n-workflow';

function makeCtx(returnValue: unknown) {
	return {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		getNodeParameter: (_name: string, _i: number, _opts: unknown) => returnValue,
	} as unknown as IExecuteFunctions;
}

describe('rlcValue', () => {
	it('returns the string directly when getNodeParameter returns a string', () => {
		const ctx = makeCtx('my-id');
		expect(rlcValue(ctx, 'workspaceId', 0)).toBe('my-id');
	});

	it('returns value property when getNodeParameter returns an object with value', () => {
		const ctx = makeCtx({ value: 'abc-123' });
		expect(rlcValue(ctx, 'workspaceId', 0)).toBe('abc-123');
	});

	it('returns empty string when getNodeParameter returns null', () => {
		const ctx = makeCtx(null);
		expect(rlcValue(ctx, 'workspaceId', 0)).toBe('');
	});

	it('returns empty string when getNodeParameter returns undefined', () => {
		const ctx = makeCtx(undefined);
		expect(rlcValue(ctx, 'workspaceId', 0)).toBe('');
	});

	it('converts number to string when getNodeParameter returns a number', () => {
		const ctx = makeCtx(42);
		expect(rlcValue(ctx, 'someId', 0)).toBe('42');
	});

	it('returns empty string when value property is empty string', () => {
		const ctx = makeCtx({ value: '' });
		expect(rlcValue(ctx, 'workspaceId', 0)).toBe('');
	});
});

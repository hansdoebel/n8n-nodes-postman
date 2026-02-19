// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports, import-x/no-unresolved
import { describe, it, expect } from 'bun:test';
import {
	workspaceRlc,
	workspaceRlcOptional,
	collectionRlc,
	environmentRlc,
	apiRlc,
	mockRlc,
	monitorRlc,
} from '../nodes/Postman/utils/rlcDefs';

describe('rlcDefs', () => {
	const displayOptions = { show: { resource: ['api'] } };

	describe('workspaceRlc', () => {
		it('returns correct name, type and required', () => {
			const field = workspaceRlc(displayOptions);
			expect(field.name).toBe('workspaceId');
			expect(field.type).toBe('resourceLocator');
			expect(field.required).toBe(true);
		});

		it('uses searchWorkspaces as searchListMethod', () => {
			const field = workspaceRlc(displayOptions);
			expect((field.modes![0] as { typeOptions: { searchListMethod: string } }).typeOptions.searchListMethod).toBe('searchWorkspaces');
		});

		it('has default mode list with empty value', () => {
			const field = workspaceRlc(displayOptions);
			expect(field.default).toEqual({ mode: 'list', value: '' });
		});

		it('has exactly 2 modes', () => {
			const field = workspaceRlc(displayOptions);
			expect(field.modes).toHaveLength(2);
		});

		it('modes[1] has validation array', () => {
			const field = workspaceRlc(displayOptions);
			expect((field.modes![1] as { validation: unknown[] }).validation).toBeDefined();
		});
	});

	describe('workspaceRlcOptional', () => {
		it('is not required', () => {
			const field = workspaceRlcOptional(displayOptions);
			expect(field.required).toBe(false);
		});

		it('has optional description', () => {
			const field = workspaceRlcOptional(displayOptions);
			expect(field.description).toBe('Filter by workspace (optional)');
		});
	});

	describe('collectionRlc', () => {
		it('returns correct name and searchListMethod', () => {
			const field = collectionRlc(displayOptions);
			expect(field.name).toBe('collectionId');
			expect((field.modes![0] as { typeOptions: { searchListMethod: string } }).typeOptions.searchListMethod).toBe('searchCollections');
		});
	});

	describe('environmentRlc', () => {
		it('returns correct name and searchListMethod', () => {
			const field = environmentRlc(displayOptions);
			expect(field.name).toBe('environmentId');
			expect((field.modes![0] as { typeOptions: { searchListMethod: string } }).typeOptions.searchListMethod).toBe('searchEnvironments');
		});
	});

	describe('apiRlc', () => {
		it('returns correct name and searchListMethod', () => {
			const field = apiRlc(displayOptions);
			expect(field.name).toBe('apiId');
			expect((field.modes![0] as { typeOptions: { searchListMethod: string } }).typeOptions.searchListMethod).toBe('searchApis');
		});
	});

	describe('mockRlc', () => {
		it('returns correct name and searchListMethod', () => {
			const field = mockRlc(displayOptions);
			expect(field.name).toBe('mockId');
			expect((field.modes![0] as { typeOptions: { searchListMethod: string } }).typeOptions.searchListMethod).toBe('searchMocks');
		});
	});

	describe('monitorRlc', () => {
		it('returns correct name and searchListMethod', () => {
			const field = monitorRlc(displayOptions);
			expect(field.name).toBe('monitorId');
			expect((field.modes![0] as { typeOptions: { searchListMethod: string } }).typeOptions.searchListMethod).toBe('searchMonitors');
		});
	});
});
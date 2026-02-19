import type { INodeProperties } from 'n8n-workflow';
import { collectionRlc, mockRlc, workspaceRlcOptional } from '../../utils/rlcDefs';

export const mockOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['mock'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a mock',
				action: 'Create a mock',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a mock',
				action: 'Delete a mock',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a mock',
				action: 'Get a mock',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many mocks',
				action: 'Get many mocks',
			},
			{
				name: 'Publish',
				value: 'publish',
				description: 'Publish a mock',
				action: 'Publish a mock',
			},
			{
				name: 'Unpublish',
				value: 'unpublish',
				description: 'Unpublish a mock',
				action: 'Unpublish a mock',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a mock',
				action: 'Update a mock',
			},
		],
		default: 'getAll',
	},
];

export const mockFields: INodeProperties[] = [
	workspaceRlcOptional({
		show: {
			resource: ['mock'],
			operation: ['getAll', 'create'],
		},
	}),

	mockRlc({
		show: {
			resource: ['mock'],
			operation: ['get', 'delete', 'update', 'publish', 'unpublish'],
		},
	}),

	collectionRlc({
		show: {
			resource: ['mock'],
			operation: ['create'],
		},
	}),

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['mock'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the mock',
			},
			{
				displayName: 'Environment ID',
				name: 'environment',
				type: 'string',
				default: '',
				description: 'The environment ID to use',
			},
			{
				displayName: 'Private',
				name: 'private',
				type: 'boolean',
				default: false,
				description: 'Whether the mock server is private',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['mock'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the mock',
			},
			{
				displayName: 'Environment ID',
				name: 'environment',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Private',
				name: 'private',
				type: 'boolean',
				default: false,
				description: 'Whether the mock server is private',
			},
		],
	},
];

export { mockOperations as operations, mockFields as fields };
export { executeMock as execute } from './execute';

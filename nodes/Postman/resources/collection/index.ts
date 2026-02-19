import type { INodeProperties } from 'n8n-workflow';
import { collectionRlc, workspaceRlcOptional } from '../../utils/rlcDefs';

export const collectionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['collection'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a collection',
				action: 'Create a collection',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a collection',
				action: 'Delete a collection',
			},
			{
				name: 'Duplicate',
				value: 'duplicate',
				description: 'Duplicate a collection',
				action: 'Duplicate a collection',
			},
			{
				name: 'Fork',
				value: 'fork',
				description: 'Fork a collection',
				action: 'Fork a collection',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a collection',
				action: 'Get a collection',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many collections',
				action: 'Get many collections',
			},
			{
				name: 'Run',
				value: 'run',
				description: 'Run a collection',
				action: 'Run a collection',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a collection',
				action: 'Update a collection',
			},
		],
		default: 'getAll',
	},
];

export const collectionFields: INodeProperties[] = [
	workspaceRlcOptional({
		show: {
			resource: ['collection'],
			operation: ['getAll', 'create', 'fork'],
		},
	}),

	collectionRlc({
		show: {
			resource: ['collection'],
			operation: ['get', 'delete', 'update', 'duplicate', 'fork', 'run'],
		},
	}),

	{
		displayName: 'Collection JSON',
		name: 'collectionJson',
		type: 'json',
		required: true,
		default: '{\n  "info": {\n    "name": "My Collection",\n    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"\n  },\n  "item": []\n}',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['create'],
			},
		},
		description: 'Collection in Postman Collection v2.1.0 format',
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the collection',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the collection',
			},
		],
	},

	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['fork'],
			},
		},
		description: 'Label for the fork',
	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['collection'],
				operation: ['run'],
			},
		},
		options: [
			{
				displayName: 'Environment ID',
				name: 'environment',
				type: 'string',
				default: '',
				description: 'The environment ID to use',
			},
			{
				displayName: 'Iteration Count',
				name: 'iterationCount',
				type: 'number',
				default: 1,
				description: 'Number of iterations to run',
			},
		],
	},
];

export { collectionOperations as operations, collectionFields as fields };
export { executeCollection as execute } from './execute';

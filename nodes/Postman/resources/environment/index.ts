import type { INodeProperties } from 'n8n-workflow';
import { environmentRlc, workspaceRlcOptional } from '../../utils/rlcDefs';

export const environmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['environment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an environment',
				action: 'Create an environment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an environment',
				action: 'Delete an environment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an environment',
				action: 'Get an environment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many environments',
				action: 'Get many environments',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an environment',
				action: 'Update an environment',
			},
		],
		default: 'getAll',
	},
];

export const environmentFields: INodeProperties[] = [
	workspaceRlcOptional({
		show: {
			resource: ['environment'],
			operation: ['getAll', 'create'],
		},
	}),

	environmentRlc({
		show: {
			resource: ['environment'],
			operation: ['get', 'delete', 'update'],
		},
	}),

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['create'],
			},
		},
		description: 'Name of the environment',
	},
	{
		displayName: 'Variables',
		name: 'variables',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				name: 'values',
				displayName: 'Variable',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Default', value: 'default' },
							{ name: 'Secret', value: 'secret' },
						],
						default: 'default',
					},
					{
						displayName: 'Enabled',
						name: 'enabled',
						type: 'boolean',
						default: true,
					},
				],
			},
		],
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['environment'],
				operation: ['update'],
			},
		},
		description: 'New name for the environment',
	},
];

export { environmentOperations as operations, environmentFields as fields };
export { executeEnvironment as execute } from './execute';

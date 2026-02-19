import type { INodeProperties } from 'n8n-workflow';
import { workspaceRlc } from '../../utils/rlcDefs';

export const workspaceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workspace'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a workspace',
				action: 'Create a workspace',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a workspace',
				action: 'Delete a workspace',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a workspace',
				action: 'Get a workspace',
			},
			{
				name: 'Get Global Variables',
				value: 'getGlobalVariables',
				description: 'Get global variables of a workspace',
				action: 'Get global variables of a workspace',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many workspaces',
				action: 'Get many workspaces',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a workspace',
				action: 'Update a workspace',
			},
			{
				name: 'Update Global Variables',
				value: 'updateGlobalVariables',
				description: 'Update global variables of a workspace',
				action: 'Update global variables of a workspace',
			},
		],
		default: 'getAll',
	},
];

export const workspaceFields: INodeProperties[] = [
	workspaceRlc({
		show: {
			resource: ['workspace'],
			operation: ['get', 'delete', 'update', 'getGlobalVariables', 'updateGlobalVariables'],
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
				resource: ['workspace'],
				operation: ['create'],
			},
		},
		description: 'Name of the workspace',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		options: [
			{ name: 'Partner', value: 'partner' },
			{ name: 'Personal', value: 'personal' },
			{ name: 'Private', value: 'private' },
			{ name: 'Public', value: 'public' },
			{ name: 'Team', value: 'team' },
		],
		default: 'personal',
		displayOptions: {
			show: {
				resource: ['workspace'],
				operation: ['create'],
			},
		},
		description: 'The type of workspace',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['workspace'],
				operation: ['create'],
			},
		},
		description: 'Description of the workspace',
	},

	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['workspace'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the workspace',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the workspace',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Partner', value: 'partner' },
					{ name: 'Personal', value: 'personal' },
					{ name: 'Private', value: 'private' },
					{ name: 'Public', value: 'public' },
					{ name: 'Team', value: 'team' },
				],
				default: 'personal',
				description: 'The type of workspace',
			},
		],
	},

	{
		displayName: 'Variables',
		name: 'variables',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		displayOptions: {
			show: {
				resource: ['workspace'],
				operation: ['updateGlobalVariables'],
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
];

export { workspaceOperations as operations, workspaceFields as fields };
export { executeWorkspace as execute } from './execute';

import type { INodeProperties } from 'n8n-workflow';
import { collectionRlc, monitorRlc, workspaceRlcOptional } from '../../utils/rlcDefs';

export const monitorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['monitor'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a monitor',
				action: 'Create a monitor',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a monitor',
				action: 'Delete a monitor',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a monitor',
				action: 'Get a monitor',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many monitors',
				action: 'Get many monitors',
			},
			{
				name: 'Run',
				value: 'run',
				description: 'Run a monitor',
				action: 'Run a monitor',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a monitor',
				action: 'Update a monitor',
			},
		],
		default: 'getAll',
	},
];

export const monitorFields: INodeProperties[] = [
	workspaceRlcOptional({
		show: {
			resource: ['monitor'],
			operation: ['getAll', 'create'],
		},
	}),

	monitorRlc({
		show: {
			resource: ['monitor'],
			operation: ['get', 'delete', 'update', 'run'],
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
				resource: ['monitor'],
				operation: ['create'],
			},
		},
		description: 'Name of the monitor',
	},

	collectionRlc({
		show: {
			resource: ['monitor'],
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
				resource: ['monitor'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Environment ID',
				name: 'environment',
				type: 'string',
				default: '',
				description: 'Environment ID to use for the monitor',
			},
			{
				displayName: 'Schedule (Cron)',
				name: 'cron',
				type: 'string',
				default: '',
				description: 'Cron expression for monitor schedule',
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
				resource: ['monitor'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the monitor',
			},
			{
				displayName: 'Environment ID',
				name: 'environment',
				type: 'string',
				default: '',
			},
		],
	},
];

export { monitorOperations as operations, monitorFields as fields };
export { executeMonitor as execute } from './execute';

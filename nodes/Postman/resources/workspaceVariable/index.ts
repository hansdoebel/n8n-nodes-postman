import type { INodeProperties } from 'n8n-workflow';
import { workspaceRlc } from '../../utils/rlcDefs';

export const workspaceVariableOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workspaceVariable'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many workspace global variables',
				action: 'Get many workspace global variables',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update workspace global variables',
				action: 'Update workspace global variables',
			},
		],
		default: 'getAll',
	},
];

export const workspaceVariableFields: INodeProperties[] = [
	workspaceRlc({
		show: {
			resource: ['workspaceVariable'],
			operation: ['getAll', 'update'],
		},
	}),

	{
		displayName: 'Variables JSON',
		name: 'variablesJson',
		type: 'json',
		required: true,
		default: '[{ "key": "myVar", "value": "myValue", "type": "default", "enabled": true }]',
		displayOptions: {
			show: {
				resource: ['workspaceVariable'],
				operation: ['update'],
			},
		},
		description: 'JSON array of variable objects. Each object should have: key (string), value (string), type (default or secret), enabled (boolean). This replaces ALL existing global variables.',
	},
];

export { workspaceVariableOperations as operations, workspaceVariableFields as fields };
export { executeWorkspaceVariable as execute } from './execute';

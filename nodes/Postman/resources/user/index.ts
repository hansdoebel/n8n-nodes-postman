import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get the authenticated user',
				action: 'Get the authenticated user',
			},
		],
		default: 'get',
	},
];

export const userFields: INodeProperties[] = [];

export { userOperations as operations, userFields as fields };
export { executeUser as execute } from './execute';

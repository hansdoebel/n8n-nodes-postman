import type { INodeProperties } from 'n8n-workflow';
import { workspaceRlc } from '../../utils/rlcDefs';

export const workspaceRoleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workspaceRole'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many roles for a workspace',
				action: 'Get many roles for a workspace',
			},
			{
				name: 'Get Role Types',
				value: 'getRoleTypes',
				description: 'Get all available workspace role types',
				action: 'Get all available workspace role types',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update roles for a workspace',
				action: 'Update roles for a workspace',
			},
		],
		default: 'getAll',
	},
];

export const workspaceRoleFields: INodeProperties[] = [
	workspaceRlc({
		show: {
			resource: ['workspaceRole'],
			operation: ['getAll', 'update'],
		},
	}),

	{
		displayName: 'Roles',
		name: 'roles',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['workspaceRole'],
				operation: ['update'],
			},
		},
		description: 'Role assignments to apply',
		options: [
			{
				name: 'values',
				displayName: 'Role',
				values: [
					{
						displayName: 'Operation',
						name: 'op',
						type: 'options',
						options: [
							{ name: 'Add', value: 'add' },
							{ name: 'Remove', value: 'remove' },
							{ name: 'Update', value: 'update' },
						],
						default: 'add',
					},
					{
						displayName: 'Entity Type',
						name: 'entityType',
						type: 'options',
						options: [
							{ name: 'User', value: 'user' },
							{ name: 'User Group', value: 'userGroup' },
						],
						default: 'user',
						description: 'Whether this applies to a user or user group',
					},
					{
						displayName: 'Entity ID',
						name: 'entityId',
						type: 'number',
						default: 0,
						description: 'The ID of the user or user group',
					},
					{
						displayName: 'Role',
						name: 'role',
						type: 'options',
						options: [
							{ name: 'Admin', value: 'ADMIN' },
							{ name: 'Editor', value: 'EDITOR' },
							{ name: 'Viewer', value: 'VIEWER' },
						],
						default: 'VIEWER',
						description: 'The role to assign',
					},
				],
			},
		],
	},
];

export { workspaceRoleOperations as operations, workspaceRoleFields as fields };
export { executeWorkspaceRole as execute } from './execute';

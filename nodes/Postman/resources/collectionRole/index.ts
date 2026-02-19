import type { INodeProperties } from 'n8n-workflow';
import { collectionRlc } from '../../utils/rlcDefs';

export const collectionRoleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['collectionRole'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many roles for a collection',
				action: 'Get many roles for a collection',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update roles for a collection',
				action: 'Update roles for a collection',
			},
		],
		default: 'getAll',
	},
];

export const collectionRoleFields: INodeProperties[] = [
	collectionRlc({
		show: {
			resource: ['collectionRole'],
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
				resource: ['collectionRole'],
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
							{ name: 'Team', value: 'team' },
						],
						default: 'user',
						description: 'Whether this applies to a user, user group, or team',
					},
					{
						displayName: 'Entity ID',
						name: 'entityId',
						type: 'number',
						default: 0,
						description: 'The ID of the user, user group, or team',
					},
					{
						displayName: 'Role',
						name: 'role',
						type: 'options',
						options: [
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

export { collectionRoleOperations as operations, collectionRoleFields as fields };
export { executeCollectionRole as execute } from './execute';

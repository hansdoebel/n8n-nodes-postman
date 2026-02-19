import type { INodeProperties } from 'n8n-workflow';
import { collectionRlc } from '../../utils/rlcDefs';

export const commentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['comment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a comment on a collection',
				action: 'Create a comment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a comment',
				action: 'Delete a comment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many comments on a collection',
				action: 'Get many comments',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a comment',
				action: 'Update a comment',
			},
		],
		default: 'getAll',
	},
];

export const commentFields: INodeProperties[] = [
	collectionRlc({
		show: {
			resource: ['comment'],
			operation: ['getAll', 'create', 'update', 'delete'],
		},
	}),

	{
		displayName: 'Comment ID',
		name: 'commentId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['update', 'delete'],
			},
		},
		description: 'The ID of the comment',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['comment'],
				operation: ['create', 'update'],
			},
		},
		description: 'The comment text',
	},
];

export { commentOperations as operations, commentFields as fields };
export { executeComment as execute } from './execute';

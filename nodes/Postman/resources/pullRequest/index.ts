import type { INodeProperties } from 'n8n-workflow';
import { collectionRlc } from '../../utils/rlcDefs';

export const pullRequestOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pullRequest'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a pull request for a collection fork',
				action: 'Create a pull request',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a pull request',
				action: 'Delete a pull request',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a pull request',
				action: 'Get a pull request',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many pull requests for a collection',
				action: 'Get many pull requests',
			},
			{
				name: 'Merge',
				value: 'merge',
				description: 'Merge a pull request',
				action: 'Merge a pull request',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a pull request',
				action: 'Update a pull request',
			},
		],
		default: 'getAll',
	},
];

export const pullRequestFields: INodeProperties[] = [
	collectionRlc({
		show: {
			resource: ['pullRequest'],
			operation: ['getAll', 'create'],
		},
	}),

	{
		displayName: 'Pull Request ID',
		name: 'pullRequestId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['pullRequest'],
				operation: ['get', 'delete', 'update', 'merge'],
			},
		},
		description: 'The ID of the pull request',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['pullRequest'],
				operation: ['create'],
			},
		},
		description: 'Title of the pull request',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['pullRequest'],
				operation: ['create'],
			},
		},
		description: 'Description of the pull request',
	},
	{
		...collectionRlc({
			show: {
				resource: ['pullRequest'],
				operation: ['create'],
			},
		}),
		displayName: 'Destination Collection',
		name: 'destinationId',
		description: 'The destination (parent) collection to merge into',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['pullRequest'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'New title for the pull request',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the pull request',
			},
		],
	},
];

export { pullRequestOperations as operations, pullRequestFields as fields };
export { executePullRequest as execute } from './execute';

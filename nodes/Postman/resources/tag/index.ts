import type { INodeProperties } from 'n8n-workflow';
import { collectionRlc, workspaceRlc } from '../../utils/rlcDefs';

export const tagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tag'],
			},
		},
		options: [
			{
				name: 'Get Collection Tags',
				value: 'getCollectionTags',
				description: 'Get all tags on a collection',
				action: 'Get collection tags',
			},
			{
				name: 'Get Tagged Entities',
				value: 'getTaggedEntities',
				description: 'Get all entities with a specific tag',
				action: 'Get tagged entities',
			},
			{
				name: 'Get Workspace Tags',
				value: 'getWorkspaceTags',
				description: 'Get all tags on a workspace',
				action: 'Get workspace tags',
			},
			{
				name: 'Set Collection Tags',
				value: 'setCollectionTags',
				description: 'Set (replace) tags on a collection',
				action: 'Set collection tags',
			},
			{
				name: 'Set Workspace Tags',
				value: 'setWorkspaceTags',
				description: 'Set (replace) tags on a workspace',
				action: 'Set workspace tags',
			},
		],
		default: 'getCollectionTags',
	},
];

export const tagFields: INodeProperties[] = [
	collectionRlc({
		show: {
			resource: ['tag'],
			operation: ['getCollectionTags', 'setCollectionTags'],
		},
	}),

	workspaceRlc({
		show: {
			resource: ['tag'],
			operation: ['getWorkspaceTags', 'setWorkspaceTags'],
		},
	}),

	{
		displayName: 'Tag Slug',
		name: 'tagSlug',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['getTaggedEntities'],
			},
		},
		description: 'The tag slug to search by',
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['setCollectionTags', 'setWorkspaceTags'],
			},
		},
		description: 'Comma-separated list of tag slugs to set',
	},
];

export { tagOperations as operations, tagFields as fields };
export { executeTag as execute } from './execute';

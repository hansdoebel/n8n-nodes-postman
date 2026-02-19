import type { INodeProperties } from 'n8n-workflow';
import { collectionRlc } from '../../utils/rlcDefs';

export const collectionFolderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['collectionFolder'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a folder in a collection',
				action: 'Create a collection folder',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a folder from a collection',
				action: 'Delete a collection folder',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a folder from a collection',
				action: 'Get a collection folder',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a folder in a collection',
				action: 'Update a collection folder',
			},
		],
		default: 'get',
	},
];

export const collectionFolderFields: INodeProperties[] = [
	collectionRlc({
		show: {
			resource: ['collectionFolder'],
			operation: ['create', 'get', 'delete', 'update'],
		},
	}),

	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['collectionFolder'],
				operation: ['get', 'delete', 'update'],
			},
		},
		description: 'The ID of the folder',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['collectionFolder'],
				operation: ['create'],
			},
		},
		description: 'Name of the folder',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['collectionFolder'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the folder',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the folder',
			},
		],
	},
];

export { collectionFolderOperations as operations, collectionFolderFields as fields };
export { executeCollectionFolder as execute } from './execute';

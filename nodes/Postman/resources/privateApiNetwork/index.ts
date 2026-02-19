import type { INodeProperties } from 'n8n-workflow';

export const privateApiNetworkOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['privateApiNetwork'],
			},
		},
		options: [
			{
				name: 'Add Element or Folder',
				value: 'add',
				description: 'Add an element or folder to the Private API Network',
				action: 'Add an element or folder to the private api network',
			},
			{
				name: 'Get Add Element Requests',
				value: 'getRequests',
				description: 'Get all add element requests for the Private API Network',
				action: 'Get all add element requests for the private api network',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many elements and folders in the Private API Network',
				action: 'Get many elements and folders in the private api network',
			},
			{
				name: 'Remove Element or Folder',
				value: 'remove',
				description: 'Remove an element or folder from the Private API Network',
				action: 'Remove an element or folder from the private api network',
			},
			{
				name: 'Update Element or Folder',
				value: 'update',
				description: 'Update an element or folder in the Private API Network',
				action: 'Update an element or folder in the private api network',
			},
		],
		default: 'getAll',
	},
];

export const privateApiNetworkFields: INodeProperties[] = [
	{
		displayName: 'Element Type',
		name: 'elementType',
		type: 'options',
		required: true,
		default: 'api',
		options: [
			{ name: 'API', value: 'api' },
			{ name: 'Collection', value: 'collection' },
			{ name: 'Folder', value: 'folder' },
			{ name: 'Workspace', value: 'workspace' },
		],
		displayOptions: {
			show: {
				resource: ['privateApiNetwork'],
				operation: ['add', 'update', 'remove'],
			},
		},
		description: 'The type of element',
	},
	{
		displayName: 'Element ID',
		name: 'elementId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['privateApiNetwork'],
				operation: ['add'],
				elementType: ['api', 'collection', 'workspace'],
			},
		},
		description: 'The ID of the element to add',
	},
	{
		displayName: 'Parent Folder ID',
		name: 'parentFolderId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['privateApiNetwork'],
				operation: ['add'],
				elementType: ['api', 'collection', 'workspace'],
			},
		},
		description: 'The ID of the parent folder',
	},
	{
		displayName: 'Folder Name',
		name: 'folderName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['privateApiNetwork'],
				operation: ['add'],
				elementType: ['folder'],
			},
		},
		description: 'The name of the folder to create',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['privateApiNetwork'],
				operation: ['add'],
				elementType: ['folder'],
			},
		},
		options: [
			{
				displayName: 'Folder Description',
				name: 'folderDescription',
				type: 'string',
				default: '',
				description: 'The description of the folder',
			},
			{
				displayName: 'Parent Folder ID',
				name: 'parentFolderId',
				type: 'number',
				default: 0,
				description: 'The ID of the parent folder',
			},
		],
	},
	{
		displayName: 'Element ID',
		name: 'elementId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['privateApiNetwork'],
				operation: ['update', 'remove'],
			},
		},
		description: 'The ID of the element or folder',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['privateApiNetwork'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Folder Description',
				name: 'folderDescription',
				type: 'string',
				default: '',
				description: 'The description of the folder',
			},
			{
				displayName: 'Folder Name',
				name: 'folderName',
				type: 'string',
				default: '',
				description: 'The name of the folder',
			},
			{
				displayName: 'Parent Folder ID',
				name: 'parentFolderId',
				type: 'number',
				default: 0,
				description: 'The ID of the parent folder',
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['privateApiNetwork'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Added By',
				name: 'addedBy',
				type: 'number',
				default: 0,
				description: 'Filter by the user ID who added the element',
			},
			{
				displayName: 'Created By',
				name: 'createdBy',
				type: 'number',
				default: 0,
				description: 'Filter by the user ID who created the element',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Filter by description',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				default: 'asc',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				description: 'The sort direction',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by name',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				description: 'The number of results to skip',
			},
			{
				displayName: 'Parent Folder ID',
				name: 'parentFolderId',
				type: 'number',
				default: 0,
				description: 'Filter by parent folder ID',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				default: 'createdAt',
				options: [
					{ name: 'Created At', value: 'createdAt' },
					{ name: 'Updated At', value: 'updatedAt' },
				],
				description: 'The field to sort by',
			},
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				default: '',
				description: 'Filter by summary',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'api',
				options: [
					{ name: 'API', value: 'api' },
					{ name: 'Collection', value: 'collection' },
					{ name: 'Folder', value: 'folder' },
					{ name: 'Workspace', value: 'workspace' },
				],
				description: 'Filter by element type',
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['privateApiNetwork'],
				operation: ['getRequests'],
			},
		},
		options: [
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				default: 'asc',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				description: 'The sort direction',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by name',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				description: 'The number of results to skip',
			},
			{
				displayName: 'Requested By',
				name: 'requestedBy',
				type: 'number',
				default: 0,
				description: 'Filter by the user ID who requested the element',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				default: 'createdAt',
				options: [
					{ name: 'Created At', value: 'createdAt' },
					{ name: 'Updated At', value: 'updatedAt' },
				],
				description: 'The field to sort by',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'pending',
				options: [
					{ name: 'Denied', value: 'denied' },
					{ name: 'Pending', value: 'pending' },
				],
				description: 'Filter by request status',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'api',
				options: [
					{ name: 'API', value: 'api' },
					{ name: 'Collection', value: 'collection' },
					{ name: 'Folder', value: 'folder' },
					{ name: 'Workspace', value: 'workspace' },
				],
				description: 'Filter by element type',
			},
		],
	},
];

export { privateApiNetworkOperations as operations, privateApiNetworkFields as fields };
export { executePrivateApiNetwork as execute } from './execute';

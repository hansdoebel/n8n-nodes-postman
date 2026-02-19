import type { INodeProperties } from 'n8n-workflow';
import { collectionRlc } from '../../utils/rlcDefs';

export const collectionRequestOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['collectionRequest'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a request in a collection',
				action: 'Create a collection request',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a request from a collection',
				action: 'Delete a collection request',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a request from a collection',
				action: 'Get a collection request',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a request in a collection',
				action: 'Update a collection request',
			},
		],
		default: 'get',
	},
];

export const collectionRequestFields: INodeProperties[] = [
	collectionRlc({
		show: {
			resource: ['collectionRequest'],
			operation: ['create', 'get', 'delete', 'update'],
		},
	}),

	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['collectionRequest'],
				operation: ['get', 'delete', 'update'],
			},
		},
		description: 'The ID of the request',
	},
	{
		displayName: 'Request Body',
		name: 'requestBody',
		type: 'json',
		required: true,
		default: '{\n  "name": "My Request",\n  "request": {\n    "method": "GET",\n    "url": {\n      "raw": "https://example.com",\n      "host": ["example.com"],\n      "protocol": "https"\n    }\n  }\n}',
		displayOptions: {
			show: {
				resource: ['collectionRequest'],
				operation: ['create', 'update'],
			},
		},
		description: 'Request object in Postman Collection v2.1.0 item format',
	},
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['collectionRequest'],
				operation: ['create'],
			},
		},
		description: 'Optional folder ID to create the request inside',
	},
];

export { collectionRequestOperations as operations, collectionRequestFields as fields };
export { executeCollectionRequest as execute } from './execute';

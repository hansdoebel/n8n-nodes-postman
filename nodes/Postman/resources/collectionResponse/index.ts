import type { INodeProperties } from 'n8n-workflow';
import { collectionRlc } from '../../utils/rlcDefs';

export const collectionResponseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['collectionResponse'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a saved response for a request',
				action: 'Create a collection response',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a saved response',
				action: 'Delete a collection response',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a saved response',
				action: 'Get a collection response',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a saved response',
				action: 'Update a collection response',
			},
		],
		default: 'get',
	},
];

export const collectionResponseFields: INodeProperties[] = [
	collectionRlc({
		show: {
			resource: ['collectionResponse'],
			operation: ['get', 'create', 'update', 'delete'],
		},
	}),

	{
		displayName: 'Response ID',
		name: 'responseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['collectionResponse'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the saved response',
	},
	{
		displayName: 'Response JSON',
		name: 'responseJson',
		type: 'json',
		required: true,
		default: '{\n  "name": "Example Response",\n  "status": "OK",\n  "code": 200,\n  "header": [],\n  "body": ""\n}',
		displayOptions: {
			show: {
				resource: ['collectionResponse'],
				operation: ['create'],
			},
		},
		description: 'The response object in Postman collection format',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['collectionResponse'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the response',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				description: 'HTTP status text (e.g. OK)',
			},
			{
				displayName: 'Status Code',
				name: 'code',
				type: 'number',
				default: 200,
				description: 'HTTP status code',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				default: '',
				description: 'Response body',
			},
		],
	},
];

export { collectionResponseOperations as operations, collectionResponseFields as fields };
export { executeCollectionResponse as execute } from './execute';

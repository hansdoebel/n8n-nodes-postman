import type { INodeProperties } from 'n8n-workflow';
import { apiRlc, workspaceRlcOptional } from '../../utils/rlcDefs';

export const apiOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['api'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an API',
				action: 'Create an API',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an API',
				action: 'Delete an API',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an API',
				action: 'Get an API',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many APIs',
				action: 'Get many apis',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an API',
				action: 'Update an API',
			},
		],
		default: 'getAll',
	},
];

export const apiFields: INodeProperties[] = [
	workspaceRlcOptional({
		show: {
			resource: ['api'],
			operation: ['getAll', 'create'],
		},
	}),

	apiRlc({
		show: {
			resource: ['api'],
			operation: ['get', 'delete', 'update'],
		},
	}),

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['api'],
				operation: ['create'],
			},
		},
		description: 'Name of the API',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['api'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				default: '',
				description: 'Short summary of the API',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the API',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['api'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the API',
			},
			{
				displayName: 'Summary',
				name: 'summary',
				type: 'string',
				default: '',
				description: 'New summary for the API',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the API',
			},
		],
	},
];

export { apiOperations as operations, apiFields as fields };
export { executeApi as execute } from './execute';

import type { INodeProperties } from 'n8n-workflow';
import { apiRlc } from '../../utils/rlcDefs';

export const specOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['spec'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an API schema',
				action: 'Create an API schema',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an API schema',
				action: 'Delete an API schema',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an API schema',
				action: 'Get an API schema',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many API schemas',
				action: 'Get many API schemas',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an API schema',
				action: 'Update an API schema',
			},
		],
		default: 'getAll',
	},
];

export const specFields: INodeProperties[] = [
	apiRlc({
		show: {
			resource: ['spec'],
			operation: ['getAll', 'create', 'get', 'delete', 'update'],
		},
	}),

	{
		displayName: 'Schema ID',
		name: 'schemaId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spec'],
				operation: ['get', 'delete', 'update'],
			},
		},
		description: 'The ID of the schema',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		default: 'openapi3',
		displayOptions: {
			show: {
				resource: ['spec'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Async API 2.0', value: 'asyncapi2' },
			{ name: 'GraphQL', value: 'graphql' },
			{ name: 'OpenAPI 2.0 (Swagger)', value: 'openapi2' },
			{ name: 'OpenAPI 3.0', value: 'openapi3' },
			{ name: 'Protobuf 2', value: 'proto2' },
			{ name: 'Protobuf 3', value: 'proto3' },
			{ name: 'RAML 0.8', value: 'raml' },
			{ name: 'RAML 1.0', value: 'raml1' },
		],
		description: 'The schema type',
	},
	{
		displayName: 'Schema Content',
		name: 'schema',
		type: 'string',
		typeOptions: { rows: 8 },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['spec'],
				operation: ['create', 'update'],
			},
		},
		description: 'The schema content (YAML or JSON string)',
	},
];

export { specOperations as operations, specFields as fields };
export { executeSpec as execute } from './execute';

import type { INodeProperties } from 'n8n-workflow';
import { collectionRlc } from '../../utils/rlcDefs';

export const forkOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['fork'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get collection forks',
				action: 'Get collection forks',
			},
			{
				name: 'Get Source Status',
				value: 'getSourceStatus',
				description: 'Get source status of a forked collection',
				action: 'Get source status of a forked collection',
			},
			{
				name: 'Get User Forks',
				value: 'getUserForks',
				description: "Get user's forked collections",
				action: 'Get user forked collections',
			},
			{
				name: 'Merge',
				value: 'merge',
				description: 'Merge a forked collection',
				action: 'Merge a forked collection',
			},
		],
		default: 'getAll',
	},
];

export const forkFields: INodeProperties[] = [
	collectionRlc({
		show: {
			resource: ['fork'],
			operation: ['getAll', 'getSourceStatus'],
		},
	}),

	{
		...collectionRlc({
			show: {
				resource: ['fork'],
				operation: ['merge'],
			},
		}),
		displayName: 'Source Collection',
		name: 'source',
		description: 'The source (forked) collection to merge from',
	},

	{
		...collectionRlc({
			show: {
				resource: ['fork'],
				operation: ['merge'],
			},
		}),
		displayName: 'Destination Collection',
		name: 'destination',
		description: 'The destination (parent) collection to merge into',
	},

	{
		displayName: 'Strategy',
		name: 'strategy',
		type: 'options',
		default: 'updateSourceWithDestination',
		displayOptions: {
			show: {
				resource: ['fork'],
				operation: ['merge'],
			},
		},
		options: [
			{
				name: 'Delete Source',
				value: 'deleteSource',
				description: 'Delete the forked collection after merging',
			},
			{
				name: 'Update Source With Destination',
				value: 'updateSourceWithDestination',
				description: 'Update the forked collection with destination changes',
			},
		],
		description: 'The merge strategy to use',
	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['fork'],
				operation: ['getAll', 'getUserForks'],
			},
		},
		options: [
			{
				displayName: 'Cursor',
				name: 'cursor',
				type: 'string',
				default: '',
				description: 'Pagination cursor for the next set of results',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				default: 'asc',
				options: [
					{
						name: 'Ascending',
						value: 'asc',
					},
					{
						name: 'Descending',
						value: 'desc',
					},
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
		],
	},
];

export { forkOperations as operations, forkFields as fields };
export { executeFork as execute } from './execute';

import type { INodeProperties } from 'n8n-workflow';

export const teamOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['team'],
			},
		},
		options: [
			{
				name: 'Approve or Deny Access Request',
				value: 'approveAccessRequest',
				description: 'Approve or deny a team access request',
				action: 'Approve or deny a team access request',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a team',
				action: 'Create a team',
			},
			{
				name: 'Create Access Request',
				value: 'createAccessRequest',
				description: 'Create an access request for a team',
				action: 'Create a team access request',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a team',
				action: 'Get a team',
			},
			{
				name: 'Get Access Requests',
				value: 'getAccessRequests',
				description: "Get a team's pending access requests",
				action: 'Get access requests for a team',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many teams',
				action: 'Get many teams',
			},
			{
				name: 'Get Settings',
				value: 'getSettings',
				description: "Get a team's settings",
				action: 'Get settings for a team',
			},
			{
				name: 'Manage Member Roles',
				value: 'manageMemberRoles',
				description: 'Add or remove roles for team members',
				action: 'Manage team member roles',
			},
			{
				name: 'Remove Members',
				value: 'removeMembers',
				description: 'Remove members from a team',
				action: 'Remove team members',
			},
			{
				name: 'Update Settings',
				value: 'updateSettings',
				description: "Update a team's settings",
				action: 'Update settings for a team',
			},
		],
		default: 'getAll',
	},
];

export const teamFields: INodeProperties[] = [
	{
		displayName: 'Team ID',
		name: 'teamId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: [
					'get',
					'getAccessRequests',
					'createAccessRequest',
					'approveAccessRequest',
					'manageMemberRoles',
					'removeMembers',
					'getSettings',
					'updateSettings',
				],
			},
		},
		description: "The team's ID",
	},

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['create'],
			},
		},
		description: "The team's name",
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['create'],
			},
		},
		description: "The team's description",
	},

	{
		displayName: 'Access Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['approveAccessRequest'],
			},
		},
		description: "The access request's ID",
	},
	{
		displayName: 'Action',
		name: 'action',
		type: 'options',
		required: true,
		options: [
			{ name: 'Approve', value: 'approve', action: 'Approve a team access request' },
			{ name: 'Deny', value: 'deny', action: 'Deny a team access request' },
		],
		default: 'approve',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['approveAccessRequest'],
			},
		},
		description: 'Whether to approve or deny the access request',
	},

	{
		displayName: 'Entity List',
		name: 'entityList',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['createAccessRequest'],
			},
		},
		options: [
			{
				name: 'values',
				displayName: 'Entity',
				values: [
					{
						displayName: 'Entity Type',
						name: 'entityType',
						type: 'string',
						default: '',
						description: 'The type of entity (e.g. user, group)',
					},
					{
						displayName: 'Entity ID',
						name: 'entityId',
						type: 'string',
						default: '',
						description: "The entity's ID",
					},
				],
			},
		],
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['createAccessRequest'],
			},
		},
		description: 'The role to request access for',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['createAccessRequest'],
			},
		},
		options: [
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				description: 'Reason for the access request',
			},
			{
				displayName: 'Request Type',
				name: 'requestType',
				type: 'string',
				default: '',
				description: 'The type of access request',
			},
		],
	},

	{
		displayName: 'Members to Remove',
		name: 'entities',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['removeMembers'],
			},
		},
		options: [
			{
				name: 'values',
				displayName: 'Entity',
				values: [
					{
						displayName: 'Entity Type',
						name: 'entityType',
						type: 'string',
						default: '',
						description: 'The type of entity (e.g. user, group)',
					},
					{
						displayName: 'Entity ID',
						name: 'entityId',
						type: 'string',
						default: '',
						description: "The entity's ID",
					},
				],
			},
		],
	},

	{
		displayName: 'Add Roles',
		name: 'addRoles',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['manageMemberRoles'],
			},
		},
		description:
			'Roles to add, as an object with keys "users", "groups", "orgs", "teams" mapping to entity IDs and role arrays',
	},
	{
		displayName: 'Remove Roles',
		name: 'removeRoles',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['manageMemberRoles'],
			},
		},
		description:
			'Roles to remove, as an object with keys "users", "groups", "orgs", "teams" mapping to entity IDs and role arrays',
	},

	{
		displayName: 'Settings',
		name: 'settings',
		type: 'collection',
		placeholder: 'Add Setting',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['updateSettings'],
			},
		},
		options: [
			{
				displayName: 'Require Approval for Add Collaborator',
				name: 'rfa_for_add_collaborator',
				type: 'boolean',
				default: false,
				description: 'Whether to require approval when adding a collaborator to the team',
			},
			{
				displayName: 'Require Approval for Add Member',
				name: 'rfa_for_add_member',
				type: 'boolean',
				default: false,
				description: 'Whether to require approval when adding a member to the team',
			},
		],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{
						name: 'Members',
						value: 'members',
						description: 'Include all users and groups with access to the team',
					},
					{
						name: 'User Roles',
						value: 'userRoles',
						description: "Include the team's user roles",
					},
				],
				default: [],
				description: 'Additional information to include in the response',
			},
		],
	},

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['getAll'],
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
				displayName: 'Include Settings',
				name: 'settings',
				type: 'boolean',
				default: false,
				description: 'Whether to return team settings in the response',
			},
			{
				displayName: 'Include User Roles',
				name: 'userRoles',
				type: 'boolean',
				default: false,
				description: "Whether to return the team's user roles in the response",
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

	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['team'],
				operation: ['getAccessRequests'],
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

export { teamOperations as operations, teamFields as fields };
export { executeTeam as execute } from './execute';

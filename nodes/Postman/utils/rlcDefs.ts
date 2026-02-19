import type { INodeProperties } from 'n8n-workflow';

const UUID_REGEX = '[0-9a-fA-F-]+';

function rlc(
	displayName: string,
	name: string,
	description: string,
	searchListMethod: string,
	displayOptions: INodeProperties['displayOptions'],
	extra?: Partial<INodeProperties>,
): INodeProperties {
	return {
		displayName,
		name,
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: `Select a ${displayName.toLowerCase()}...`,
				typeOptions: {
					searchListMethod,
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. abc123',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: UUID_REGEX,
							errorMessage: 'Not a valid ID',
						},
					},
				],
			},
		],
		displayOptions,
		...extra,
	} as INodeProperties;
}

export function workspaceRlc(
	displayOptions: INodeProperties['displayOptions'],
	extra?: Partial<INodeProperties>,
): INodeProperties {
	return rlc('Workspace', 'workspaceId', 'The workspace to use', 'searchWorkspaces', displayOptions, extra);
}

export function workspaceRlcOptional(
	displayOptions: INodeProperties['displayOptions'],
): INodeProperties {
	const field = workspaceRlc(displayOptions, { required: false });
	return {
		...field,
		default: { mode: 'list', value: '' },
		required: false,
		description: 'Filter by workspace (optional)',
	};
}

export function collectionRlc(
	displayOptions: INodeProperties['displayOptions'],
	extra?: Partial<INodeProperties>,
): INodeProperties {
	return rlc('Collection', 'collectionId', 'The collection to use', 'searchCollections', displayOptions, extra);
}

export function environmentRlc(
	displayOptions: INodeProperties['displayOptions'],
	extra?: Partial<INodeProperties>,
): INodeProperties {
	return rlc('Environment', 'environmentId', 'The environment to use', 'searchEnvironments', displayOptions, extra);
}

export function apiRlc(
	displayOptions: INodeProperties['displayOptions'],
	extra?: Partial<INodeProperties>,
): INodeProperties {
	return rlc('API', 'apiId', 'The API to use', 'searchApis', displayOptions, extra);
}

export function mockRlc(
	displayOptions: INodeProperties['displayOptions'],
	extra?: Partial<INodeProperties>,
): INodeProperties {
	return rlc('Mock', 'mockId', 'The mock to use', 'searchMocks', displayOptions, extra);
}

export function monitorRlc(
	displayOptions: INodeProperties['displayOptions'],
	extra?: Partial<INodeProperties>,
): INodeProperties {
	return rlc('Monitor', 'monitorId', 'The monitor to use', 'searchMonitors', displayOptions, extra);
}

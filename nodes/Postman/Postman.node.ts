import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { resourceOptions, resourceProperties, executorMap } from './resources/index';
import {
	searchWorkspaces,
	searchCollections,
	searchEnvironments,
	searchApis,
	searchMocks,
	searchMonitors,
} from './utils/loadOptions';

export class Postman implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Postman',
		name: 'postman',
		icon: 'file:../../icons/postman.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Postman API',
		defaults: {
			name: 'Postman',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'postmanApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: resourceOptions,
				default: 'collection',
			},
			...resourceProperties,
		],
	};

	methods = {
		listSearch: {
			searchWorkspaces(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return searchWorkspaces.call(this, filter);
			},
			searchCollections(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return searchCollections.call(this, filter);
			},
			searchEnvironments(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return searchEnvironments.call(this, filter);
			},
			searchApis(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return searchApis.call(this, filter);
			},
			searchMocks(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return searchMocks.call(this, filter);
			},
			searchMonitors(this: ILoadOptionsFunctions, filter?: string): Promise<INodeListSearchResult> {
				return searchMonitors.call(this, filter);
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				const executor = executorMap[resource];
				if (!executor) {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}

				const result = await executor.call(this, operation, i);
				returnData.push(result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

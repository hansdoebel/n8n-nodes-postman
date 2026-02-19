import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const qs: IDataObject = {};
		if (workspaceId) qs.workspace = workspaceId;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.ENVIRONMENTS, {}, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async get(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const environmentId = rlcValue(this, 'environmentId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.ENVIRONMENT(environmentId));
		return { json: (response.environment as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async create(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const name = this.getNodeParameter('name', i) as string;
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const variables = (this.getNodeParameter('variables', i, {}) as IDataObject).values as IDataObject[] ?? [];
		const qs: IDataObject = {};
		if (workspaceId) qs.workspace = workspaceId;
		const body: IDataObject = {
			environment: { name, values: variables },
		};
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.ENVIRONMENTS, body, qs);
		return { json: (response.environment as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async update(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const environmentId = rlcValue(this, 'environmentId', i);
		const name = this.getNodeParameter('name', i, '') as string;
		const variables = (this.getNodeParameter('variables', i, {}) as IDataObject).values as IDataObject[] ?? [];
		const envBody: IDataObject = {};
		if (name) envBody.name = name;
		if (variables.length) envBody.values = variables;
		const body: IDataObject = { environment: envBody };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.ENVIRONMENT(environmentId), body);
		return { json: (response.environment as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async delete(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const environmentId = rlcValue(this, 'environmentId', i);
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.ENVIRONMENT(environmentId));
		return { json: (response.environment as IDataObject) ?? response, pairedItem: { item: i } };
	},
};

export async function executeEnvironment(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData> {
	const handler = operations[operation];
	if (!handler) {
		throw new Error(`Unknown operation: ${operation}`);
	}
	return handler.call(this, i);
}

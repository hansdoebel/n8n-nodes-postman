import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const qs: IDataObject = {};
		if (workspaceId) qs.workspaceId = workspaceId;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.APIS, {}, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async get(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const apiId = rlcValue(this, 'apiId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.API(apiId));
		return { json: (response.api as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async create(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const name = this.getNodeParameter('name', i) as string;
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const qs: IDataObject = {};
		if (workspaceId) qs.workspaceId = workspaceId;
		const body: IDataObject = { name, ...additionalFields };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.APIS, body, qs);
		return { json: (response.api as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async update(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const apiId = rlcValue(this, 'apiId', i);
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.API(apiId), updateFields);
		return { json: (response.api as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async delete(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const apiId = rlcValue(this, 'apiId', i);
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.API(apiId));
		return { json: (response.api as IDataObject) ?? response, pairedItem: { item: i } };
	},
};

export async function executeApi(
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

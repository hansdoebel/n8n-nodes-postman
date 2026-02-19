import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(i) {
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.WORKSPACES);
		return { json: response, pairedItem: { item: i } };
	},

	async get(i) {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.WORKSPACE(workspaceId));
		return { json: (response.workspace as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async create(i) {
		const name = this.getNodeParameter('name', i) as string;
		const type = this.getNodeParameter('type', i) as string;
		const description = this.getNodeParameter('description', i, '') as string;
		const body: IDataObject = { workspace: { name, type } };
		if (description) (body.workspace as IDataObject).description = description;
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.WORKSPACES, body);
		return { json: (response.workspace as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async update(i) {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		const body: IDataObject = { workspace: { ...updateFields } };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.WORKSPACE(workspaceId), body);
		return { json: (response.workspace as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async delete(i) {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.WORKSPACE(workspaceId));
		return { json: (response.workspace as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async getGlobalVariables(i) {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.WORKSPACE_GLOBAL_VARIABLES(workspaceId));
		return { json: response, pairedItem: { item: i } };
	},

	async updateGlobalVariables(i) {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const variables = (this.getNodeParameter('variables', i, {}) as IDataObject).values as IDataObject[] ?? [];
		const body: IDataObject = { values: variables };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.WORKSPACE_GLOBAL_VARIABLES(workspaceId), body);
		return { json: response, pairedItem: { item: i } };
	},
};

export async function executeWorkspace(
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

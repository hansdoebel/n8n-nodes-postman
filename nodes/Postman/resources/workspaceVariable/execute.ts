import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(i) {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.WORKSPACE_GLOBAL_VARIABLES(workspaceId));
		return { json: response, pairedItem: { item: i } };
	},

	async update(i) {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const variablesJson = this.getNodeParameter('variablesJson', i) as IDataObject;
		const values = typeof variablesJson === 'string' ? JSON.parse(variablesJson) : variablesJson;
		const body: IDataObject = { values };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.WORKSPACE_GLOBAL_VARIABLES(workspaceId), body);
		return { json: response as IDataObject, pairedItem: { item: i } };
	},
};

export async function executeWorkspaceVariable(
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

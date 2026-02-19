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
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.MOCKS, {}, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async get(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const mockId = rlcValue(this, 'mockId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.MOCK(mockId));
		return { json: (response.mock as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async create(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const qs: IDataObject = {};
		if (workspaceId) qs.workspace = workspaceId;
		const mockBody: IDataObject = { collection: collectionId, ...additionalFields };
		const body: IDataObject = { mock: mockBody };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.MOCKS, body, qs);
		return { json: (response.mock as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async update(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const mockId = rlcValue(this, 'mockId', i);
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		const body: IDataObject = { mock: { ...updateFields } };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.MOCK(mockId), body);
		return { json: (response.mock as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async delete(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const mockId = rlcValue(this, 'mockId', i);
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.MOCK(mockId));
		return { json: (response.mock as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async publish(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const mockId = rlcValue(this, 'mockId', i);
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.MOCK_PUBLISH(mockId));
		return { json: (response.mock as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async unpublish(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const mockId = rlcValue(this, 'mockId', i);
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.MOCK_UNPUBLISH(mockId));
		return { json: (response.mock as IDataObject) ?? response, pairedItem: { item: i } };
	},
};

export async function executeMock(
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

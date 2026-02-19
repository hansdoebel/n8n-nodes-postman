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
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.COLLECTIONS, {}, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async get(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.COLLECTION(collectionId));
		return { json: (response.collection as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async create(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const collectionJson = this.getNodeParameter('collectionJson', i) as IDataObject;
		const qs: IDataObject = {};
		if (workspaceId) qs.workspace = workspaceId;
		const body: IDataObject = { collection: typeof collectionJson === 'string' ? JSON.parse(collectionJson) : collectionJson };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.COLLECTIONS, body, qs);
		return { json: (response.collection as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async update(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		const body: IDataObject = { collection: { info: { ...updateFields } } };
		const response = await postmanApiRequest.call(this, 'PATCH', ENDPOINTS.COLLECTION(collectionId), body);
		return { json: (response.collection as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async delete(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.COLLECTION(collectionId));
		return { json: (response.collection as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async fork(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const label = this.getNodeParameter('label', i) as string;
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const qs: IDataObject = {};
		if (workspaceId) qs.workspace = workspaceId;
		const body: IDataObject = { label };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.COLLECTION_FORKS(collectionId), body, qs);
		return { json: (response.collection as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async duplicate(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.COLLECTION_COPY(collectionId));
		return { json: (response.collection as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async run(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = { ...additionalFields };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.COLLECTION_RUN(collectionId), body);
		return { json: response, pairedItem: { item: i } };
	},
};

export async function executeCollection(
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

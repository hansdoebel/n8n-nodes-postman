import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async create(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const requestBody = this.getNodeParameter('requestBody', i) as IDataObject;
		const folderId = this.getNodeParameter('folderId', i, '') as string;
		const qs: IDataObject = {};
		if (folderId) qs.folder = folderId;
		const body = typeof requestBody === 'string' ? JSON.parse(requestBody) : requestBody;
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.COLLECTION_REQUESTS(collectionId), body, qs);
		return { json: (response.data as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async get(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const requestId = this.getNodeParameter('requestId', i) as string;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.COLLECTION_REQUEST(collectionId, requestId));
		return { json: (response.data as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async update(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const requestId = this.getNodeParameter('requestId', i) as string;
		const requestBody = this.getNodeParameter('requestBody', i) as IDataObject;
		const body = typeof requestBody === 'string' ? JSON.parse(requestBody) : requestBody;
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.COLLECTION_REQUEST(collectionId, requestId), body);
		return { json: (response.data as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async delete(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const requestId = this.getNodeParameter('requestId', i) as string;
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.COLLECTION_REQUEST(collectionId, requestId));
		return { json: (response.data as IDataObject) ?? response, pairedItem: { item: i } };
	},
};

export async function executeCollectionRequest(
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

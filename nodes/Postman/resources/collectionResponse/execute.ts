import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async get(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const responseId = this.getNodeParameter('responseId', i) as string;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.COLLECTION_RESPONSE(collectionId, responseId));
		return { json: (response.response as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async create(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const responseJson = this.getNodeParameter('responseJson', i) as IDataObject;
		const body: IDataObject = { response: typeof responseJson === 'string' ? JSON.parse(responseJson) : responseJson };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.COLLECTION_RESPONSES(collectionId), body);
		return { json: (response.response as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async update(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const responseId = this.getNodeParameter('responseId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		const body: IDataObject = { response: { ...updateFields } };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.COLLECTION_RESPONSE(collectionId, responseId), body);
		return { json: (response.response as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async delete(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const responseId = this.getNodeParameter('responseId', i) as string;
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.COLLECTION_RESPONSE(collectionId, responseId));
		return { json: (response.response as IDataObject) ?? response, pairedItem: { item: i } };
	},
};

export async function executeCollectionResponse(
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

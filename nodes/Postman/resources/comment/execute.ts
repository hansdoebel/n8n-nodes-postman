import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.COLLECTION_COMMENTS(collectionId));
		return { json: response, pairedItem: { item: i } };
	},

	async create(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const bodyText = this.getNodeParameter('body', i) as string;
		const body: IDataObject = { body: bodyText };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.COLLECTION_COMMENTS(collectionId), body);
		return { json: (response.comment as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async update(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const commentId = this.getNodeParameter('commentId', i) as number;
		const bodyText = this.getNodeParameter('body', i) as string;
		const body: IDataObject = { body: bodyText };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.COLLECTION_COMMENT(collectionId, String(commentId)), body);
		return { json: (response.comment as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async delete(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const commentId = this.getNodeParameter('commentId', i) as number;
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.COLLECTION_COMMENT(collectionId, String(commentId)));
		return { json: (response.comment as IDataObject) ?? response, pairedItem: { item: i } };
	},
};

export async function executeComment(
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

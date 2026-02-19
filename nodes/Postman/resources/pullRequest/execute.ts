import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.COLLECTION_PULL_REQUESTS(collectionId));
		return { json: response, pairedItem: { item: i } };
	},

	async create(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const title = this.getNodeParameter('title', i) as string;
		const description = this.getNodeParameter('description', i, '') as string;
		const destinationId = rlcValue(this, 'destinationId', i);
		const body: IDataObject = { title, description, destination: { id: destinationId } };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.COLLECTION_PULL_REQUESTS(collectionId), body);
		return { json: (response.pullRequest as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async get(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const pullRequestId = this.getNodeParameter('pullRequestId', i) as string;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.PULL_REQUEST(pullRequestId));
		return { json: (response.pullRequest as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async update(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const pullRequestId = this.getNodeParameter('pullRequestId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.PULL_REQUEST(pullRequestId), updateFields);
		return { json: (response.pullRequest as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async delete(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const pullRequestId = this.getNodeParameter('pullRequestId', i) as string;
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.PULL_REQUEST(pullRequestId));
		return { json: (response.pullRequest as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async merge(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const pullRequestId = this.getNodeParameter('pullRequestId', i) as string;
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.PULL_REQUEST_MERGE(pullRequestId));
		return { json: (response.pullRequest as IDataObject) ?? response, pairedItem: { item: i } };
	},
};

export async function executePullRequest(
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

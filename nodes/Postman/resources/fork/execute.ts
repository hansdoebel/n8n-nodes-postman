import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const qs: IDataObject = { ...additionalFields };
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.COLLECTION_FORKS(collectionId), {}, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async getUserForks(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const qs: IDataObject = { ...additionalFields };
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.COLLECTION_FORKS_MERGE, {}, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async merge(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const source = rlcValue(this, 'source', i);
		const destination = rlcValue(this, 'destination', i);
		const strategy = this.getNodeParameter('strategy', i) as string;
		const body: IDataObject = { source, destination, strategy };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.COLLECTION_MERGES, body);
		return { json: response, pairedItem: { item: i } };
	},

	async getSourceStatus(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const collectionId = rlcValue(this, 'collectionId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.COLLECTION_SOURCE_STATUS(collectionId));
		return { json: response, pairedItem: { item: i } };
	},
};

export async function executeFork(
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

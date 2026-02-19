import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(i) {
		const apiId = rlcValue(this, 'apiId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.API_SCHEMAS(apiId));
		return { json: response, pairedItem: { item: i } };
	},

	async get(i) {
		const apiId = rlcValue(this, 'apiId', i);
		const schemaId = this.getNodeParameter('schemaId', i) as string;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.API_SCHEMA(apiId, schemaId));
		return { json: (response.schema as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async create(i) {
		const apiId = rlcValue(this, 'apiId', i);
		const type = this.getNodeParameter('type', i) as string;
		const schema = this.getNodeParameter('schema', i) as string;
		const body: IDataObject = { type, schema };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.API_SCHEMAS(apiId), body);
		return { json: (response.schema as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async update(i) {
		const apiId = rlcValue(this, 'apiId', i);
		const schemaId = this.getNodeParameter('schemaId', i) as string;
		const schema = this.getNodeParameter('schema', i) as string;
		const body: IDataObject = { schema };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.API_SCHEMA(apiId, schemaId), body);
		return { json: (response.schema as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async delete(i) {
		const apiId = rlcValue(this, 'apiId', i);
		const schemaId = this.getNodeParameter('schemaId', i) as string;
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.API_SCHEMA(apiId, schemaId));
		return { json: (response.schema as IDataObject) ?? response, pairedItem: { item: i } };
	},
};

export async function executeSpec(
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

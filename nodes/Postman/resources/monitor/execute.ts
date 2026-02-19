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
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.MONITORS, {}, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async get(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const monitorId = rlcValue(this, 'monitorId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.MONITOR(monitorId));
		return { json: (response.monitor as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async create(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const name = this.getNodeParameter('name', i) as string;
		const collectionId = rlcValue(this, 'collectionId', i);
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const qs: IDataObject = {};
		if (workspaceId) qs.workspace = workspaceId;
		const monitorBody: IDataObject = { name, collection: collectionId };
		if (additionalFields.environment) monitorBody.environment = additionalFields.environment;
		if (additionalFields.cron) {
			monitorBody.schedule = { cron: additionalFields.cron };
		}
		const body: IDataObject = { monitor: monitorBody };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.MONITORS, body, qs);
		return { json: (response.monitor as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async update(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const monitorId = rlcValue(this, 'monitorId', i);
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		const body: IDataObject = { monitor: { ...updateFields } };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.MONITOR(monitorId), body);
		return { json: (response.monitor as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async delete(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const monitorId = rlcValue(this, 'monitorId', i);
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.MONITOR(monitorId));
		return { json: (response.monitor as IDataObject) ?? response, pairedItem: { item: i } };
	},

	async run(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const monitorId = rlcValue(this, 'monitorId', i);
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.MONITOR_RUN(monitorId));
		return { json: (response.run as IDataObject) ?? response, pairedItem: { item: i } };
	},
};

export async function executeMonitor(
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

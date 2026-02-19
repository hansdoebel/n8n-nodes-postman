import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(i) {
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		const qs: IDataObject = {};
		if (options.cursor) qs.cursor = options.cursor;
		if (options.limit) qs.limit = options.limit;
		if (options.settings) qs.settings = options.settings;
		if (options.userRoles) qs.userRoles = options.userRoles;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.TEAMS, undefined, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async get(i) {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		const qs: IDataObject = {};
		if ((options.include as string[])?.length) {
			qs.include = (options.include as string[]).join(',');
		}
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.TEAM(teamId), undefined, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async create(i) {
		const name = this.getNodeParameter('name', i) as string;
		const description = this.getNodeParameter('description', i, '') as string;
		const body: IDataObject = { name };
		if (description) body.description = description;
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.TEAMS, body);
		return { json: response, pairedItem: { item: i } };
	},

	async getAccessRequests(i) {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		const qs: IDataObject = {};
		if (options.cursor) qs.cursor = options.cursor;
		if (options.limit) qs.limit = options.limit;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.TEAM_ACCESS_REQUESTS(teamId), undefined, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async createAccessRequest(i) {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const entityList = ((this.getNodeParameter('entityList', i, {}) as IDataObject).values as IDataObject[]) ?? [];
		const role = this.getNodeParameter('role', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = { entityList, role };
		if (additionalFields.reason) body.reason = additionalFields.reason;
		if (additionalFields.requestType) body.requestType = additionalFields.requestType;
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.TEAM_ACCESS_REQUESTS(teamId), body);
		return { json: response, pairedItem: { item: i } };
	},

	async approveAccessRequest(i) {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const requestId = this.getNodeParameter('requestId', i) as string;
		const action = this.getNodeParameter('action', i) as string;
		const body: IDataObject = { action };
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.TEAM_ACCESS_REQUEST(teamId, requestId), body);
		return { json: response, pairedItem: { item: i } };
	},

	async manageMemberRoles(i) {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const addRoles = this.getNodeParameter('addRoles', i, '{}') as IDataObject;
		const removeRoles = this.getNodeParameter('removeRoles', i, '{}') as IDataObject;
		const body: IDataObject = {};
		if (Object.keys(addRoles).length) body.add = addRoles;
		if (Object.keys(removeRoles).length) body.remove = removeRoles;
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.TEAM_BULK_MEMBERS(teamId), body);
		return { json: response, pairedItem: { item: i } };
	},

	async removeMembers(i) {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const entities = ((this.getNodeParameter('entities', i, {}) as IDataObject).values as IDataObject[]) ?? [];
		const body: IDataObject = { entities };
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.TEAM_BULK_MEMBERS(teamId), body);
		return { json: response, pairedItem: { item: i } };
	},

	async getSettings(i) {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.TEAM_SETTINGS(teamId));
		return { json: response, pairedItem: { item: i } };
	},

	async updateSettings(i) {
		const teamId = this.getNodeParameter('teamId', i) as string;
		const settings = this.getNodeParameter('settings', i, {}) as IDataObject;
		const body: IDataObject = { settings };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.TEAM_SETTINGS(teamId), body);
		return { json: response, pairedItem: { item: i } };
	},
};

export async function executeTeam(
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

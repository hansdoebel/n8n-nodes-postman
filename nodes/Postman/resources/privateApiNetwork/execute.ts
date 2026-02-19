import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const qs: IDataObject = {};
		if (additionalFields.name) qs.name = additionalFields.name;
		if (additionalFields.description) qs.description = additionalFields.description;
		if (additionalFields.summary) qs.summary = additionalFields.summary;
		if (additionalFields.type) qs.type = additionalFields.type;
		if (additionalFields.parentFolderId !== undefined) qs.parentFolderId = additionalFields.parentFolderId;
		if (additionalFields.createdBy) qs.createdBy = additionalFields.createdBy;
		if (additionalFields.addedBy) qs.addedBy = additionalFields.addedBy;
		if (additionalFields.offset !== undefined) qs.offset = additionalFields.offset;
		if (additionalFields.limit !== undefined) qs.limit = additionalFields.limit;
		if (additionalFields.direction) qs.direction = additionalFields.direction;
		if (additionalFields.sort) qs.sort = additionalFields.sort;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.NETWORK_PRIVATE, {}, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async getRequests(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const qs: IDataObject = {};
		if (additionalFields.name) qs.name = additionalFields.name;
		if (additionalFields.type) qs.type = additionalFields.type;
		if (additionalFields.status) qs.status = additionalFields.status;
		if (additionalFields.requestedBy) qs.requestedBy = additionalFields.requestedBy;
		if (additionalFields.offset !== undefined) qs.offset = additionalFields.offset;
		if (additionalFields.limit !== undefined) qs.limit = additionalFields.limit;
		if (additionalFields.direction) qs.direction = additionalFields.direction;
		if (additionalFields.sort) qs.sort = additionalFields.sort;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.NETWORK_PRIVATE_REQUEST_ALL, {}, qs);
		return { json: response, pairedItem: { item: i } };
	},

	async add(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const elementType = this.getNodeParameter('elementType', i) as string;
		const body: IDataObject = {};
		if (elementType === 'folder') {
			const folderName = this.getNodeParameter('folderName', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
			body.type = 'folder';
			body.name = folderName;
			if (additionalFields.folderDescription) body.description = additionalFields.folderDescription;
			if (additionalFields.parentFolderId !== undefined) body.parentFolderId = additionalFields.parentFolderId;
		} else {
			const elementId = this.getNodeParameter('elementId', i) as string;
			const parentFolderId = this.getNodeParameter('parentFolderId', i) as number;
			body.type = elementType;
			body.id = elementId;
			body.parentFolderId = parentFolderId;
		}
		const response = await postmanApiRequest.call(this, 'POST', ENDPOINTS.NETWORK_PRIVATE, body);
		return { json: response, pairedItem: { item: i } };
	},

	async update(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const elementType = this.getNodeParameter('elementType', i) as string;
		const elementId = this.getNodeParameter('elementId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		const body: IDataObject = {};
		if (updateFields.parentFolderId !== undefined) body.parentFolderId = updateFields.parentFolderId;
		if (updateFields.folderName) body.name = updateFields.folderName;
		if (updateFields.folderDescription) body.description = updateFields.folderDescription;
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.NETWORK_PRIVATE_ELEMENT(elementType, elementId), body);
		return { json: response, pairedItem: { item: i } };
	},

	async remove(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
		const elementType = this.getNodeParameter('elementType', i) as string;
		const elementId = this.getNodeParameter('elementId', i) as string;
		const response = await postmanApiRequest.call(this, 'DELETE', ENDPOINTS.NETWORK_PRIVATE_ELEMENT(elementType, elementId));
		return { json: response, pairedItem: { item: i } };
	},
};

export async function executePrivateApiNetwork(
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

import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getCollectionTags(i) {
		const collectionId = rlcValue(this, 'collectionId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.COLLECTION_TAGS(collectionId));
		return { json: response, pairedItem: { item: i } };
	},

	async setCollectionTags(i) {
		const collectionId = rlcValue(this, 'collectionId', i);
		const tagsRaw = this.getNodeParameter('tags', i) as string;
		const tags = tagsRaw.split(',').map((t) => ({ slug: t.trim() })).filter((t) => t.slug);
		const body: IDataObject = { tags };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.COLLECTION_TAGS(collectionId), body);
		return { json: response, pairedItem: { item: i } };
	},

	async getWorkspaceTags(i) {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.WORKSPACE_TAGS(workspaceId));
		return { json: response, pairedItem: { item: i } };
	},

	async setWorkspaceTags(i) {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const tagsRaw = this.getNodeParameter('tags', i) as string;
		const tags = tagsRaw.split(',').map((t) => ({ slug: t.trim() })).filter((t) => t.slug);
		const body: IDataObject = { tags };
		const response = await postmanApiRequest.call(this, 'PUT', ENDPOINTS.WORKSPACE_TAGS(workspaceId), body);
		return { json: response, pairedItem: { item: i } };
	},

	async getTaggedEntities(i) {
		const tagSlug = this.getNodeParameter('tagSlug', i) as string;
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.TAGS_ENTITIES(tagSlug));
		return { json: response, pairedItem: { item: i } };
	},
};

export async function executeTag(
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

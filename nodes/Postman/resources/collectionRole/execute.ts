import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(i) {
		const collectionId = rlcValue(this, 'collectionId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.COLLECTION_ROLES(collectionId));
		return { json: response, pairedItem: { item: i } };
	},

	async update(i) {
		const collectionId = rlcValue(this, 'collectionId', i);
		const rolesParam = (this.getNodeParameter('roles', i, {}) as IDataObject).values as IDataObject[] ?? [];
		const roles = rolesParam.map((r) => ({
			op: r.op,
			path: `/role/${r.role}`,
			entity: {
				type: r.entityType,
				id: r.entityId,
			},
		}));
		const response = await postmanApiRequest.call(this, 'PATCH', ENDPOINTS.COLLECTION_ROLES(collectionId), { roles });
		return { json: response, pairedItem: { item: i } };
	},
};

export async function executeCollectionRole(
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

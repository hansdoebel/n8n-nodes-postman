import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { postmanApiRequest } from '../../transport';
import { rlcValue } from '../../utils/helpers';
import { ENDPOINTS } from '../../utils/constants';

type OperationHandler = (this: IExecuteFunctions, i: number) => Promise<INodeExecutionData>;

const operations: Record<string, OperationHandler> = {
	async getAll(i) {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.WORKSPACE_ROLES(workspaceId));
		return { json: response, pairedItem: { item: i } };
	},

	async getRoleTypes(i) {
		const response = await postmanApiRequest.call(this, 'GET', ENDPOINTS.WORKSPACE_ROLE_TYPES);
		return { json: response, pairedItem: { item: i } };
	},

	async update(i) {
		const workspaceId = rlcValue(this, 'workspaceId', i);
		const rolesParam = (this.getNodeParameter('roles', i, {}) as IDataObject).values as IDataObject[] ?? [];
		const roles = rolesParam.map((r) => ({
			op: r.op,
			path: `/role/${r.role}`,
			entity: {
				type: r.entityType,
				id: r.entityId,
			},
		}));
		const response = await postmanApiRequest.call(this, 'PATCH', ENDPOINTS.WORKSPACE_ROLES(workspaceId), { roles });
		return { json: response, pairedItem: { item: i } };
	},
};

export async function executeWorkspaceRole(
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
